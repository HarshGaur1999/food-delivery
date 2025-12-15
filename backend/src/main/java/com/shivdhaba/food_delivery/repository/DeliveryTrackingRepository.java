package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.DeliveryTracking;
import com.shivdhaba.food_delivery.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {
    List<DeliveryTracking> findByOrderOrderByCreatedAtDesc(Order order);
}

