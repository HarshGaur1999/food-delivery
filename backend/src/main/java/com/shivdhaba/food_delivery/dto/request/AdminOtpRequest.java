package com.shivdhaba.food_delivery.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminOtpRequest {
    @NotBlank(message = "Email or phone number is required")
    private String emailOrPhone;
}



