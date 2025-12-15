package com.shivdhaba.food_delivery.service;

import com.shivdhaba.food_delivery.domain.entity.Order;
import com.shivdhaba.food_delivery.domain.entity.Review;
import com.shivdhaba.food_delivery.domain.entity.User;
import com.shivdhaba.food_delivery.domain.enums.OrderStatus;
import com.shivdhaba.food_delivery.dto.request.ReviewRequest;
import com.shivdhaba.food_delivery.dto.response.ReviewResponse;
import com.shivdhaba.food_delivery.exception.BadRequestException;
import com.shivdhaba.food_delivery.exception.ResourceNotFoundException;
import com.shivdhaba.food_delivery.repository.OrderRepository;
import com.shivdhaba.food_delivery.repository.ReviewRepository;
import com.shivdhaba.food_delivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public ReviewResponse createReview(Long customerId, ReviewRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Order does not belong to you");
        }
        
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Can only review delivered orders");
        }
        
        if (reviewRepository.findByOrder(order).isPresent()) {
            throw new BadRequestException("Review already exists for this order");
        }
        
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        Review review = Review.builder()
                .order(order)
                .customer(customer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        
        review = reviewRepository.save(review);
        
        return mapToReviewResponse(review);
    }
    
    public List<ReviewResponse> getCustomerReviews(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        return reviewRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }
    
    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .orderId(review.getOrder().getId())
                .orderNumber(review.getOrder().getOrderNumber())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

