package com.shivdhaba.food_delivery.dto.response;

import com.shivdhaba.food_delivery.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String mobileNumber;
    private String fullName;
    private String email;
    private Role role;
    private Boolean isActive;
}

