package com.shivdhaba.food_delivery.service;

import com.shivdhaba.food_delivery.domain.entity.*;
import com.shivdhaba.food_delivery.domain.enums.OrderStatus;
import com.shivdhaba.food_delivery.domain.enums.PaymentStatus;
import com.shivdhaba.food_delivery.dto.request.PlaceOrderRequest;
import com.shivdhaba.food_delivery.dto.response.OrderItemResponse;
import com.shivdhaba.food_delivery.dto.response.OrderResponse;
import com.shivdhaba.food_delivery.dto.response.PaymentResponse;
import com.shivdhaba.food_delivery.exception.BadRequestException;
import com.shivdhaba.food_delivery.exception.ResourceNotFoundException;
import com.shivdhaba.food_delivery.repository.*;
import com.shivdhaba.food_delivery.util.DistanceUtil;
import com.shivdhaba.food_delivery.util.OrderNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final OrderNumberGenerator orderNumberGenerator;
    private final DistanceUtil distanceUtil;
    private final NotificationService notificationService;
    
    @Value("${delivery.city}")
    private String deliveryCity;
    
    @Value("${delivery.min-order-amount}")
    private BigDecimal minOrderAmount;
    
    @Value("${delivery.charge-per-km}")
    private BigDecimal chargePerKm;
    
    @Transactional
    public OrderResponse placeOrder(Long customerId, PlaceOrderRequest request) {
        // Validate delivery city
        if (!deliveryCity.equalsIgnoreCase(request.getDeliveryCity())) {
            throw new BadRequestException("Delivery is only available in " + deliveryCity);
        }
        
        // Validate delivery radius
        if (!distanceUtil.isWithinDeliveryRadius(request.getDeliveryLatitude(), request.getDeliveryLongitude())) {
            throw new BadRequestException("Delivery address is outside the delivery radius");
        }
        
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        // Calculate order totals
        List<OrderItem> orderItems = request.getItems().stream()
                .map(itemRequest -> {
                    MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                            .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemRequest.getMenuItemId()));
                    
                    if (menuItem.getStatus() != com.shivdhaba.food_delivery.domain.enums.ItemStatus.AVAILABLE) {
                        throw new BadRequestException("Menu item is not available: " + menuItem.getName());
                    }
                    
                    BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
                    
                    OrderItem orderItem = new OrderItem();
                    orderItem.setMenuItem(menuItem);
                    orderItem.setQuantity(itemRequest.getQuantity());
                    orderItem.setUnitPrice(menuItem.getPrice());
                    orderItem.setTotalPrice(itemTotal);
                    orderItem.setSpecialInstructions(itemRequest.getSpecialInstructions());
                    
                    return orderItem;
                })
                .collect(Collectors.toList());
        
        BigDecimal subtotal = orderItems.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Validate minimum order amount
        if (subtotal.compareTo(minOrderAmount) < 0) {
            throw new BadRequestException("Minimum order amount is " + minOrderAmount);
        }
        
        // Calculate delivery charge
        double distance = distanceUtil.getDistanceFromRestaurant(
                request.getDeliveryLatitude(), request.getDeliveryLongitude());
        BigDecimal deliveryCharge = BigDecimal.valueOf(distance).multiply(chargePerKm);
        
        BigDecimal totalAmount = subtotal.add(deliveryCharge);
        
        // Create order
        Order order = Order.builder()
                .orderNumber(orderNumberGenerator.generateOrderNumber())
                .customer(customer)
                .status(OrderStatus.PLACED)
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryLatitude(request.getDeliveryLatitude())
                .deliveryLongitude(request.getDeliveryLongitude())
                .deliveryCity(request.getDeliveryCity())
                .specialInstructions(request.getSpecialInstructions())
                .estimatedDeliveryTime(LocalDateTime.now().plusMinutes(45))
                .build();
        
        order = orderRepository.save(order);
        
        // Save order items
        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(order);
            orderItemRepository.save(orderItem);
        }
        
        // Create payment record
        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .amount(totalAmount)
                .build();
        paymentRepository.save(payment);
        
        // Send notification to admin
        notificationService.sendNotificationToRole("ADMIN", 
                "New Order Received", 
                "Order #" + order.getOrderNumber() + " has been placed");
        
        return mapToOrderResponse(order);
    }
    
    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToOrderResponse(order);
    }
    
    public Order getOrderEntity(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }
    
    public List<OrderResponse> getCustomerOrders(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return orderRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        // Validate status transition
        validateStatusTransition(order.getStatus(), status);
        
        order.setStatus(status);
        
        // Update timestamps
        switch (status) {
            case ACCEPTED -> order.setAcceptedAt(LocalDateTime.now());
            case READY -> order.setReadyAt(LocalDateTime.now());
            case OUT_FOR_DELIVERY -> order.setOutForDeliveryAt(LocalDateTime.now());
            case DELIVERED -> order.setDeliveredAt(LocalDateTime.now());
            default -> {
                // No timestamp update for other statuses
            }
        }
        
        order = orderRepository.save(order);
        
        // Send notifications
        sendStatusUpdateNotifications(order, status);
        
        return mapToOrderResponse(order);
    }
    
    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        // Implement proper state machine validation
        if (current == OrderStatus.CANCELLED || current == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot update order in " + current + " status");
        }
    }
    
    private void sendStatusUpdateNotifications(Order order, OrderStatus status) {
        String title = "Order Status Updated";
        
        switch (status) {
            case ACCEPTED -> {
                notificationService.sendNotificationToUser(order.getCustomer().getId(), 
                        title, "Your order has been accepted");
            }
            case READY -> {
                if (order.getDeliveryBoy() != null) {
                    notificationService.sendNotificationToUser(order.getDeliveryBoy().getId(),
                            title, "Order #" + order.getOrderNumber() + " is ready for pickup");
                }
            }
            case OUT_FOR_DELIVERY -> {
                notificationService.sendNotificationToUser(order.getCustomer().getId(),
                        title, "Your order is out for delivery");
            }
            case DELIVERED -> {
                notificationService.sendNotificationToUser(order.getCustomer().getId(),
                        title, "Your order has been delivered");
                notificationService.sendNotificationToRole("ADMIN",
                        title, "Order #" + order.getOrderNumber() + " has been delivered");
            }
            default -> {
                // No notification for other statuses
            }
        }
    }
    
    public OrderResponse mapToOrderResponse(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        Payment payment = paymentRepository.findByOrder(order).orElse(null);
        
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getFullName())
                .customerMobile(order.getCustomer().getMobileNumber())
                .deliveryBoyId(order.getDeliveryBoy() != null ? order.getDeliveryBoy().getId() : null)
                .deliveryBoyName(order.getDeliveryBoy() != null ? order.getDeliveryBoy().getFullName() : null)
                .deliveryBoyMobile(order.getDeliveryBoy() != null ? order.getDeliveryBoy().getMobileNumber() : null)
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .deliveryCharge(order.getDeliveryCharge())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryLatitude(order.getDeliveryLatitude())
                .deliveryLongitude(order.getDeliveryLongitude())
                .deliveryCity(order.getDeliveryCity())
                .specialInstructions(order.getSpecialInstructions())
                .estimatedDeliveryTime(order.getEstimatedDeliveryTime())
                .acceptedAt(order.getAcceptedAt())
                .readyAt(order.getReadyAt())
                .outForDeliveryAt(order.getOutForDeliveryAt())
                .deliveredAt(order.getDeliveredAt())
                .createdAt(order.getCreatedAt())
                .items(items.stream()
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList()))
                .payment(payment != null ? mapToPaymentResponse(payment) : null)
                .build();
    }
    
    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem().getId())
                .menuItemName(item.getMenuItem().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .specialInstructions(item.getSpecialInstructions())
                .build();
    }
    
    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}

