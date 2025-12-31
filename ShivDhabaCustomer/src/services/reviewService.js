import api from '../config/api';

export const reviewService = {
  /**
   * Submit a review for an order
   * @param {Object} reviewData - { orderId, rating, comment }
   */
  submitReview: async (reviewData) => {
    const response = await api.post('/customer/reviews', reviewData);
    return response.data;
  },

  /**
   * Get all reviews submitted by the current user
   */
  getMyReviews: async () => {
    const response = await api.get('/customer/reviews');
    return response.data;
  },
};





