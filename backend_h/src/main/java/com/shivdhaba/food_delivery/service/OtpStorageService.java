package com.shivdhaba.food_delivery.service;

/**
 * Interface for OTP storage operations.
 * Allows switching between Redis and in-memory storage implementations.
 */
public interface OtpStorageService {
    
    /**
     * Store OTP for a mobile number with expiration time.
     * 
     * @param mobileNumber The mobile number
     * @param otp The OTP to store
     * @param expirationMinutes Expiration time in minutes
     */
    void storeOtp(String mobileNumber, String otp, int expirationMinutes);
    
    /**
     * Retrieve OTP for a mobile number.
     * 
     * @param mobileNumber The mobile number
     * @return The stored OTP, or null if not found or expired
     */
    String getOtp(String mobileNumber);
    
    /**
     * Delete OTP for a mobile number.
     * 
     * @param mobileNumber The mobile number
     */
    void deleteOtp(String mobileNumber);
}

