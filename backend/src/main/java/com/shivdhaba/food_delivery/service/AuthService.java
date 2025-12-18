package com.shivdhaba.food_delivery.service;

import com.shivdhaba.food_delivery.domain.entity.User;
import com.shivdhaba.food_delivery.domain.enums.Role;
import com.shivdhaba.food_delivery.dto.request.AdminLoginRequest;
import com.shivdhaba.food_delivery.dto.request.OtpRequest;
import com.shivdhaba.food_delivery.dto.request.OtpVerifyRequest;
import com.shivdhaba.food_delivery.dto.response.AuthResponse;
import com.shivdhaba.food_delivery.dto.response.OtpResponse;
import com.shivdhaba.food_delivery.dto.response.UserResponse;
import com.shivdhaba.food_delivery.exception.UnauthorizedException;
import com.shivdhaba.food_delivery.repository.UserRepository;
import com.shivdhaba.food_delivery.util.JwtUtil;
import com.shivdhaba.food_delivery.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final OtpUtil otpUtil;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final OtpStorageService otpStorageService;
    
    @Value("${otp.expiration-minutes}")
    private int otpExpirationMinutes;
    
    public OtpResponse sendOtp(OtpRequest request) {
        String mobileNumber = request.getMobileNumber();
        String otp = otpUtil.generateOtp();
        
        // Store OTP using storage service (Redis or in-memory)
        otpStorageService.storeOtp(mobileNumber, otp, otpExpirationMinutes);
        
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
        
        // Verify OTP from storage service (Redis or in-memory)
        String storedOtp = otpStorageService.getOtp(mobileNumber);
        
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }
        
        // Delete OTP after verification
        otpStorageService.deleteOtp(mobileNumber);
        
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
    
    public AuthResponse adminLogin(AdminLoginRequest request) {
        User admin = userRepository.findByMobileNumberAndRole(request.getUsername(), Role.ADMIN)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        
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
}

