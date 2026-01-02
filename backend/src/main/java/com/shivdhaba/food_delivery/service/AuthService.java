package com.shivdhaba.food_delivery.service;

import com.shivdhaba.food_delivery.domain.entity.User;
import com.shivdhaba.food_delivery.domain.enums.Role;
import com.shivdhaba.food_delivery.dto.request.AdminLoginRequest;
import com.shivdhaba.food_delivery.dto.request.AdminOtpRequest;
import com.shivdhaba.food_delivery.dto.request.AdminOtpVerifyRequest;
import com.shivdhaba.food_delivery.dto.request.AdminRegisterRequest;
import com.shivdhaba.food_delivery.dto.request.OtpRequest;
import com.shivdhaba.food_delivery.dto.request.OtpVerifyRequest;
import com.shivdhaba.food_delivery.dto.response.AuthResponse;
import com.shivdhaba.food_delivery.dto.response.OtpResponse;
import com.shivdhaba.food_delivery.dto.response.UserResponse;
import com.shivdhaba.food_delivery.exception.UnauthorizedException;
import com.shivdhaba.food_delivery.exception.ForbiddenException;
import com.shivdhaba.food_delivery.repository.UserRepository;
import com.shivdhaba.food_delivery.util.JwtUtil;
import com.shivdhaba.food_delivery.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PreDestroy;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final OtpUtil otpUtil;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    
    // Redis is optional - use in-memory storage as fallback
    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;
    
    // In-memory OTP storage as fallback when Redis is not available
    private final ConcurrentHashMap<String, OtpEntry> inMemoryOtpStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    @Value("${otp.expiration-minutes}")
    private int otpExpirationMinutes;
    
    // Inner class for OTP storage with expiration and attempts tracking
    private static class OtpEntry {
        final String otp;
        final long expirationTime;
        int attempts;
        final int maxAttempts = 3;
        
        OtpEntry(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
            this.attempts = 0;
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() > expirationTime;
        }
        
        boolean isMaxAttemptsReached() {
            return attempts >= maxAttempts;
        }
        
        void incrementAttempts() {
            this.attempts++;
        }
    }
    
    public OtpResponse sendOtp(OtpRequest request) {
        String mobileNumber = request.getMobileNumber();
        String otp = otpUtil.generateOtp();
        
        String otpKey = "otp:" + mobileNumber;
        
        // Use Redis if available, otherwise use in-memory storage
        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(otpKey, otp, otpExpirationMinutes, TimeUnit.MINUTES);
        } else {
            long expirationTime = System.currentTimeMillis() + (otpExpirationMinutes * 60 * 1000L);
            inMemoryOtpStore.put(otpKey, new OtpEntry(otp, expirationTime));
            // Schedule cleanup
            scheduler.schedule(() -> inMemoryOtpStore.remove(otpKey), otpExpirationMinutes, TimeUnit.MINUTES);
        }
        
        // In production, send OTP via SMS service
        // For now, we'll log it (remove in production)
        System.out.println("OTP for " + mobileNumber + ": " + otp);
        
        return OtpResponse.builder()
                .message("OTP sent successfully")
                .expiresInSeconds((long) (otpExpirationMinutes * 60))
                .build();
    }
    
    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request, Role role) {
        String mobileNumber = request.getMobileNumber();
        String otp = request.getOtp();
        
        String otpKey = "otp:" + mobileNumber;
        String storedOtp = null;
        
        // Get OTP from Redis or in-memory storage
        if (redisTemplate != null) {
            storedOtp = (String) redisTemplate.opsForValue().get(otpKey);
            if (storedOtp != null) {
                redisTemplate.delete(otpKey);
            }
        } else {
            OtpEntry entry = inMemoryOtpStore.get(otpKey);
            if (entry != null && !entry.isExpired()) {
                storedOtp = entry.otp;
                inMemoryOtpStore.remove(otpKey);
            }
        }
        
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }
        
        // Find or create user
        User user = userRepository.findByMobileNumberAndRole(mobileNumber, role)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .mobileNumber(mobileNumber)
                            .role(role)
                            .isActive(true)
                            .build();
                    return userRepository.save(newUser);
                });
        
        if (!user.getIsActive()) {
            throw new UnauthorizedException("User account is inactive");
        }
        
        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getMobileNumber(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getMobileNumber());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponse.builder()
                        .id(user.getId())
                        .mobileNumber(user.getMobileNumber())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .isActive(user.getIsActive())
                        .build())
                .build();
    }
    
    @Transactional
    public AuthResponse createAdminUser(AdminRegisterRequest request) {
        if (userRepository.findByMobileNumber(request.getMobileNumber()).isPresent()) {
            throw new IllegalArgumentException("User with this mobile number already exists");
        }

        User adminUser = User.builder()
                .mobileNumber(request.getMobileNumber())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .isActive(true)
                .build();

        adminUser = userRepository.save(adminUser);

        String accessToken = jwtUtil.generateAccessToken(adminUser.getMobileNumber(), adminUser.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(adminUser.getMobileNumber());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponse.builder()
                        .id(adminUser.getId())
                        .mobileNumber(adminUser.getMobileNumber())
                        .fullName(adminUser.getFullName())
                        .email(adminUser.getEmail())
                        .role(adminUser.getRole())
                        .isActive(adminUser.getIsActive())
                        .build())
                .build();
    }

    // Hardcoded admin credentials
    private static final String ADMIN_EMAIL = "harshg101999@gmail.com";
    private static final String ADMIN_PHONE = "9389110115";
    
    public OtpResponse sendAdminOtp(AdminOtpRequest request) {
        String emailOrPhone = request.getEmailOrPhone().trim();
        
        // STRICT VALIDATION: Only hard-coded admin credentials allowed
        boolean isValid = ADMIN_EMAIL.equalsIgnoreCase(emailOrPhone) 
                || ADMIN_PHONE.equals(emailOrPhone);
        
        // Return 403 Forbidden for non-admin attempts (as per requirements)
        if (!isValid) {
            throw new ForbiddenException("Not an Admin");
        }
        
        String identifier = emailOrPhone;
        String otpKey = "otp:admin:" + identifier;
        String otp = otpUtil.generateOtp();
        
        // OTP expiry: 5 minutes (300 seconds)
        int otpExpiryMinutes = 5;
        long expirationTime = System.currentTimeMillis() + (otpExpiryMinutes * 60 * 1000L);
        
        // Use Redis if available, otherwise use in-memory storage
        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(otpKey, otp, otpExpiryMinutes, TimeUnit.MINUTES);
        } else {
            inMemoryOtpStore.put(otpKey, new OtpEntry(otp, expirationTime));
            scheduler.schedule(() -> inMemoryOtpStore.remove(otpKey), otpExpiryMinutes, TimeUnit.MINUTES);
        }
        
        // Log OTP to console (NO SMS/Email integration as per requirements)
        System.out.println("========================================");
        System.out.println("ADMIN OTP for " + identifier + ": " + otp);
        System.out.println("Expires in: " + otpExpiryMinutes + " minutes");
        System.out.println("Max attempts: 3");
        System.out.println("========================================");
        
        return OtpResponse.builder()
                .message("OTP sent successfully")
                .expiresInSeconds((long) (otpExpiryMinutes * 60))
                .build();
    }
    
    @Transactional
    public AuthResponse verifyAdminOtp(AdminOtpVerifyRequest request) {
        String emailOrPhone = request.getEmailOrPhone().trim();
        String otp = request.getOtp();
        
        // STRICT VALIDATION: Only hard-coded admin credentials allowed
        boolean isValid = ADMIN_EMAIL.equalsIgnoreCase(emailOrPhone) 
                || ADMIN_PHONE.equals(emailOrPhone);
        
        // Return 403 Forbidden for non-admin attempts
        if (!isValid) {
            throw new ForbiddenException("Not an Admin");
        }
        
        String identifier = emailOrPhone;
        String otpKey = "otp:admin:" + identifier;
        OtpEntry entry = null;
        String storedOtp = null;
        
        // Get OTP from Redis or in-memory storage
        if (redisTemplate != null) {
            storedOtp = (String) redisTemplate.opsForValue().get(otpKey);
        } else {
            entry = inMemoryOtpStore.get(otpKey);
            if (entry != null) {
                // Check if expired
                if (entry.isExpired()) {
                    inMemoryOtpStore.remove(otpKey);
                    throw new UnauthorizedException("OTP has expired");
                }
                // Check if max attempts reached
                if (entry.isMaxAttemptsReached()) {
                    inMemoryOtpStore.remove(otpKey);
                    throw new UnauthorizedException("Maximum OTP attempts exceeded. Please request a new OTP");
                }
                storedOtp = entry.otp;
            }
        }
        
        // Validate OTP
        if (storedOtp == null) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }
        
        if (!storedOtp.equals(otp)) {
            // Increment attempts for in-memory storage
            if (entry != null) {
                entry.incrementAttempts();
                int remainingAttempts = entry.maxAttempts - entry.attempts;
                if (entry.isMaxAttemptsReached()) {
                    inMemoryOtpStore.remove(otpKey);
                    throw new UnauthorizedException("Maximum OTP attempts exceeded. Please request a new OTP");
                }
                throw new UnauthorizedException("Invalid OTP. " + remainingAttempts + " attempt(s) remaining");
            } else {
                // For Redis, we'd need to track attempts separately
                throw new UnauthorizedException("Invalid OTP");
            }
        }
        
        // OTP is valid - invalidate it
        if (redisTemplate != null) {
            redisTemplate.delete(otpKey);
        } else {
            inMemoryOtpStore.remove(otpKey);
        }
        
        // ✅ FIX: Find existing admin user ONLY - NO registration
        // Admins are pre-created in database, never auto-registered
        boolean isEmail = emailOrPhone.contains("@");
        User admin = null;
        
        if (isEmail) {
            admin = userRepository.findByEmailAndRole(emailOrPhone, Role.ADMIN)
                    .orElseThrow(() -> new UnauthorizedException("Admin account not found. Please contact system administrator."));
        } else {
            admin = userRepository.findByMobileNumberAndRole(emailOrPhone, Role.ADMIN)
                    .orElseThrow(() -> new UnauthorizedException("Admin account not found. Please contact system administrator."));
        }
        
        // Validate admin account is active
        if (!admin.getIsActive()) {
            throw new UnauthorizedException("Admin account is inactive. Please contact system administrator.");
        }
        
        // ✅ FIX: No user updates during login - admins are pre-configured
        // Removed update logic - admins should be properly configured in database
        
        // Generate tokens with ROLE_ADMIN (ensure role is ADMIN)
        String accessToken = jwtUtil.generateAccessToken(admin.getEmail() != null ? admin.getEmail() : admin.getMobileNumber(), "ADMIN");
        String refreshToken = jwtUtil.generateRefreshToken(admin.getEmail() != null ? admin.getEmail() : admin.getMobileNumber());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponse.builder()
                        .id(admin.getId())
                        .mobileNumber(admin.getMobileNumber())
                        .fullName(admin.getFullName())
                        .email(admin.getEmail())
                        .role(admin.getRole())
                        .isActive(admin.getIsActive())
                        .build())
                .build();
    }

    public AuthResponse adminLogin(AdminLoginRequest request) {
        User admin = userRepository.findByMobileNumberAndRole(request.getUsername(), Role.ADMIN)
                .orElseGet(() -> {
                    return userRepository.findByMobileNumber(request.getUsername())
                            .filter(u -> u.getRole() == Role.ADMIN)
                            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
                });
        
        if (!admin.getIsActive()) {
            throw new UnauthorizedException("Admin account is inactive");
        }
        
        if (admin.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        
        String accessToken = jwtUtil.generateAccessToken(admin.getMobileNumber(), admin.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(admin.getMobileNumber());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponse.builder()
                        .id(admin.getId())
                        .mobileNumber(admin.getMobileNumber())
                        .fullName(admin.getFullName())
                        .email(admin.getEmail())
                        .role(admin.getRole())
                        .isActive(admin.getIsActive())
                        .build())
                .build();
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String username = jwtUtil.extractUsername(refreshToken);
            if (!jwtUtil.validateToken(refreshToken, username)) {
                throw new UnauthorizedException("Invalid refresh token");
            }
            
            User user = userRepository.findByMobileNumber(username)
                    .orElseThrow(() -> new UnauthorizedException("User not found"));
            
            if (!user.getIsActive()) {
                throw new UnauthorizedException("User account is inactive");
            }
            
            String newAccessToken = jwtUtil.generateAccessToken(user.getMobileNumber(), user.getRole().name());
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getMobileNumber());
            
            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .user(UserResponse.builder()
                            .id(user.getId())
                            .mobileNumber(user.getMobileNumber())
                            .fullName(user.getFullName())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .isActive(user.getIsActive())
                            .build())
                    .build();
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }
    
    @PreDestroy
    public void cleanup() {
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
}

