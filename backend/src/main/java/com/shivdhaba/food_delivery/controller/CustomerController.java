package com.shivdhaba.food_delivery.controller;

import com.shivdhaba.food_delivery.dto.request.PlaceOrderRequest;
import com.shivdhaba.food_delivery.dto.response.ApiResponse;
import com.shivdhaba.food_delivery.dto.response.OrderResponse;
import com.shivdhaba.food_delivery.dto.response.PaymentResponse;
import com.shivdhaba.food_delivery.dto.request.ReviewRequest;
import com.shivdhaba.food_delivery.dto.response.ReviewResponse;
import com.shivdhaba.food_delivery.service.NotificationService;
import com.shivdhaba.food_delivery.domain.entity.Order;
import com.shivdhaba.food_delivery.service.OrderService;
import com.shivdhaba.food_delivery.service.PaymentService;
import com.shivdhaba.food_delivery.service.ReviewService;
import com.shivdhaba.food_delivery.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
public class CustomerController {
    
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final ReviewService reviewService;
    private final SecurityUtil securityUtil;
    
    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            Authentication authentication) {
        Long customerId = securityUtil.getCurrentUserId(authentication);
        OrderResponse order = orderService.placeOrder(customerId, request);
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order placed successfully")
                .data(order)
                .build());
    }
    
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication authentication) {
        Long customerId = securityUtil.getCurrentUserId(authentication);
        List<OrderResponse> orders = orderService.getCustomerOrders(customerId);
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .success(true)
                .message("Orders retrieved successfully")
                .data(orders)
                .build());
    }
    
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        Long customerId = securityUtil.getCurrentUserId(authentication);
        OrderResponse order = orderService.getOrder(orderId);
        
        // Verify order belongs to customer
        if (!order.getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order retrieved successfully")
                .data(order)
                .build());
    }
    
    @PostMapping("/orders/{orderId}/payment/razorpay/create")
    public ResponseEntity<ApiResponse<String>> createRazorpayOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        Long customerId = securityUtil.getCurrentUserId(authentication);
        OrderResponse order = orderService.getOrder(orderId);
        
        if (!order.getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).build();
        }
        
        Order orderEntity = orderService.getOrderEntity(orderId);
        String razorpayOrderId = paymentService.createRazorpayOrder(orderEntity);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Razorpay order created successfully")
                .data(razorpayOrderId)
                .build());
    }
    
    @PostMapping("/orders/{orderId}/payment/razorpay/verify")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyRazorpayPayment(
            @PathVariable Long orderId,
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature,
            Authentication authentication) {
        Long customerId = securityUtil.getCurrentUserId(authentication);
        OrderResponse order = orderService.getOrder(orderId);
        
        if (!order.getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).build();
        }
        
        PaymentResponse payment = paymentService.verifyPayment(
                razorpayOrderId, razorpayPaymentId, razorpaySignature);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Payment verified successfully")
                .data(payment)
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
    
    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        Long customerId = securityUtil.getCurrentUserId(authentication);
        ReviewResponse review = reviewService.createReview(customerId, request);
        return ResponseEntity.ok(ApiResponse.<ReviewResponse>builder()
                .success(true)
                .message("Review submitted successfully")
                .data(review)
                .build());
    }
    
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(Authentication authentication) {
        Long customerId = securityUtil.getCurrentUserId(authentication);
        List<ReviewResponse> reviews = reviewService.getCustomerReviews(customerId);
        return ResponseEntity.ok(ApiResponse.<List<ReviewResponse>>builder()
                .success(true)
                .message("Reviews retrieved successfully")
                .data(reviews)
                .build());
    }
}

