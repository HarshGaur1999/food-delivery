package com.shivdhaba.food_delivery.repository;

import com.shivdhaba.food_delivery.domain.entity.MenuCategory;
import com.shivdhaba.food_delivery.domain.entity.MenuItem;
import com.shivdhaba.food_delivery.domain.enums.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryAndStatus(MenuCategory category, ItemStatus status);
    List<MenuItem> findByCategory(MenuCategory category);
    List<MenuItem> findByStatusOrderByDisplayOrderAsc(ItemStatus status);
    List<MenuItem> findByCategoryIsActiveTrueAndStatusOrderByDisplayOrderAsc(ItemStatus status);
}

