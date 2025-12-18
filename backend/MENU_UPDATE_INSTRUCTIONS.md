# Menu Update Instructions

This document explains how to update the menu data in the database using the provided SQL script.

## 📋 Prerequisites

1. MySQL database should be running
2. Database `food_delivery_db` should exist (or will be created automatically)
3. Backend application should be stopped before running the script (to avoid conflicts)

## 🚀 Steps to Update Menu

### Option 1: Using MySQL Command Line

1. Open terminal/command prompt
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
   (Enter password when prompted: `admin` as per application.properties)
4. Select the database:
   ```sql
   USE food_delivery_db;
   ```
5. Run the SQL script:
   ```sql
   SOURCE src/main/resources/menu_data.sql;
   ```
   Or if you're in the backend directory:
   ```sql
   SOURCE d:/food-delivery/backend/src/main/resources/menu_data.sql;
   ```

### Option 2: Using MySQL Workbench or phpMyAdmin

1. Open MySQL Workbench or phpMyAdmin
2. Connect to your MySQL server
3. Select the `food_delivery_db` database
4. Open the file `backend/src/main/resources/menu_data.sql`
5. Execute the entire script

### Option 3: Using Command Line (One-liner)

```bash
mysql -u root -padmin food_delivery_db < backend/src/main/resources/menu_data.sql
```

## 📊 Menu Categories Included

The script will create the following categories with all items:

1. **Snacks** - Quick bites and snacks
2. **Parantha's** - Freshly made paranthas with various fillings
3. **Chapati's** - Traditional Indian breads and naans
4. **Beverages** - Refreshing drinks
5. **Rice** - Flavorful rice dishes and biryanis
6. **Sabji's** - Vegetable and paneer curries
7. **Salad's** - Fresh salads
8. **Raita** - Yogurt-based side dishes

## ⚠️ Important Notes

- The script uses `NOW()` for timestamps, so `created_at` and `updated_at` will be set automatically
- All items are set to `AVAILABLE` status by default
- All items are marked as vegetarian (`is_vegetarian = true`)
- Spicy items are marked appropriately based on the dish
- If you want to reset existing menu data, uncomment the DELETE statements at the top of the SQL file

## ✅ Verification

After running the script, you can verify the data by:

1. Starting the backend application
2. Calling the menu API endpoint:
   ```bash
   curl http://localhost:8080/api/v1/public/menu
   ```
3. Or using the admin endpoints to view categories and items:
   ```bash
   curl http://localhost:8080/api/v1/admin/menu/categories
   curl http://localhost:8080/api/v1/admin/menu/items
   ```

## 🔄 Updating Existing Menu

If you need to update prices or add/remove items:

1. You can manually edit the SQL script and re-run it (after clearing existing data)
2. Or use the Admin API endpoints:
   - `POST /api/v1/admin/menu/categories` - Create new category
   - `POST /api/v1/admin/menu/items` - Create new menu item

## 📝 Notes

- The script includes all items from the physical menu images provided
- Prices are in Indian Rupees (INR)
- Cold Drink price was not visible in the image, so a default price of ₹30.00 has been set
- Dhai (yogurt) is split into two items: half and full portions as shown in the menu



