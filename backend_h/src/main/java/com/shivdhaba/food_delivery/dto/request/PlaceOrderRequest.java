package com.shivdhaba.food_delivery.dto.request;

import com.shivdhaba.food_delivery.domain.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class PlaceOrderRequest {
    @NotNull(message = "Order items are required")
    @NotEmpty(message = "Order items cannot be empty")
    @Valid
    private List<OrderItemRequest> items;
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    @NotNull(message = "Delivery latitude is required")
    @DecimalMin(value = "-90.0", message = "Invalid latitude")
    @DecimalMax(value = "90.0", message = "Invalid latitude")
    private Double deliveryLatitude;
    
    @NotNull(message = "Delivery longitude is required")
    @DecimalMin(value = "-180.0", message = "Invalid longitude")
    @DecimalMax(value = "180.0", message = "Invalid longitude")
    private Double deliveryLongitude;
    
    @NotBlank(message = "Delivery city is required")
    private String deliveryCity;
    
    private String specialInstructions;
    
    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Menu item ID is required")
        private Long menuItemId;
        
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
        
        private String specialInstructions;
    }
}

