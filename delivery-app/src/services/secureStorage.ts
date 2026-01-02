/**
 * Secure Storage Service
 * Encrypted storage for sensitive data like JWT tokens
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_CONSTANTS} from '@config/constants';

class SecureStorageService {
  private encryptionKey = 'delivery_app_key_2024'; // In production, use a more secure key management

  /**
   * Simple encryption (XOR cipher)
   * For production, use react-native-keychain or similar
   */
  private encrypt(data: string): string {
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length),
      );
    }
    return btoa(encrypted); // Base64 encode
  }

  /**
   * Simple decryption
   */
  private decrypt(encryptedData: string): string {
    try {
      const data = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(
          data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length),
        );
      }
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = this.encrypt(value);
      await AsyncStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const encrypted = await AsyncStorage.getItem(key);
      if (!encrypted) {
        return null;
      }
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN,
        APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN,
        APP_CONSTANTS.STORAGE_KEYS.USER_PROFILE,
        APP_CONSTANTS.STORAGE_KEYS.FCM_TOKEN,
      ]);
    } catch (error) {
      console.error('SecureStorage clear error:', error);
      throw error;
    }
  }

  // Convenience methods for tokens
  async setAccessToken(token: string): Promise<void> {
    return this.setItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  async getAccessToken(): Promise<string | null> {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  async setRefreshToken(token: string): Promise<void> {
    return this.setItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  }

  async setUserProfile(profile: any): Promise<void> {
    return this.setItem(APP_CONSTANTS.STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  async getUserProfile(): Promise<any | null> {
    const profile = await this.getItem(APP_CONSTANTS.STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  }
}

export const secureStorage = new SecureStorageService();











