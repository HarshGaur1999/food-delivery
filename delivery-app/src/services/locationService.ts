/**
 * Location Service
 * Handles foreground and background location tracking
 */

import Geolocation from '@react-native-community/geolocation';
import {Platform, PermissionsAndroid} from 'react-native';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import {Location} from '@domain/models/Location';
import {APP_CONSTANTS} from '@config/constants';
import {locationStore} from '@store/locationStore';
import {orderRepository} from '@data/repositories/orderRepository';

class LocationService {
  private watchId: number | null = null;
  private updateInterval: NodeJS.Timeout | null = null;
  private isTracking = false;

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for delivery tracking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Also request background location for Android 10+
          if (Platform.Version >= 29) {
            const bgGranted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
              {
                title: 'Background Location Permission',
                message: 'This app needs background location access for delivery tracking.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            return bgGranted === PermissionsAndroid.RESULTS.GRANTED;
          }
          return true;
        }
        return false;
      } else {
        // iOS
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (result === RESULTS.GRANTED) {
          const bgResult = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
          return bgResult === RESULTS.GRANTED;
        }
        return false;
      }
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return result;
      } else {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Check permissions error:', error);
      return false;
    }
  }

  /**
   * Get current location once
   */
  getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy || undefined,
            timestamp: position.timestamp,
          };
          locationStore.getState().setCurrentLocation(location);
          resolve(location);
        },
        (error) => {
          locationStore.getState().setError(error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }

  /**
   * Start location tracking for an order
   */
  startTracking(orderId: number) {
    if (this.isTracking) {
      this.stopTracking();
    }

    this.isTracking = true;
    locationStore.getState().startTracking(orderId);

    // Watch position changes
    this.watchId = Geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || undefined,
          timestamp: position.timestamp,
        };

        locationStore.getState().setCurrentLocation(location);

        // Send location to backend periodically
        this.updateLocationToBackend(orderId, location);
      },
      (error) => {
        locationStore.getState().setError(error.message);
        console.error('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: APP_CONSTANTS.LOCATION_ACCURACY.HIGH.distanceFilter,
        interval: APP_CONSTANTS.LOCATION_UPDATE_INTERVAL,
      },
    );
  }

  /**
   * Stop location tracking
   */
  stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.isTracking = false;
    locationStore.getState().stopTracking();
  }

  /**
   * Update location to backend
   */
  private async updateLocationToBackend(orderId: number, location: Location) {
    try {
      await orderRepository.updateLocation(
        orderId,
        location.latitude,
        location.longitude,
        location.address,
      );
    } catch (error) {
      console.error('Failed to update location to backend:', error);
      // Don't throw - we want to continue tracking even if backend update fails
    }
  }

  /**
   * Get distance between two coordinates
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
}

export const locationService = new LocationService();











