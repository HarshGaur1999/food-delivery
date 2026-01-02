package com.shivdhaba.food_delivery.dto.request;

import com.shivdhaba.food_delivery.domain.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Status is required")
    private OrderStatus status;
}





















