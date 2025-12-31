import api from '../config/api';

/**
 * Service for fetching restaurant configuration and status
 * Note: Backend validates restaurant status during order placement
 * This service provides helper methods for frontend validation
 */
export const configService = {
  /**
   * Get restaurant configuration from admin endpoint
   * Note: This requires admin auth, so we'll validate during checkout instead
   * For now, we'll use default values and let backend validate
   */
  getDefaultConfig: () => {
    // Default values from backend application.properties
    return {
      restaurantName: 'Shiv Dhaba',
      deliveryCity: 'Meerut',
      minOrderAmount: 100.00,
      deliveryChargePerKm: 5.00,
      deliveryRadiusKm: 15,
      restaurantLatitude: 28.9845,
      restaurantLongitude: 77.7064,
    };
  },

  /**
   * Validate if address is within Meerut
   * Backend will do final validation, this is just for UX
   */
  isWithinMeerut: (city) => {
    return city && city.toLowerCase().includes('meerut');
  },
};





