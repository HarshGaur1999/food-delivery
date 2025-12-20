
## Admin Journey API Flow

1.  **Authentication**
    *   `POST /api/v1/auth/admin/login`: Admin logs in with credentials.
    *   `POST /api/v1/auth/admin/register`: (Initially) Register a new admin user.
    *   `POST /api/v1/auth/refresh`: Refresh authentication token.

2.  **Dashboard & Reporting**
    *   `GET /api/v1/admin/dashboard/stats`: Get key dashboard statistics (orders, revenue, active delivery boys, etc.).

3.  **Order Management**
    *   `GET /api/v1/admin/orders`: View all orders, with optional status filtering.
    *   `GET /api/v1/admin/orders/{orderId}`: Get details of a specific order.
    *   `POST /api/v1/admin/orders/{orderId}/accept`: Accept a pending order.
    *   `POST /api/v1/admin/orders/{orderId}/reject`: Reject a pending order.
    *   `POST /api/v1/admin/orders/{orderId}/status`: Update the status of any order.

4.  **Delivery Boy Management**
    *   `GET /api/v1/admin/delivery-boys`: View all delivery boys and their details.
    *   `POST /api/v1/admin/delivery-boys`: Create a new delivery boy account.

5.  **Menu Management**
    *   `GET /api/v1/admin/menu/categories`: View all menu categories.
    *   `POST /api/v1/admin/menu/categories`: Create a new menu category.
    *   `GET /api/v1/admin/menu/items`: View all menu items.
    *   `POST /api/v1/admin/menu/items`: Create a new menu item.

6.  **Application Configuration**
    *   `GET /api/v1/admin/config`: Retrieve all application configurations.
    *   `POST /api/v1/admin/config`: Update or create application configurations.
