package com.shivdhaba.food_delivery.dto.request;

import lombok.Data;

@Data
public class UpdateCategoryRequest {
    private String name;
    private String description;
    private String imageUrl;
    private Integer displayOrder;
}





















