# User Flows

## Customer User Flow

1.  **Registration/Login**:
    *   **Action**: User opens the app.
    *   **Decision**: New user or returning user?
    *   **New User Path**: Enters phone/email -> Receives OTP -> Enters OTP -> Account created/logged in.
    *   **Returning User Path**: Enters phone/email -> Receives OTP -> Enters OTP -> Logged in.

2.  **Browse Menu and Place Order**:
    *   **Action**: User views the home screen (menu categories/items).
    *   **Action**: User browses categories, searches for items, or views recommended items.
    *   **Action**: User selects items and adds them to the cart.
    *   **Action**: User proceeds to checkout.
    *   **Action**: User provides delivery address and special instructions.
    *   **Decision**: Choose payment method (e.g., Razorpay, Cash on Delivery).
    *   **Action**: If online payment, user completes payment via Razorpay.
    *   **Action**: User confirms the order.

3.  **Track Order**:
    *   **Action**: User views "My Orders" section.
    *   **Action**: User selects an active order.
    *   **Action**: User views real-time status updates (e.g., preparing, out for delivery, delivered) and delivery boy's location on a map.

4.  **Review Order**:
    *   **Action**: After order is delivered, user navigates to "My Orders" and selects a delivered order.
    *   **Action**: User rates the food/delivery and leaves a comment.
    *   **Action**: User submits the review.

## Delivery Bot User Flow

1.  **Login**:
    *   **Action**: Delivery bot opens the app.
    *   **Action**: Enters phone/email -> Receives OTP -> Enters OTP -> Logged in.

2.  **Manage Availability**:
    *   **Action**: Delivery bot toggles their "Available" and "On-Duty" status.

3.  **Accept and Deliver Order**:
    *   **Action**: Delivery bot views a list of available orders.
    *   **Action**: Delivery bot accepts an order.
    *   **Action**: Delivery bot navigates to the restaurant to pick up the order.
    *   **Action**: Delivery bot updates their location periodically during delivery.
    *   **Action**: Delivery bot navigates to the customer's location.
    *   **Action**: Delivery bot marks the order as delivered.
    *   **Decision**: If Cash on Delivery, collects payment from the customer.

4.  **View My Deliveries**:
    *   **Action**: Delivery bot views a list of their assigned and completed orders.

## Admin User Flow

1.  **Login**:
    *   **Action**: Admin opens the admin panel/app.
    *   **Action**: Enters username and password -> Logs in.

2.  **View Dashboard**:
    *   **Action**: Admin views the dashboard with key metrics (daily orders, revenue, active delivery boys, pending orders).

3.  **Manage Orders**:
    *   **Action**: Admin views a list of all orders, with filtering options (e.g., by status).
    *   **Action**: Admin views details of a specific order.
    *   **Action**: Admin accepts or rejects pending orders.
    *   **Action**: Admin manually updates the status of an order (e.g., "preparing", "ready").

4.  **Manage Delivery Boys**:
    *   **Action**: Admin views a list of all delivery boys and their details.
    *   **Action**: Admin creates new delivery boy accounts.

5.  **Manage Menu**:
    *   **Action**: Admin views menu categories and items.
    *   **Action**: Admin adds new menu categories.
    *   **Action**: Admin adds new menu items to categories.

6.  **Manage Application Configuration**:
    *   **Action**: Admin views current application settings.
    *   **Action**: Admin updates application settings (e.g., delivery charges, promotional messages).
