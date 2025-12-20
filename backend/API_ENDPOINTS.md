
## CustomerController

### POST /api/v1/customer/orders
- **Description:** Places a new order.
- **Request Contract:** `PlaceOrderRequest` (request body), `Authentication` header (for customer identification)
- **Response Contract:** `ApiResponse<OrderResponse>` (success status, message, placed order details)

### GET /api/v1/customer/orders
- **Description:** Retrieves a list of all orders placed by the authenticated customer.
- **Request Contract:** `Authentication` header
- **Response Contract:** `ApiResponse<List<OrderResponse>>` (success status, message, list of customer's orders)

### GET /api/v1/customer/orders/{orderId}
- **Description:** Retrieves details of a specific order placed by the authenticated customer.
- **Request Contract:** `orderId` (path variable), `Authentication` header
- **Response Contract:** `ApiResponse<OrderResponse>` (success status, message, order details)

### POST /api/v1/customer/orders/{orderId}/payment/razorpay/create
- **Description:** Creates a Razorpay order for a specific customer order.
- **Request Contract:** `orderId` (path variable), `Authentication` header
- **Response Contract:** `ApiResponse<String>` (success status, message, Razorpay order ID)

### POST /api/v1/customer/orders/{orderId}/payment/razorpay/verify
- **Description:** Verifies a Razorpay payment for a specific customer order.
- **Request Contract:** `orderId` (path variable), `razorpayOrderId` (query parameter), `razorpayPaymentId` (query parameter), `razorpaySignature` (query parameter), `Authentication` header
- **Response Contract:** `ApiResponse<PaymentResponse>` (success status, message, payment verification response)

### PUT /api/v1/customer/fcm-token
- **Description:** Updates the FCM (Firebase Cloud Messaging) token for the authenticated customer.
- **Request Contract:** `fcmToken` (query parameter), `Authentication` header
- **Response Contract:** `ApiResponse<Void>` (success status, message)

### POST /api/v1/customer/reviews
- **Description:** Creates a new review for an order or menu item.
- **Request Contract:** `ReviewRequest` (request body), `Authentication` header
- **Response Contract:** `ApiResponse<ReviewResponse>` (success status, message, created review details)

### GET /api/v1/customer/reviews
- **Description:** Retrieves all reviews submitted by the authenticated customer.
- **Request Contract:** `Authentication` header
- **Response Contract:** `ApiResponse<List<ReviewResponse>>` (success status, message, list of customer's reviews)