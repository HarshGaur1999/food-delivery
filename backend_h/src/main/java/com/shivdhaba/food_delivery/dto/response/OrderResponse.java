package com.shivdhaba.food_delivery.dto.response;

import com.shivdhaba.food_delivery.domain.enums.OrderStatus;
import com.shivdhaba.food_delivery.domain.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String customerMobile;
    private Long deliveryBoyId;
    private String deliveryBoyName;
    private String deliveryBoyMobile;
    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private String deliveryCity;
    private String specialInstructions;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime acceptedAt;
    private LocalDateTime readyAt;
    private LocalDateTime outForDeliveryAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private PaymentResponse payment;
}

