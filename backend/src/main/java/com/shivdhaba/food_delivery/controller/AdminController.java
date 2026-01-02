package com.shivdhaba.food_delivery.controller;

import com.shivdhaba.food_delivery.domain.entity.*;
import com.shivdhaba.food_delivery.domain.enums.ItemStatus;
import com.shivdhaba.food_delivery.domain.enums.OrderStatus;
import com.shivdhaba.food_delivery.domain.enums.PaymentMethod;
import com.shivdhaba.food_delivery.domain.enums.PaymentStatus;
import com.shivdhaba.food_delivery.domain.enums.Role;
import com.shivdhaba.food_delivery.repository.DeliveryTrackingRepository;
import com.shivdhaba.food_delivery.dto.request.*;
import com.shivdhaba.food_delivery.dto.response.ApiResponse;
import com.shivdhaba.food_delivery.dto.response.OrderResponse;
import com.shivdhaba.food_delivery.exception.BadRequestException;
import com.shivdhaba.food_delivery.exception.ResourceNotFoundException;
import com.shivdhaba.food_delivery.repository.*;
import com.shivdhaba.food_delivery.service.NotificationService;
import com.shivdhaba.food_delivery.service.OrderService;
import com.shivdhaba.food_delivery.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeliveryBoyDetailsRepository deliveryBoyDetailsRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final AppConfigRepository appConfigRepository;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final PaymentRepository paymentRepository;
    private final DeliveryTrackingRepository deliveryTrackingRepository;
    
    // Dashboard
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(
            @RequestParam(required = false, defaultValue = "today") String period) {
        
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();
        
        switch (period.toLowerCase()) {
            case "today":
                startDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
                break;
            case "week":
                startDate = LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0);
                break;
            case "month":
                startDate = LocalDateTime.now().minusDays(30).withHour(0).withMinute(0).withSecond(0);
                break;
            case "6months":
                startDate = LocalDateTime.now().minusMonths(6).withHour(0).withMinute(0).withSecond(0);
                break;
            default:
                startDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        }
        
        Long totalOrders = orderRepository.countOrdersBetweenDates(startDate, endDate);
        Double totalRevenue = orderRepository.getTotalRevenueBetweenDates(startDate, endDate);
        if (totalRevenue == null) totalRevenue = 0.0;
        
        // Get orders in date range for detailed stats
        List<Order> ordersInRange = orderRepository.findAll().stream()
                .filter(o -> !o.getCreatedAt().isBefore(startDate) && o.getCreatedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        // Calculate COD vs Online payments
        long codOrders = ordersInRange.stream()
                .filter(o -> o.getPaymentMethod() == PaymentMethod.COD)
                .count();
        long onlineOrders = ordersInRange.stream()
                .filter(o -> o.getPaymentMethod() == PaymentMethod.RAZORPAY || o.getPaymentMethod() == PaymentMethod.ONLINE)
                .count();
        
        // Calculate average order value
        double avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0.0;
        
        List<Order> pendingOrders = orderRepository.findByStatus(OrderStatus.PLACED);
        List<Order> preparingOrders = orderRepository.findByStatus(OrderStatus.PREPARING);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("period", period);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("codOrders", codOrders);
        stats.put("onlineOrders", onlineOrders);
        stats.put("averageOrderValue", avgOrderValue);
        stats.put("pendingOrders", pendingOrders.size());
        stats.put("preparingOrders", preparingOrders.size());
        stats.put("totalCustomers", userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.CUSTOMER).count());
        stats.put("activeDeliveryBoys", deliveryBoyDetailsRepository.findAll().stream()
                .filter(d -> d.getIsAvailable() && d.getIsOnDuty()).count());
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Dashboard stats retrieved successfully")
                .data(stats)
                .build());
    }
    
    @GetMapping("/dashboard/sales-report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesReport(
            @RequestParam(required = false, defaultValue = "today") String period) {
        
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();
        
        switch (period.toLowerCase()) {
            case "today":
                startDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
                break;
            case "week":
                startDate = LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0);
                break;
            case "month":
                startDate = LocalDateTime.now().minusDays(30).withHour(0).withMinute(0).withSecond(0);
                break;
            case "6months":
                startDate = LocalDateTime.now().minusMonths(6).withHour(0).withMinute(0).withSecond(0);
                break;
            default:
                startDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        }
        
        List<Order> ordersInRange = orderRepository.findAll().stream()
                .filter(o -> !o.getCreatedAt().isBefore(startDate) && o.getCreatedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        // Payment breakdown
        Map<PaymentMethod, Long> paymentMethodCount = ordersInRange.stream()
                .collect(Collectors.groupingBy(Order::getPaymentMethod, Collectors.counting()));
        
        Map<PaymentMethod, Double> paymentMethodRevenue = ordersInRange.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .collect(Collectors.groupingBy(
                        Order::getPaymentMethod,
                        Collectors.summingDouble(o -> o.getTotalAmount().doubleValue())
                ));
        
        // Order status breakdown
        Map<OrderStatus, Long> statusCount = ordersInRange.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
        
        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalOrders", ordersInRange.size());
        report.put("deliveredOrders", ordersInRange.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED).count());
        report.put("totalRevenue", ordersInRange.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum());
        report.put("paymentMethodCount", paymentMethodCount);
        report.put("paymentMethodRevenue", paymentMethodRevenue);
        report.put("statusBreakdown", statusCount);
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Sales report retrieved successfully")
                .data(report)
                .build());
    }
    
    // Orders
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status) {
        List<Order> orders = status != null 
                ? orderRepository.findByStatus(status)
                : orderRepository.findAll();
        List<OrderResponse> orderResponses = orders.stream()
                .map(orderService::mapToOrderResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .success(true)
                .message("Orders retrieved successfully")
                .data(orderResponses)
                .build());
    }
    
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(@PathVariable Long orderId) {
        OrderResponse order = orderService.getOrder(orderId);
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order retrieved successfully")
                .data(order)
                .build());
    }
    
    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != OrderStatus.PLACED && order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Order cannot be accepted in current status");
        }
        
        // Update status to ACCEPTED
        OrderResponse orderResponse = orderService.updateOrderStatus(orderId, OrderStatus.ACCEPTED);
        
        // Auto-assign delivery boy if available
        try {
            List<DeliveryBoyDetails> availableBoys = deliveryBoyDetailsRepository
                    .findByIsAvailableTrueAndIsOnDutyTrue();
            
            if (!availableBoys.isEmpty()) {
                // Find nearest delivery boy if location available, otherwise use first available
                DeliveryBoyDetails selectedBoy = null;
                Order orderEntity = orderRepository.findById(orderId).orElse(null);
                
                if (orderEntity != null && orderEntity.getDeliveryLatitude() != null 
                        && orderEntity.getDeliveryLongitude() != null) {
                    // Find nearest delivery boy
                    double minDistance = Double.MAX_VALUE;
                    for (DeliveryBoyDetails boy : availableBoys) {
                        if (boy.getCurrentLatitude() != null && boy.getCurrentLongitude() != null) {
                            double distance = calculateDistance(
                                    boy.getCurrentLatitude(),
                                    boy.getCurrentLongitude(),
                                    orderEntity.getDeliveryLatitude(),
                                    orderEntity.getDeliveryLongitude()
                            );
                            if (distance < minDistance) {
                                minDistance = distance;
                                selectedBoy = boy;
                            }
                        }
                    }
                }
                
                // Fallback to first available if no location-based selection
                if (selectedBoy == null) {
                    selectedBoy = availableBoys.get(0);
                }
                
                // Auto-assign delivery boy to order
                // Note: Delivery boy will be notified when order status changes to READY
                orderEntity.setDeliveryBoy(selectedBoy.getUser());
                orderRepository.save(orderEntity);
                
                // Mark delivery boy as unavailable (will be set back to available when order is delivered)
                selectedBoy.setIsAvailable(false);
                deliveryBoyDetailsRepository.save(selectedBoy);
            }
        } catch (Exception e) {
            // Log error but don't fail the accept operation
            // Auto-assignment is best-effort
        }
        
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order accepted successfully")
                .data(orderResponse)
                .build());
    }
    
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    @PostMapping("/orders/{orderId}/reject")
    public ResponseEntity<ApiResponse<OrderResponse>> rejectOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody RejectOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != OrderStatus.PLACED && order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Order cannot be rejected in current status");
        }
        
        OrderResponse orderResponse = orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
        
        // Send notification to customer with reason
        notificationService.sendNotificationToUser(order.getCustomer().getId(),
                "Order Rejected",
                "Your order #" + order.getOrderNumber() + " has been rejected. Reason: " + request.getReason());
        
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order rejected successfully")
                .data(orderResponse)
                .build());
    }
    
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse order = orderService.updateOrderStatus(orderId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order status updated successfully")
                .data(order)
                .build());
    }
    
    @PutMapping("/orders/{orderId}/assign-delivery")
    public ResponseEntity<ApiResponse<OrderResponse>> assignDeliveryBoy(
            @PathVariable Long orderId,
            @Valid @RequestBody AssignDeliveryBoyRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != OrderStatus.READY) {
            throw new BadRequestException("Order must be in READY status to assign delivery boy");
        }
        
        User deliveryBoy = userRepository.findById(request.getDeliveryBoyId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery boy not found"));
        
        if (deliveryBoy.getRole() != Role.DELIVERY_BOY) {
            throw new BadRequestException("User is not a delivery boy");
        }
        
        DeliveryBoyDetails details = deliveryBoyDetailsRepository.findByUser(deliveryBoy)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery boy details not found"));
        
        if (!details.getIsAvailable() || !details.getIsOnDuty()) {
            throw new BadRequestException("Delivery boy is not available");
        }
        
        order.setDeliveryBoy(deliveryBoy);
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        order.setOutForDeliveryAt(LocalDateTime.now());
        order = orderRepository.save(order);
        
        // Send notification to delivery boy
        notificationService.sendNotificationToUser(deliveryBoy.getId(),
                "New Delivery Assignment",
                "Order #" + order.getOrderNumber() + " has been assigned to you");
        
        // Send notification to customer
        notificationService.sendNotificationToUser(order.getCustomer().getId(),
                "Order Out for Delivery",
                "Your order #" + order.getOrderNumber() + " is out for delivery");
        
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Delivery boy assigned successfully")
                .data(orderService.mapToOrderResponse(order))
                .build());
    }
    
    // Delivery Boys
    @GetMapping("/delivery-boys")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllDeliveryBoys() {
        List<DeliveryBoyDetails> deliveryBoys = deliveryBoyDetailsRepository.findAll();
        List<Map<String, Object>> response = deliveryBoys.stream()
                .map(db -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", db.getId());
                    map.put("userId", db.getUser().getId());
                    map.put("name", db.getUser().getFullName());
                    map.put("mobile", db.getUser().getMobileNumber());
                    map.put("licenseNumber", db.getLicenseNumber());
                    map.put("vehicleNumber", db.getVehicleNumber());
                    map.put("vehicleType", db.getVehicleType());
                    map.put("isAvailable", db.getIsAvailable());
                    map.put("isOnDuty", db.getIsOnDuty());
                    map.put("totalDeliveries", db.getTotalDeliveries());
                    map.put("totalEarnings", db.getTotalEarnings());
                    return map;
                })
                .toList();
        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .success(true)
                .message("Delivery boys retrieved successfully")
                .data(response)
                .build());
    }
    
    @PostMapping("/delivery-boys")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createDeliveryBoy(
            @RequestParam String mobileNumber,
            @RequestParam String fullName,
            @RequestParam(required = false) String licenseNumber,
            @RequestParam(required = false) String vehicleNumber,
            @RequestParam(required = false) String vehicleType) {
        
        if (userRepository.existsByMobileNumberAndRole(mobileNumber, Role.DELIVERY_BOY)) {
            throw new BadRequestException("Delivery boy already exists");
        }
        
        User user = User.builder()
                .mobileNumber(mobileNumber)
                .fullName(fullName)
                .role(Role.DELIVERY_BOY)
                .isActive(true)
                .build();
        user = userRepository.save(user);
        
        DeliveryBoyDetails details = DeliveryBoyDetails.builder()
                .user(user)
                .licenseNumber(licenseNumber)
                .vehicleNumber(vehicleNumber)
                .vehicleType(vehicleType)
                .isAvailable(true)
                .isOnDuty(false)
                .build();
        deliveryBoyDetailsRepository.save(details);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", details.getId());
        response.put("userId", user.getId());
        response.put("mobileNumber", user.getMobileNumber());
        response.put("fullName", user.getFullName());
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Delivery boy created successfully")
                .data(response)
                .build());
    }
    
    // Menu Management - Categories
    @GetMapping("/menu/categories")
    public ResponseEntity<ApiResponse<List<MenuCategory>>> getCategories() {
        List<MenuCategory> categories = menuCategoryRepository.findAll();
        return ResponseEntity.ok(ApiResponse.<List<MenuCategory>>builder()
                .success(true)
                .message("Categories retrieved successfully")
                .data(categories)
                .build());
    }
    
    @PostMapping("/menu/categories")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<MenuCategory>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        MenuCategory category = MenuCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(true)
                .build();
        MenuCategory saved = menuCategoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.<MenuCategory>builder()
                .success(true)
                .message("Category created successfully")
                .data(saved)
                .build());
    }
    
    @PutMapping("/menu/categories/{id}")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<MenuCategory>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        MenuCategory category = menuCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        if (request.getName() != null) category.setName(request.getName());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getImageUrl() != null) category.setImageUrl(request.getImageUrl());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());
        
        MenuCategory updated = menuCategoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.<MenuCategory>builder()
                .success(true)
                .message("Category updated successfully")
                .data(updated)
                .build());
    }
    
    @DeleteMapping("/menu/categories/{id}")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        MenuCategory category = menuCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        // Check if category has items
        List<MenuItem> items = menuItemRepository.findByCategory(category);
        if (!items.isEmpty()) {
            throw new BadRequestException("Cannot delete category with existing items");
        }
        
        menuCategoryRepository.delete(category);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Category deleted successfully")
                .build());
    }
    
    @PutMapping("/menu/categories/{id}/toggle")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<MenuCategory>> toggleCategory(@PathVariable Long id) {
        MenuCategory category = menuCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        category.setIsActive(!category.getIsActive());
        MenuCategory updated = menuCategoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.<MenuCategory>builder()
                .success(true)
                .message("Category " + (updated.getIsActive() ? "enabled" : "disabled") + " successfully")
                .data(updated)
                .build());
    }
    
    // Menu Management - Items
    @GetMapping("/menu/items")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenuItems() {
        List<MenuItem> items = menuItemRepository.findAll();
        return ResponseEntity.ok(ApiResponse.<List<MenuItem>>builder()
                .success(true)
                .message("Menu items retrieved successfully")
                .data(items)
                .build());
    }
    
    @PostMapping("/menu/items")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(@Valid @RequestBody CreateMenuItemRequest request) {
        MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        if (!category.getIsActive()) {
            throw new BadRequestException("Cannot add item to inactive category");
        }
        
        MenuItem item = MenuItem.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .imageUrl(request.getImageUrl())
                .preparationTimeMinutes(request.getPreparationTimeMinutes())
                .isVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : true)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .status(ItemStatus.AVAILABLE)
                .build();
        
        MenuItem saved = menuItemRepository.save(item);
        return ResponseEntity.ok(ApiResponse.<MenuItem>builder()
                .success(true)
                .message("Menu item created successfully")
                .data(saved)
                .build());
    }
    
    @PutMapping("/menu/items/{id}")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        
        if (request.getCategoryId() != null) {
            MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            item.setCategory(category);
        }
        if (request.getName() != null) item.setName(request.getName());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getDiscountPrice() != null) item.setDiscountPrice(request.getDiscountPrice());
        if (request.getImageUrl() != null) item.setImageUrl(request.getImageUrl());
        if (request.getPreparationTimeMinutes() != null) item.setPreparationTimeMinutes(request.getPreparationTimeMinutes());
        if (request.getIsVegetarian() != null) item.setIsVegetarian(request.getIsVegetarian());
        if (request.getDisplayOrder() != null) item.setDisplayOrder(request.getDisplayOrder());
        
        MenuItem updated = menuItemRepository.save(item);
        return ResponseEntity.ok(ApiResponse.<MenuItem>builder()
                .success(true)
                .message("Menu item updated successfully")
                .data(updated)
                .build());
    }
    
    @DeleteMapping("/menu/items/{id}")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        
        menuItemRepository.delete(item);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Menu item deleted successfully")
                .build());
    }
    
    @PutMapping("/menu/items/{id}/toggle")
    @CacheEvict(value = "menu", key = "'all'")
    public ResponseEntity<ApiResponse<MenuItem>> toggleMenuItem(@PathVariable Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        
        // Toggle between AVAILABLE and DISCONTINUED
        if (item.getStatus() == ItemStatus.AVAILABLE) {
            item.setStatus(ItemStatus.DISCONTINUED);
        } else {
            item.setStatus(ItemStatus.AVAILABLE);
        }
        
        MenuItem updated = menuItemRepository.save(item);
        return ResponseEntity.ok(ApiResponse.<MenuItem>builder()
                .success(true)
                .message("Menu item " + (updated.getStatus() == ItemStatus.AVAILABLE ? "enabled" : "disabled") + " successfully")
                .data(updated)
                .build());
    }
    
    // Configuration
    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, String>>> getConfig() {
        List<AppConfig> configs = appConfigRepository.findAll();
        Map<String, String> configMap = configs.stream()
                .collect(java.util.stream.Collectors.toMap(
                        AppConfig::getConfigKey,
                        AppConfig::getConfigValue,
                        (v1, v2) -> v1));
        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
                .success(true)
                .message("Config retrieved successfully")
                .data(configMap)
                .build());
    }
    
    @PostMapping("/config")
    public ResponseEntity<ApiResponse<AppConfig>> updateConfig(
            @RequestParam String key,
            @RequestParam String value,
            @RequestParam(required = false) String description) {
        AppConfig config = appConfigRepository.findByConfigKey(key)
                .orElse(AppConfig.builder().configKey(key).build());
        config.setConfigValue(value);
        if (description != null) {
            config.setDescription(description);
        }
        config = appConfigRepository.save(config);
        return ResponseEntity.ok(ApiResponse.<AppConfig>builder()
                .success(true)
                .message("Config updated successfully")
                .data(config)
                .build());
    }
    
    // Delivery Location Tracking
    @GetMapping("/orders/{orderId}/delivery-location")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDeliveryLocation(
            @PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getDeliveryBoy() == null) {
            throw new BadRequestException("No delivery boy assigned to this order");
        }
        
        DeliveryBoyDetails deliveryBoyDetails = deliveryBoyDetailsRepository
                .findByUser(order.getDeliveryBoy())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery boy details not found"));
        
        // Get latest tracking entry
        List<DeliveryTracking> trackingHistory = deliveryTrackingRepository
                .findByOrderOrderByCreatedAtDesc(order);
        
        Map<String, Object> locationData = new HashMap<>();
        
        // Current location from delivery boy details (most recent)
        if (deliveryBoyDetails.getCurrentLatitude() != null 
                && deliveryBoyDetails.getCurrentLongitude() != null) {
            locationData.put("latitude", deliveryBoyDetails.getCurrentLatitude());
            locationData.put("longitude", deliveryBoyDetails.getCurrentLongitude());
            locationData.put("timestamp", deliveryBoyDetails.getUpdatedAt());
        } else if (!trackingHistory.isEmpty()) {
            // Fallback to latest tracking entry
            DeliveryTracking latest = trackingHistory.get(0);
            locationData.put("latitude", latest.getLatitude());
            locationData.put("longitude", latest.getLongitude());
            locationData.put("timestamp", latest.getCreatedAt());
        } else {
            throw new ResourceNotFoundException("No location data available for this delivery");
        }
        
        // Delivery address
        locationData.put("deliveryAddress", order.getDeliveryAddress());
        locationData.put("deliveryLatitude", order.getDeliveryLatitude());
        locationData.put("deliveryLongitude", order.getDeliveryLongitude());
        
        // Delivery boy info
        Map<String, Object> deliveryBoyInfo = new HashMap<>();
        deliveryBoyInfo.put("id", order.getDeliveryBoy().getId());
        deliveryBoyInfo.put("name", order.getDeliveryBoy().getFullName());
        deliveryBoyInfo.put("mobile", order.getDeliveryBoy().getMobileNumber());
        locationData.put("deliveryBoy", deliveryBoyInfo);
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Delivery location retrieved successfully")
                .data(locationData)
                .build());
    }

}

