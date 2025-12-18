import api from '../config/api';

export const paymentService = {
  createRazorpayOrder: async (orderId) => {
    const response = await api.post(`/customer/orders/${orderId}/payment/razorpay/create`);
    return response.data;
  },

  verifyPayment: async (orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const response = await api.post(
      `/customer/orders/${orderId}/payment/razorpay/verify`,
      null,
      {
        params: {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
      }
    );
    return response.data;
  },
};







