package com.shivdhaba.food_delivery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}

