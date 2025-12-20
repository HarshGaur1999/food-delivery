package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.DeliveryBoyDetails;
import com.shivdhaba.food_delivery.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryBoyDetailsRepository extends JpaRepository<DeliveryBoyDetails, Long> {
    Optional<DeliveryBoyDetails> findByUser(User user);
    List<DeliveryBoyDetails> findByIsAvailableTrueAndIsOnDutyTrue();
}

