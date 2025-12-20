package com.shivdhaba.food_delivery.service;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * In-memory OTP storage implementation.
 * Used when Redis is not available.
 * 
 * Note: This implementation is suitable for development and single-instance deployments.
 * For production with multiple instances, use Redis implementation.
 */
@Slf4j
@Service
public class InMemoryOtpStorageService implements OtpStorageService {
    
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    private static class OtpEntry {
        final String otp;
        final long expirationTime;
        
        OtpEntry(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() > expirationTime;
        }
    }
    
    @Override
    public void storeOtp(String mobileNumber, String otp, int expirationMinutes) {
        long expirationTime = System.currentTimeMillis() + (expirationMinutes * 60 * 1000L);
        otpStore.put(mobileNumber, new OtpEntry(otp, expirationTime));
        
        // Schedule cleanup after expiration
        scheduler.schedule(() -> {
            OtpEntry entry = otpStore.get(mobileNumber);
            if (entry != null && entry.isExpired()) {
                otpStore.remove(mobileNumber);
                log.debug("OTP expired and removed for mobile: {}", mobileNumber);
            }
        }, expirationMinutes, TimeUnit.MINUTES);
        
        log.debug("OTP stored for mobile: {} (expires in {} minutes)", mobileNumber, expirationMinutes);
    }
    
    @Override
    public String getOtp(String mobileNumber) {
        OtpEntry entry = otpStore.get(mobileNumber);
        if (entry == null) {
            log.debug("OTP not found for mobile: {}", mobileNumber);
            return null;
        }
        
        if (entry.isExpired()) {
            otpStore.remove(mobileNumber);
            log.debug("OTP expired for mobile: {}", mobileNumber);
            return null;
        }
        
        return entry.otp;
    }
    
    @Override
    public void deleteOtp(String mobileNumber) {
        otpStore.remove(mobileNumber);
        log.debug("OTP deleted for mobile: {}", mobileNumber);
    }
    
    @PreDestroy
    public void shutdown() {
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
        log.debug("InMemoryOtpStorageService scheduler shut down");
    }
}

