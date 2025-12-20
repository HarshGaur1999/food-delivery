package com.shivdhaba.food_delivery.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class OrderNumberGenerator {
    
    public String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.valueOf((int)(Math.random() * 10000));
        return "ORD" + timestamp + random;
    }
}

