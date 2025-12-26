/**
 * Location Domain Models
 */

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
  timestamp: number;
}

export interface LocationUpdateRequest {
  orderId: number;
  latitude: number;
  longitude: number;
  address?: string;
}








