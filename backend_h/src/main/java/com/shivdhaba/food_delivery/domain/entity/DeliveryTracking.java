package com.shivdhaba.food_delivery.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_tracking", indexes = {
    @Index(name = "idx_order", columnList = "order_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryTracking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(name = "latitude", nullable = false)
    private Double latitude;
    
    @Column(name = "longitude", nullable = false)
    private Double longitude;
    
    @Column(name = "address")
    private String address;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

