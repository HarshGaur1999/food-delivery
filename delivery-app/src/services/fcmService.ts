/**
 * FCM Service
 * Handles Firebase Cloud Messaging for push notifications
 * Note: Firebase must be configured before using this service
 */

import {Platform} from 'react-native';
import {secureStorage} from './secureStorage';
import {deliveryRepository} from '@data/repositories/deliveryRepository';
import {APP_CONSTANTS} from '@config/constants';
import {orderStore} from '@store/orderStore';

// Lazy import Firebase to handle cases where it's not configured
let messaging: any = null;
try {
  messaging = require('@react-native-firebase/messaging').default;
} catch (error) {
  console.warn('Firebase messaging not available. Push notifications will be disabled.');
}

class FCMService {
  private notificationListener: any = null;
  private backgroundListener: any = null;

  /**
   * Request notification permissions
   */
  async requestPermission(): Promise<boolean> {
    if (!messaging) {
      console.warn('Firebase messaging not available');
      return false;
    }
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('FCM permission granted');
        return true;
      }
      return false;
    } catch (error) {
      console.error('FCM permission error:', error);
      return false;
    }
  }

  /**
   * Get FCM token
   */
  async getToken(): Promise<string | null> {
    if (!messaging) {
      console.warn('Firebase messaging not available');
      return null;
    }
    try {
      const token = await messaging().getToken();
      if (token) {
        await secureStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.FCM_TOKEN, token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Get FCM token error:', error);
      return null;
    }
  }

  /**
   * Update FCM token to backend
   */
  async updateTokenToBackend(): Promise<void> {
    try {
      const token = await this.getToken();
      if (token) {
        await deliveryRepository.updateFcmToken(token);
      }
    } catch (error) {
      console.error('Update FCM token error:', error);
    }
  }

  /**
   * Initialize FCM service
   */
  async initialize() {
    if (!messaging) {
      console.warn('Firebase messaging not available. Skipping FCM initialization.');
      return;
    }
    try {
      // Request permission
      await this.requestPermission();

      // Get and update token
      await this.updateTokenToBackend();

      // Set up foreground message handler
      this.notificationListener = messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground FCM message:', remoteMessage);
        this.handleNotification(remoteMessage);
      });

      // Set up background message handler
      this.backgroundListener = messaging().setBackgroundMessageHandler(
        async (remoteMessage) => {
          console.log('Background FCM message:', remoteMessage);
          this.handleNotification(remoteMessage);
        },
      );

      // Handle notification when app is opened from quit state
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('Notification opened app:', remoteMessage);
            this.handleNotification(remoteMessage);
          }
        });

      // Handle notification when app is in background
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('Notification opened app from background:', remoteMessage);
        this.handleNotification(remoteMessage);
      });
    } catch (error) {
      console.error('FCM initialization error:', error);
    }
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(remoteMessage: any) {
    const {data, notification} = remoteMessage;

    if (data?.type === 'ORDER_ASSIGNED') {
      // Refresh orders when new order is assigned
      // This will be handled by React Query in the screens
      console.log('Order assigned notification received');
    } else if (data?.type === 'ORDER_CANCELLED') {
      // Remove order from assigned orders
      const orderId = data.orderId ? parseInt(data.orderId, 10) : null;
      if (orderId) {
        const currentOrder = orderStore.getState().assignedOrder;
        if (currentOrder?.id === orderId) {
          orderStore.getState().clearAssignedOrder();
        }
      }
    }

    // You can add more notification handling logic here
    // For example, show local notifications, update UI, etc.
  }

  /**
   * Cleanup listeners
   */
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener();
    }
    if (this.backgroundListener) {
      this.backgroundListener();
    }
  }
}

export const fcmService = new FCMService();

