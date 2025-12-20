package com.shivdhaba.food_delivery.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
@Slf4j
public class FirebaseConfig {
    
    @Value("${firebase.service-account.path:}")
    private String serviceAccountPath;
    
    @Bean
    @ConditionalOnProperty(name = "firebase.service-account.path", matchIfMissing = false)
    public FirebaseMessaging firebaseMessaging() {
        try {
            if (FirebaseApp.getApps().isEmpty() && serviceAccountPath != null && !serviceAccountPath.isEmpty()) {
                ClassPathResource resource = new ClassPathResource(serviceAccountPath.replace("classpath:", ""));
                
                if (resource.exists()) {
                    FileInputStream serviceAccount = new FileInputStream(resource.getFile());
                    
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                    
                    FirebaseApp.initializeApp(options);
                    log.info("Firebase initialized successfully");
                } else {
                    log.warn("Firebase service account file not found: {}. FCM notifications will be disabled.", serviceAccountPath);
                    return null;
                }
            }
            
            return FirebaseMessaging.getInstance();
        } catch (IOException e) {
            log.error("Failed to initialize Firebase: {}. FCM notifications will be disabled.", e.getMessage());
            return null;
        }
    }
}

