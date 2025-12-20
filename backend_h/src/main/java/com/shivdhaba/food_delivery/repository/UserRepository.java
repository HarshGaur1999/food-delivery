package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.User;
import com.shivdhaba.food_delivery.domain.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMobileNumber(String mobileNumber);
    Optional<User> findByMobileNumberAndRole(String mobileNumber, Role role);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByMobileNumberAndRole(String mobileNumber, Role role);
}

