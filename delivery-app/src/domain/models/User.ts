/**
 * User Domain Model
 */

export interface User {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  role: 'DELIVERY_BOY' | 'CUSTOMER' | 'ADMIN';
}

export interface DeliveryBoyProfile extends User {
  isAvailable: boolean;
  isOnDuty: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  totalEarnings?: number;
  todayEarnings?: number;
}









