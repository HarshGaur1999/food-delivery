package com.shivdhaba.food_delivery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateMenuItemRequest {
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    @NotBlank(message = "Item name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @Positive(message = "Discount price must be positive")
    private BigDecimal discountPrice;
    
    private String imageUrl;
    private Integer preparationTimeMinutes;
    private Boolean isVegetarian = true;
    private Integer displayOrder = 0;
}






















