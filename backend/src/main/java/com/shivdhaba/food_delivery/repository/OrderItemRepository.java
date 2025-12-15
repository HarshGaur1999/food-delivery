package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.Order;
import com.shivdhaba.food_delivery.domain.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
}

