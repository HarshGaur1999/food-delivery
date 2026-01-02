/**
 * Order Domain Model
 */

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PLACED = 'PLACED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  COD = 'COD',
  ONLINE = 'ONLINE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Payment {
  id: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amount: number;
  transactionId?: string;
  paidAt?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerMobile: string;
  deliveryBoyId?: number;
  deliveryBoyName?: string;
  deliveryBoyMobile?: string;
  status: OrderStatus;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryCity: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  acceptedAt?: string;
  readyAt?: string;
  outForDeliveryAt?: string;
  deliveredAt?: string;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment;
}

export interface OrderStatusUpdate {
  orderId: number;
  currentStatus: OrderStatus;
  newStatus: OrderStatus;
  codCollected?: boolean;
}











