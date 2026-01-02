package com.shivdhaba.food_delivery.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateMenuItemRequest {
    private Long categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    @Positive(message = "Discount price must be positive")
    private BigDecimal discountPrice;
    private String imageUrl;
    private Integer preparationTimeMinutes;
    private Boolean isVegetarian;
    private Integer displayOrder;
}






















