package com.shivdhaba.food_delivery.util;

import com.shivdhaba.food_delivery.domain.entity.User;
import com.shivdhaba.food_delivery.exception.UnauthorizedException;
import com.shivdhaba.food_delivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {
    
    private final UserRepository userRepository;
    
    public User getCurrentUser(Authentication authentication) {
        String mobileNumber = authentication.getName();
        return userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
    
    public Long getCurrentUserId(Authentication authentication) {
        return getCurrentUser(authentication).getId();
    }
}

