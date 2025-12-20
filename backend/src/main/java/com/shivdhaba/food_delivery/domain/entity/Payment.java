package com.shivdhaba.food_delivery.domain.entity;

import com.shivdhaba.food_delivery.domain.enums.PaymentMethod;
import com.shivdhaba.food_delivery.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_order", columnList = "order_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_razorpay_order_id", columnList = "razorpay_order_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;
    
    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;
    
    @Column(name = "razorpay_signature")
    private String razorpaySignature;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

