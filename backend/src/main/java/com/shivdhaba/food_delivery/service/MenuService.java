package com.shivdhaba.food_delivery.service;

import com.shivdhaba.food_delivery.domain.entity.MenuCategory;
import com.shivdhaba.food_delivery.domain.entity.MenuItem;
import com.shivdhaba.food_delivery.domain.enums.ItemStatus;
import com.shivdhaba.food_delivery.dto.response.MenuCategoryResponse;
import com.shivdhaba.food_delivery.dto.response.MenuItemResponse;
import com.shivdhaba.food_delivery.exception.ResourceNotFoundException;
import com.shivdhaba.food_delivery.repository.MenuCategoryRepository;
import com.shivdhaba.food_delivery.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {
    
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuItemRepository menuItemRepository;
    
    @Cacheable(value = "menu", key = "'all'")
    public List<MenuCategoryResponse> getMenu() {
        List<MenuCategory> categories = menuCategoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        
        return categories.stream()
                .map(category -> {
                    List<MenuItem> items = menuItemRepository.findByCategoryAndStatus(
                            category, ItemStatus.AVAILABLE);
                    
                    return MenuCategoryResponse.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .description(category.getDescription())
                            .imageUrl(category.getImageUrl())
                            .displayOrder(category.getDisplayOrder())
                            .isActive(category.getIsActive())
                            .items(items.stream()
                                    .map(this::mapToMenuItemResponse)
                                    .collect(Collectors.toList()))
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    public MenuItemResponse getMenuItem(Long itemId) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        
        return mapToMenuItemResponse(item);
    }
    
    private MenuItemResponse mapToMenuItemResponse(MenuItem item) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .categoryId(item.getCategory().getId())
                .categoryName(item.getCategory().getName())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .status(item.getStatus())
                .preparationTimeMinutes(item.getPreparationTimeMinutes())
                .isVegetarian(item.getIsVegetarian())
                .isSpicy(item.getIsSpicy())
                .displayOrder(item.getDisplayOrder())
                .build();
    }
}

