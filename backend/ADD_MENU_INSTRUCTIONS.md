# How to Add Menu Items to Database

## Quick Method: Run SQL Script

### Step 1: Connect to MySQL Database

Open MySQL command line or MySQL Workbench and connect to your database:
```bash
mysql -u root -p
```

### Step 2: Run the SQL Script

```bash
# Navigate to backend directory
cd d:\food-delivery\backend

# Run the script
mysql -u root -p food_delivery_db < menu_seed_data.sql
```

Or copy-paste the SQL from `menu_seed_data.sql` into MySQL Workbench and execute.

### Step 3: Verify Data

```sql
-- Check categories
SELECT * FROM menu_categories;

-- Check items
SELECT mc.name as category, COUNT(mi.id) as items 
FROM menu_categories mc 
LEFT JOIN menu_items mi ON mc.id = mi.category_id 
GROUP BY mc.id, mc.name;

-- Check total items
SELECT COUNT(*) FROM menu_items;
```

You should see:
- 8 categories
- ~90+ menu items

## Alternative Method: Use Admin API

If you have admin access, you can use the API endpoints:

### 1. Create Categories

```bash
POST http://192.168.29.104:8080/api/v1/admin/menu/categories
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "name": "Chapati's",
  "description": "Freshly made chapatis and naans",
  "displayOrder": 1,
  "isActive": true
}
```

### 2. Create Menu Items

```bash
POST http://192.168.29.104:8080/api/v1/admin/menu/items
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "category": {
    "id": 1
  },
  "name": "Tandoori Chapati",
  "description": "Fresh tandoori chapati",
  "price": 10.00,
  "status": "AVAILABLE",
  "isVegetarian": true,
  "isSpicy": false,
  "displayOrder": 1
}
```

**Note:** This method is tedious for 90+ items, so SQL script is recommended.

## After Adding Menu Items

1. **Clear Cache** (if using Redis):
   - Restart backend to clear cache
   - Or clear Redis cache manually

2. **Reload App**:
   - Pull to refresh in the app
   - Menu should now show all items!

3. **Verify API**:
   ```bash
   curl http://192.168.29.104:8080/api/v1/public/menu
   ```
   Should return all categories with items.

## Troubleshooting

### If SQL script fails:

1. **Check database name**: Make sure it's `food_delivery_db`
2. **Check table names**: `menu_categories` and `menu_items`
3. **Check for duplicates**: If items already exist, you may need to delete first:
   ```sql
   DELETE FROM menu_items;
   DELETE FROM menu_categories;
   ```

### If menu still shows empty:

1. Check backend logs for errors
2. Verify API returns data: `http://192.168.29.104:8080/api/v1/public/menu`
3. Check if categories have `is_active = true`
4. Check if items have `status = 'AVAILABLE'`

## Expected Result

After running the script, you should have:
- ✅ 8 Categories
- ✅ ~90+ Menu Items
- ✅ All items visible in app
- ✅ Beautiful UI showing all items with animations

---

**SQL Script Location:** `backend/menu_seed_data.sql`






















