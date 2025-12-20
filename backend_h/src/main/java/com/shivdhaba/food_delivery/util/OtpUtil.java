package com.shivdhaba.food_delivery.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OtpUtil {
    
    @Value("${otp.length}")
    private int otpLength;
    
    public String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}

