package com.shivdhaba.food_delivery.controller;

import com.shivdhaba.food_delivery.domain.enums.Role;
import com.shivdhaba.food_delivery.dto.request.AdminLoginRequest;
import com.shivdhaba.food_delivery.dto.request.AdminOtpRequest;
import com.shivdhaba.food_delivery.dto.request.AdminOtpVerifyRequest;
import com.shivdhaba.food_delivery.dto.request.AdminRegisterRequest;
import com.shivdhaba.food_delivery.dto.request.OtpRequest;
import com.shivdhaba.food_delivery.dto.request.OtpVerifyRequest;
import com.shivdhaba.food_delivery.dto.response.ApiResponse;
import com.shivdhaba.food_delivery.dto.response.AuthResponse;
import com.shivdhaba.food_delivery.dto.response.OtpResponse;
import com.shivdhaba.food_delivery.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<OtpResponse>> sendOtp(@Valid @RequestBody OtpRequest request) {
        OtpResponse response = authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.<OtpResponse>builder()
                .success(true)
                .message("OTP sent successfully")
                .data(response)
                .build());
    }
    
    @PostMapping("/otp/verify/customer")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtpCustomer(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request, Role.CUSTOMER);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build());
    }
    
    @PostMapping("/otp/verify/delivery")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtpDelivery(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request, Role.DELIVERY_BOY);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build());
    }
    
    @PostMapping("/admin/otp/send")
    public ResponseEntity<ApiResponse<OtpResponse>> sendAdminOtp(@Valid @RequestBody AdminOtpRequest request) {
        OtpResponse response = authService.sendAdminOtp(request);
        return ResponseEntity.ok(ApiResponse.<OtpResponse>builder()
                .success(true)
                .message("OTP sent successfully")
                .data(response)
                .build());
    }
    
    @PostMapping("/admin/otp/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyAdminOtp(@Valid @RequestBody AdminOtpVerifyRequest request) {
        AuthResponse response = authService.verifyAdminOtp(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build());
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        AuthResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build());
    }

    @PostMapping("/admin/register")
    public ResponseEntity<ApiResponse<AuthResponse>> adminRegister(@Valid @RequestBody AdminRegisterRequest request) {
        AuthResponse response = authService.createAdminUser(request);
        return ResponseEntity.status(201).body(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Admin user registered successfully")
                .data(response)
                .build());
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestHeader("Authorization") String authHeader) {
        String refreshToken = authHeader.replace("Bearer ", "");
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Token refreshed successfully")
                .data(response)
                .build());
    }
}

