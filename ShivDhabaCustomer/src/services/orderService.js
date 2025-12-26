import api from '../config/api';

export const orderService = {
  /**
   * Place a new order
   * Backend validates:
   * - Restaurant open status (implicitly via order placement)
   * - Minimum order amount
   * - Delivery city (must be Meerut)
   * - Delivery radius
   */
  placeOrder: async (orderData) => {
    const response = await api.post('/customer/orders', orderData);
    return response.data;
  },

  /**
   * Get all orders for the current customer
   */
  getMyOrders: async () => {
    const response = await api.get('/customer/orders');
    return response.data;
  },

  /**
   * Get order details by ID
   */
  getOrder: async (orderId) => {
    const response = await api.get(`/customer/orders/${orderId}`);
    return response.data;
  },

  /**
   * Validate order before placement
   * This is a frontend validation - backend will do final validation
   */
  validateOrder: (cartItems, minOrderAmount) => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (cartItems.length === 0) {
      return { valid: false, error: 'Cart is empty' };
    }

    if (subtotal < minOrderAmount) {
      return {
        valid: false,
        error: `Minimum order amount is ₹${minOrderAmount}`,
      };
    }

    return { valid: true };
  },
};


