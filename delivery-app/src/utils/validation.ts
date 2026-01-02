/**
 * Validation utilities
 */

export const validateMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const formatMobileNumber = (mobile: string): string => {
  return mobile.replace(/\D/g, '');
};











