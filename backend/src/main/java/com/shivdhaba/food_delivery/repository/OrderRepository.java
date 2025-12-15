package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.Order;
import com.shivdhaba.food_delivery.domain.entity.User;
import com.shivdhaba.food_delivery.domain.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Order> findByDeliveryBoyOrderByCreatedAtDesc(User deliveryBoy);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatusAndDeliveryBoy(OrderStatus status, User deliveryBoy);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.deliveryBoy IS NULL")
    List<Order> findUnassignedOrdersByStatus(@Param("status") OrderStatus status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate")
    Long countOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' AND o.createdAt >= :startDate AND o.createdAt < :endDate")
    Double getTotalRevenueBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}

