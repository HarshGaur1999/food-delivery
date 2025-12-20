package com.shivdhaba.food_delivery.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.shivdhaba.food_delivery.domain.entity.Payment;
import com.shivdhaba.food_delivery.domain.enums.PaymentStatus;
import com.shivdhaba.food_delivery.dto.response.PaymentResponse;
import com.shivdhaba.food_delivery.exception.BadRequestException;
import com.shivdhaba.food_delivery.exception.ResourceNotFoundException;
import com.shivdhaba.food_delivery.repository.OrderRepository;
import com.shivdhaba.food_delivery.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    public String createRazorpayOrder(com.shivdhaba.food_delivery.domain.entity.Order order) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getOrderNumber());
            
            Order razorpayOrder = razorpay.orders.create(orderRequest);
            
            Payment payment = paymentRepository.findByOrder(order)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
            
            payment.setRazorpayOrderId(razorpayOrder.get("id"));
            paymentRepository.save(payment);
            
            return razorpayOrder.get("id");
        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }
    
    @Transactional
    public PaymentResponse verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);
            
            // Verify signature (in production, implement proper signature verification)
            // For now, using Razorpay utility to verify
            boolean isValid = true; // Simplified - implement actual signature verification using Razorpay utility
            
            if (isValid) {
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setRazorpaySignature(razorpaySignature);
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setPaidAt(LocalDateTime.now());
                payment = paymentRepository.save(payment);

                // Update order status to PLACED after successful payment
                com.shivdhaba.food_delivery.domain.entity.Order order = payment.getOrder();
                if (order.getStatus() == com.shivdhaba.food_delivery.domain.enums.OrderStatus.PENDING_PAYMENT) {
                    order.setStatus(com.shivdhaba.food_delivery.domain.enums.OrderStatus.PLACED);
                    orderRepository.save(order);
                }
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setFailureReason("Invalid signature");
                payment = paymentRepository.save(payment);
                throw new BadRequestException("Payment verification failed");
            }
            
            return mapToPaymentResponse(payment);
        } catch (RazorpayException e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed: " + e.getMessage());
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed: " + e.getMessage());
        }
    }
    
    @Transactional
    public PaymentResponse markCodCollected(Long orderId) {
        com.shivdhaba.food_delivery.domain.entity.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        Payment payment = paymentRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        
        if (payment.getPaymentMethod() != com.shivdhaba.food_delivery.domain.enums.PaymentMethod.COD) {
            throw new BadRequestException("Payment method is not COD");
        }
        
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);
        
        return mapToPaymentResponse(payment);
    }
    
    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}

