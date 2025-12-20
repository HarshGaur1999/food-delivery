package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByIsActiveTrueOrderByDisplayOrderAsc();
}

