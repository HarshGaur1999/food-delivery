# MySQL Workbench - Step by Step Guide

## File Location
**SQL Script File:** `d:\food-delivery\backend\menu_seed_data.sql`

## Step-by-Step Instructions

### Step 1: Open MySQL Workbench
1. Windows Start Menu se MySQL Workbench open karein
2. Ya Desktop shortcut se open karein

### Step 2: Connect to Database
1. MySQL Connections list mein apna connection click karein
   - Usually: "Local instance MySQL" ya "localhost"
2. Password enter karein (default: `admin`)
3. Connect button click karein

### Step 3: Select Database
1. Left sidebar mein "Schemas" tab open hoga
2. `food_delivery_db` database ko expand karein
3. Database par right-click karein
4. "Set as Default Schema" select karein
   - Ya top dropdown se `food_delivery_db` select karein

### Step 4: Open SQL Script File
**Method 1: File Menu se**
1. Top menu bar mein "File" click karein
2. "Open SQL Script..." click karein
3. File browser mein navigate karein:
   ```
   d:\food-delivery\backend\menu_seed_data.sql
   ```
4. File select karein
5. "Open" button click karein

**Method 2: Drag and Drop**
1. File Explorer (Windows Explorer) open karein
2. Navigate to: `d:\food-delivery\backend\`
3. `menu_seed_data.sql` file ko drag karein
4. MySQL Workbench window mein drop karein

### Step 5: Review SQL Script
1. SQL script editor window mein code dikhega
2. Script ko review karein:
   - 8 categories add hongi
   - ~90 menu items add honge
   - All properly formatted

### Step 6: Execute Script
1. Toolbar mein **⚡ Lightning bolt icon** (Execute) button click karein
   - Ya keyboard shortcut: `Ctrl + Shift + Enter`
2. Ya "Query" menu se "Execute (All or Selection)" select karein

### Step 7: Check Execution Results
1. Bottom panel mein "Output" tab mein results dikhenge
2. Success message dikhega:
   ```
   Query OK, 8 rows affected (categories)
   Query OK, 9 rows affected (items)
   ...
   ```
3. Agar koi error aaye, error message read karein

### Step 8: Verify Data Added
1. New query tab open karein (Ctrl + T)
2. Yeh query run karein:
   ```sql
   -- Check categories
   SELECT * FROM menu_categories;
   
   -- Check items count
   SELECT COUNT(*) as total_items FROM menu_items;
   
   -- Check items by category
   SELECT mc.name as category, COUNT(mi.id) as items 
   FROM menu_categories mc 
   LEFT JOIN menu_items mi ON mc.id = mi.category_id 
   GROUP BY mc.id, mc.name
   ORDER BY mc.display_order;
   ```
3. Results check karein:
   - 8 categories dikhni chahiye
   - ~90 items dikhne chahiye

### Step 9: Restart Backend (Important!)
1. Backend server ko restart karein (cache clear ke liye)
2. Ya backend stop karein aur phir start karein

### Step 10: Test in App
1. React Native app mein jao
2. Menu screen open karein
3. Pull-to-refresh karein
4. Ab saare menu items dikhne chahiye!

## Visual Guide

```
MySQL Workbench Window Layout:
┌─────────────────────────────────────────┐
│ File Edit View Query Database ...      │
├─────────────────────────────────────────┤
│                                         │
│  [SQL Editor Tab - menu_seed_data.sql] │
│  ┌─────────────────────────────────┐   │
│  │ -- SHIV DHABA Menu Data...      │   │
│  │ USE food_delivery_db;           │   │
│  │ INSERT INTO menu_categories...  │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [⚡ Execute Button] ← Click Here!     │
│                                         │
├─────────────────────────────────────────┤
│ Output | Action Output | Query Results │
│                                         │
│ Query OK, 8 rows affected              │
│ Query OK, 9 rows affected              │
│ ...                                     │
└─────────────────────────────────────────┘
```

## Troubleshooting

### Problem: "File not found"
**Solution:**
- Check file path: `d:\food-delivery\backend\menu_seed_data.sql`
- Ya file ko copy karke kisi accessible location par paste karein

### Problem: "Table doesn't exist"
**Solution:**
- Database name verify karein: `food_delivery_db`
- Backend start karein pehle (tables auto-create honge)

### Problem: "Duplicate entry" error
**Solution:**
- Pehle existing data delete karein:
  ```sql
  DELETE FROM menu_items;
  DELETE FROM menu_categories;
  ```
- Phir script run karein

### Problem: "Access denied"
**Solution:**
- Correct database user aur password use karein
- Root user se connect karein

## Quick Checklist

- [ ] MySQL Workbench open kiya
- [ ] Database connection established
- [ ] `food_delivery_db` selected
- [ ] `menu_seed_data.sql` file open kiya
- [ ] Script execute kiya (⚡ button)
- [ ] Success messages check kiye
- [ ] Data verify kiya
- [ ] Backend restart kiya
- [ ] App mein menu check kiya

## Expected Results

After successful execution:
- ✅ 8 menu categories added
- ✅ ~90 menu items added
- ✅ All items visible in React Native app
- ✅ Beautiful UI showing all items with prices

---

**File Path:** `d:\food-delivery\backend\menu_seed_data.sql`

