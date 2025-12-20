package com.shivdhaba.food_delivery.controller;

import com.shivdhaba.food_delivery.domain.entity.DeliveryBoyDetails;
import com.shivdhaba.food_delivery.domain.entity.DeliveryTracking;
import com.shivdhaba.food_delivery.domain.entity.Order;
import com.shivdhaba.food_delivery.domain.enums.OrderStatus;
import com.shivdhaba.food_delivery.dto.response.ApiResponse;
import com.shivdhaba.food_delivery.dto.response.OrderResponse;
import com.shivdhaba.food_delivery.dto.response.PaymentResponse;
import com.shivdhaba.food_delivery.exception.BadRequestException;
import com.shivdhaba.food_delivery.exception.ResourceNotFoundException;
import com.shivdhaba.food_delivery.repository.DeliveryBoyDetailsRepository;
import com.shivdhaba.food_delivery.repository.DeliveryTrackingRepository;
import com.shivdhaba.food_delivery.repository.OrderRepository;
import com.shivdhaba.food_delivery.repository.UserRepository;
import com.shivdhaba.food_delivery.service.NotificationService;
import com.shivdhaba.food_delivery.service.OrderService;
import com.shivdhaba.food_delivery.service.PaymentService;
import com.shivdhaba.food_delivery.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
public class DeliveryController {
    
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeliveryBoyDetailsRepository deliveryBoyDetailsRepository;
    private final DeliveryTrackingRepository deliveryTrackingRepository;
    private final NotificationService notificationService;
    private final SecurityUtil securityUtil;
    
    @GetMapping("/orders/available")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAvailableOrders() {
        List<Order> orders = orderRepository.findUnassignedOrdersByStatus(OrderStatus.READY);
        List<OrderResponse> orderResponses = orders.stream()
                .map(orderService::mapToOrderResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .success(true)
                .message("Available orders retrieved successfully")
                .data(orderResponses)
                .build());
    }
    
    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        var deliveryBoy = securityUtil.getCurrentUser(authentication);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != OrderStatus.READY) {
            throw new BadRequestException("Order is not ready for delivery");
        }
        
        if (order.getDeliveryBoy() != null) {
            throw new BadRequestException("Order is already assigned");
        }
        
        order.setDeliveryBoy(deliveryBoy);
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        order = orderRepository.save(order);
        
        // Send notification to customer
        notificationService.sendNotificationToUser(order.getCustomer().getId(),
                "Order Out for Delivery",
                "Your order #" + order.getOrderNumber() + " is out for delivery");
        
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order accepted successfully")
                .data(orderService.mapToOrderResponse(order))
                .build());
    }
    
    @PostMapping("/orders/{orderId}/update-location")
    public ResponseEntity<ApiResponse<Void>> updateLocation(
            @PathVariable Long orderId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false) String address,
            Authentication authentication) {
        var deliveryBoy = securityUtil.getCurrentUser(authentication);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getDeliveryBoy() == null || !order.getDeliveryBoy().getId().equals(deliveryBoy.getId())) {
            throw new BadRequestException("Order not assigned to you");
        }
        
        DeliveryTracking tracking = DeliveryTracking.builder()
                .order(order)
                .latitude(latitude)
                .longitude(longitude)
                .address(address)
                .build();
        deliveryTrackingRepository.save(tracking);
        
        // Update delivery boy location
        DeliveryBoyDetails details = deliveryBoyDetailsRepository.findByUser(order.getDeliveryBoy())
                .orElse(null);
        if (details != null) {
            details.setCurrentLatitude(latitude);
            details.setCurrentLongitude(longitude);
            deliveryBoyDetailsRepository.save(details);
        }
        
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Location updated successfully")
                .build());
    }
    
    @PostMapping("/orders/{orderId}/deliver")
    public ResponseEntity<ApiResponse<OrderResponse>> markDelivered(
            @PathVariable Long orderId,
            Authentication authentication) {
        var deliveryBoy = securityUtil.getCurrentUser(authentication);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getDeliveryBoy() == null || !order.getDeliveryBoy().getId().equals(deliveryBoy.getId())) {
            throw new BadRequestException("Order not assigned to you");
        }
        
        if (order.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new BadRequestException("Order is not out for delivery");
        }
        
        order.setStatus(OrderStatus.DELIVERED);
        order = orderRepository.save(order);
        
        // If COD, mark payment as collected
        if (order.getPaymentMethod() == com.shivdhaba.food_delivery.domain.enums.PaymentMethod.COD) {
            paymentService.markCodCollected(orderId);
        }
        
        // Send notifications
        notificationService.sendNotificationToUser(order.getCustomer().getId(),
                "Order Delivered",
                "Your order #" + order.getOrderNumber() + " has been delivered");
        
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order marked as delivered")
                .data(orderService.mapToOrderResponse(order))
                .build());
    }
    
    @GetMapping("/orders/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication authentication) {
        var deliveryBoy = securityUtil.getCurrentUser(authentication);
        
        List<Order> orders = orderRepository.findByDeliveryBoyOrderByCreatedAtDesc(deliveryBoy);
        List<OrderResponse> orderResponses = orders.stream()
                .map(orderService::mapToOrderResponse)
                .toList();
        
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .success(true)
                .message("Orders retrieved successfully")
                .data(orderResponses)
                .build());
    }
    
    @PutMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateStatus(
            @RequestParam Boolean isAvailable,
            @RequestParam Boolean isOnDuty,
            Authentication authentication) {
        var deliveryBoy = securityUtil.getCurrentUser(authentication);
        
        DeliveryBoyDetails details = deliveryBoyDetailsRepository.findByUser(deliveryBoy)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery boy details not found"));
        
        details.setIsAvailable(isAvailable);
        details.setIsOnDuty(isOnDuty);
        deliveryBoyDetailsRepository.save(details);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isAvailable", details.getIsAvailable());
        response.put("isOnDuty", details.getIsOnDuty());
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Status updated successfully")
                .data(response)
                .build());
    }
    
    @PutMapping("/fcm-token")
    public ResponseEntity<ApiResponse<Void>> updateFcmToken(
            @RequestParam String fcmToken,
            Authentication authentication) {
        Long userId = securityUtil.getCurrentUserId(authentication);
        notificationService.updateFcmToken(userId, fcmToken);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("FCM token updated successfully")
                .build());
    }
}

