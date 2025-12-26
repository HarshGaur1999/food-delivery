import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESSES_STORAGE_KEY = '@saved_addresses';

export const addressService = {
  /**
   * Get saved addresses for the current user
   * Note: Backend doesn't have a dedicated address endpoint
   * We'll store addresses locally and validate during order placement
   */
  getSavedAddresses: async () => {
    try {
      const addressesStr = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
      return addressesStr ? JSON.parse(addressesStr) : [];
    } catch (error) {
      console.error('Error loading addresses:', error);
      return [];
    }
  },

  /**
   * Save address locally
   */
  saveAddress: async (address) => {
    try {
      const addresses = await addressService.getSavedAddresses();
      const newAddress = {
        id: Date.now().toString(),
        ...address,
        createdAt: new Date().toISOString(),
      };
      addresses.push(newAddress);
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
      return newAddress;
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  },

  /**
   * Delete saved address
   */
  deleteAddress: async (addressId) => {
    try {
      const addresses = await addressService.getSavedAddresses();
      const filtered = addresses.filter(addr => addr.id !== addressId);
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  /**
   * Get current location using geolocation
   */
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      const Geolocation = require('@react-native-community/geolocation').default;
      
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  },
};




