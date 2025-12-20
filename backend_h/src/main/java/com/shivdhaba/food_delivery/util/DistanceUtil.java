package com.shivdhaba.food_delivery.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DistanceUtil {
    
    @Value("${restaurant.latitude}")
    private Double restaurantLatitude;
    
    @Value("${restaurant.longitude}")
    private Double restaurantLongitude;
    
    @Value("${delivery.default-radius-km}")
    private Double defaultRadiusKm;
    
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c;
        
        return distance;
    }
    
    public boolean isWithinDeliveryRadius(double latitude, double longitude) {
        double distance = calculateDistance(restaurantLatitude, restaurantLongitude, latitude, longitude);
        return distance <= defaultRadiusKm;
    }
    
    public double getDistanceFromRestaurant(double latitude, double longitude) {
        return calculateDistance(restaurantLatitude, restaurantLongitude, latitude, longitude);
    }
}

