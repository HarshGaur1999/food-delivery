package com.shivdhaba.food_delivery.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectOrderRequest {
    @NotBlank(message = "Rejection reason is required")
    private String reason;
}





















