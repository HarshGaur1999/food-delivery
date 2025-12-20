package com.shivdhaba.food_delivery.dto.response;

import com.shivdhaba.food_delivery.domain.enums.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private ItemStatus status;
    private Integer preparationTimeMinutes;
    private Boolean isVegetarian;
    private Boolean isSpicy;
    private Integer displayOrder;
}

