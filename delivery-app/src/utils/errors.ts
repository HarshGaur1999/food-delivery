/**
 * Error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    return message;
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

export const isUnauthorizedError = (error: any): boolean => {
  return error.response?.status === 401;
};








