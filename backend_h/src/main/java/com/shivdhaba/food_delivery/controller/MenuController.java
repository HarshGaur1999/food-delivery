package com.shivdhaba.food_delivery.controller;

import com.shivdhaba.food_delivery.dto.response.ApiResponse;
import com.shivdhaba.food_delivery.dto.response.MenuCategoryResponse;
import com.shivdhaba.food_delivery.dto.response.MenuItemResponse;
import com.shivdhaba.food_delivery.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/menu")
@RequiredArgsConstructor
public class MenuController {
    
    private final MenuService menuService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuCategoryResponse>>> getMenu() {
        List<MenuCategoryResponse> menu = menuService.getMenu();
        return ResponseEntity.ok(ApiResponse.<List<MenuCategoryResponse>>builder()
                .success(true)
                .message("Menu retrieved successfully")
                .data(menu)
                .build());
    }
    
    @GetMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItem(@PathVariable Long itemId) {
        MenuItemResponse item = menuService.getMenuItem(itemId);
        return ResponseEntity.ok(ApiResponse.<MenuItemResponse>builder()
                .success(true)
                .message("Menu item retrieved successfully")
                .data(item)
                .build());
    }
}

