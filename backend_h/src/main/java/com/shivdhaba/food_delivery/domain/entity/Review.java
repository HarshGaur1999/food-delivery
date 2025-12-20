package com.shivdhaba.food_delivery.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", indexes = {
    @Index(name = "idx_order", columnList = "order_id"),
    @Index(name = "idx_customer", columnList = "customer_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @Column(name = "rating", nullable = false)
    private Integer rating;
    
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

