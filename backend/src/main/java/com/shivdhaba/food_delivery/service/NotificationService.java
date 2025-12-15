package com.shivdhaba.food_delivery.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.shivdhaba.food_delivery.domain.entity.User;
import com.shivdhaba.food_delivery.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.List;

@Service
@Slf4j
public class NotificationService {
    
    private final UserRepository userRepository;
    private final FirebaseMessaging firebaseMessaging;
    
    @Autowired
    public NotificationService(UserRepository userRepository, 
                              @Autowired(required = false) FirebaseMessaging firebaseMessaging) {
        this.userRepository = userRepository;
        this.firebaseMessaging = firebaseMessaging;
    }
    
    @Async
    public void sendNotification(String fcmToken, String title, String body) {
        if (fcmToken == null || fcmToken.isEmpty()) {
            log.warn("FCM token is null or empty, skipping notification");
            return;
        }
        
        if (firebaseMessaging == null) {
            log.warn("Firebase not initialized, skipping notification");
            return;
        }
        
        try {
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();
            
            String response = firebaseMessaging.send(message);
            log.info("Successfully sent notification: {}", response);
        } catch (FirebaseMessagingException e) {
            log.error("Error sending notification: {}", e.getMessage());
        }
    }
    
    @Async
    public void sendNotificationToUser(Long userId, String title, String body) {
        User user = userRepository.findById(userId)
                .orElse(null);
        
        if (user != null && user.getFcmToken() != null) {
            sendNotification(user.getFcmToken(), title, body);
        }
    }
    
    @Async
    public void sendNotificationToRole(String role, String title, String body) {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals(role) && u.getFcmToken() != null)
                .toList();
        
        for (User user : users) {
            sendNotification(user.getFcmToken(), title, body);
        }
    }
    
    public void updateFcmToken(Long userId, String fcmToken) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFcmToken(fcmToken);
        userRepository.save(user);
    }
}

