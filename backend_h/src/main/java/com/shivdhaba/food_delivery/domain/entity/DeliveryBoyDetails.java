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
@Table(name = "delivery_boy_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryBoyDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(name = "license_number")
    private String licenseNumber;
    
    @Column(name = "vehicle_number")
    private String vehicleNumber;
    
    @Column(name = "vehicle_type")
    private String vehicleType;
    
    @Column(name = "current_latitude")
    private Double currentLatitude;
    
    @Column(name = "current_longitude")
    private Double currentLongitude;
    
    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;
    
    @Column(name = "is_on_duty", nullable = false)
    @Builder.Default
    private Boolean isOnDuty = false;
    
    @Column(name = "total_deliveries", nullable = false)
    @Builder.Default
    private Integer totalDeliveries = 0;
    
    @Column(name = "total_earnings", nullable = false, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    @Builder.Default
    private Double totalEarnings = 0.0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

