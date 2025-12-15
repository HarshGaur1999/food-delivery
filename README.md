# Shiv Dhaba Food Delivery System

Complete production-ready food delivery system for a single restaurant in Meerut.

## 📁 Project Structure

```
food-delivery/
├── backend/          # Spring Boot Backend
├── customer-app/     # React Native Customer App (Android + iOS)
├── delivery-app/     # React Native Delivery Boy App (Android)
└── admin-app/        # React Native Admin App (Android)
```

## 🏗️ System Architecture

### Backend (Spring Boot 3.x)
- **Java 17**
- **Spring Boot 3.5.7**
- **MySQL 8.x**
- **Redis 7.x**
- **JWT Authentication** (Access + Refresh tokens)
- **Firebase Cloud Messaging** (FCM)
- **Razorpay Integration**

### Frontend (React Native - CLI)
- **Customer App** - Android + iOS
- **Delivery Boy App** - Android only
- **Admin App** - Android only
- **Redux Toolkit** for state management

## 🚀 Setup Instructions

### 1. Backend Setup
```bash
cd backend
# See backend/README.md for details
mvn clean install
mvn spring-boot:run
```

### 2. Customer App Setup
```bash
cd customer-app
npm install
npm run android  # or npm run ios
```

### 3. Delivery App Setup
```bash
cd delivery-app
npm install
npm run android
```

### 4. Admin App Setup
```bash
cd admin-app
npm install
npm run android
```

## 📋 Features

### Customer Features
- ✅ Guest browsing (no login required)
- ✅ OTP-based login (mobile number)
- ✅ Menu browsing with categories
- ✅ Cart management (local storage)
- ✅ Address management (Meerut only)
- ✅ Order placement (COD + Online)
- ✅ Real-time order tracking
- ✅ Payment integration (Razorpay)
- ✅ Order history
- ✅ Reviews & ratings

### Delivery Boy Features
- ✅ OTP-based login
- ✅ View available orders
- ✅ Accept orders
- ✅ Live location tracking
- ✅ Google Maps navigation
- ✅ Order status updates
- ✅ COD collection
- ✅ Earnings & delivery history

### Admin Features
- ✅ Username/password login
- ✅ Dashboard with analytics
- ✅ Order management (accept/reject/status updates)
- ✅ Menu & inventory management
- ✅ Delivery boy management
- ✅ App configuration
- ✅ Payment reports

## 🔐 Security

- JWT-based authentication
- Role-based access control (CUSTOMER, DELIVERY_BOY, ADMIN)
- BCrypt password hashing
- Rate limiting
- Input validation
- Meerut city validation (strict backend validation)

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/otp/send` - Send OTP
- `POST /api/v1/auth/otp/verify/customer` - Verify OTP (Customer)
- `POST /api/v1/auth/otp/verify/delivery` - Verify OTP (Delivery Boy)
- `POST /api/v1/auth/admin/login` - Admin login
- `POST /api/v1/auth/refresh` - Refresh token

### Public
- `GET /api/v1/public/menu` - Get menu (guest access)

### Customer
- `POST /api/v1/customer/orders` - Place order
- `GET /api/v1/customer/orders` - Get my orders
- `GET /api/v1/customer/orders/{id}` - Get order details
- `POST /api/v1/customer/orders/{id}/payment/razorpay/create` - Create Razorpay order
- `POST /api/v1/customer/orders/{id}/payment/razorpay/verify` - Verify payment
- `POST /api/v1/customer/reviews` - Submit review
- `GET /api/v1/customer/reviews` - Get my reviews

### Delivery Boy
- `GET /api/v1/delivery/orders/available` - Get available orders
- `POST /api/v1/delivery/orders/{id}/accept` - Accept order
- `POST /api/v1/delivery/orders/{id}/update-location` - Update location
- `POST /api/v1/delivery/orders/{id}/deliver` - Mark as delivered
- `GET /api/v1/delivery/orders/my-orders` - Get my orders
- `PUT /api/v1/delivery/status` - Update availability status

### Admin
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/orders` - Get all orders
- `POST /api/v1/admin/orders/{id}/accept` - Accept order
- `POST /api/v1/admin/orders/{id}/reject` - Reject order
- `POST /api/v1/admin/orders/{id}/status` - Update order status
- `GET /api/v1/admin/delivery-boys` - Get all delivery boys
- `POST /api/v1/admin/delivery-boys` - Create delivery boy
- `GET /api/v1/admin/menu/categories` - Get categories
- `POST /api/v1/admin/menu/categories` - Create category
- `GET /api/v1/admin/menu/items` - Get menu items
- `POST /api/v1/admin/menu/items` - Create menu item
- `GET /api/v1/admin/config` - Get configuration
- `POST /api/v1/admin/config` - Update configuration

## 🔔 Notifications

FCM notifications are sent for:
- New order → Admin
- Order accepted → Customer
- Order ready → Delivery boy
- Out for delivery → Customer
- Delivered → Customer & Admin
- COD collected → Admin

## 📝 Order Status Flow

```
PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
```

## 🛡️ Validation Rules

- **Delivery City**: Only Meerut allowed (strict backend validation)
- **Delivery Radius**: Configurable (default 15 km)
- **Minimum Order**: Configurable (default ₹100)
- **Payment**: COD or Online (Razorpay)

## 📦 Database Schema

### Core Tables
- `users` - All users (customers, delivery boys, admin)
- `delivery_boy_details` - Delivery boy specific information
- `menu_categories` - Food categories
- `menu_items` - Food items
- `orders` - Order information
- `order_items` - Order line items
- `payments` - Payment records
- `delivery_tracking` - Real-time delivery tracking
- `reviews` - Customer reviews
- `app_config` - Application configuration

## 📄 License

Proprietary - Shiv Dhaba Food Delivery System

---

**Note**: This is a production-ready system. Ensure all environment variables and API keys are properly configured before deployment.
