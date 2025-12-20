package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.Order;
import com.shivdhaba.food_delivery.domain.entity.Review;
import com.shivdhaba.food_delivery.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByOrder(Order order);
    List<Review> findByCustomerOrderByCreatedAtDesc(User customer);
}

