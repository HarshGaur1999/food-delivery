package com.shivdhaba.food_delivery.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignDeliveryBoyRequest {
    @NotNull(message = "Delivery boy ID is required")
    private Long deliveryBoyId;
}





















