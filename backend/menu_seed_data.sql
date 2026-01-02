-- SHIV DHABA Menu Data Seed Script
-- This script adds all menu categories and items to the database
-- Run this in your MySQL database: food_delivery_db

USE food_delivery_db;

-- Clear existing menu data (optional - uncomment if you want to reset)
-- DELETE FROM menu_items;
-- DELETE FROM menu_categories;

-- Insert Menu Categories
INSERT INTO menu_categories (name, description, display_order, is_active, created_at, updated_at) VALUES
('Chapati\'s', 'Freshly made chapatis and naans', 1, true, NOW(), NOW()),
('Paratha\'s', 'Delicious stuffed parathas', 2, true, NOW(), NOW()),
('Snacks', 'Quick snacks and bites', 3, true, NOW(), NOW()),
('Rice', 'Flavorful rice dishes', 4, true, NOW(), NOW()),
('Beverages', 'Cool and hot beverages', 5, true, NOW(), NOW()),
('Sabji\'s', 'Vegetable curries and dishes', 6, true, NOW(), NOW()),
('Salad\'s', 'Fresh salads', 7, true, NOW(), NOW()),
('Raita', 'Yogurt based sides', 8, true, NOW(), NOW());

-- Insert Menu Items for Chapati's (Category ID = 1, assuming it's the first inserted)
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1) as category_id,
    'Tandoori Chapati' as name,
    'Fresh tandoori chapati' as description,
    10.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    false as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Butter Chapati', 'Buttery soft chapati', 12.00, 'AVAILABLE', true, false, 2, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Missi Roti', 'Traditional missi roti', 30.00, 'AVAILABLE', true, false, 3, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Missi Roti Pyaz Wali', 'Missi roti with onions', 40.00, 'AVAILABLE', true, false, 4, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Plain Naan', 'Plain naan bread', 40.00, 'AVAILABLE', true, false, 5, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Butter Naan', 'Butter naan', 50.00, 'AVAILABLE', true, false, 6, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Stuff Naan Mix', 'Stuffed naan with mix vegetables', 90.00, 'AVAILABLE', true, false, 7, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Garlic Naan', 'Garlic flavored naan', 100.00, 'AVAILABLE', true, false, 8, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1), 'Stuff Paneer Naan', 'Paneer stuffed naan', 130.00, 'AVAILABLE', true, false, 9, NOW(), NOW();

-- Insert Menu Items for Paratha's
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Paratha\'s' LIMIT 1) as category_id,
    'Lachha Paratha' as name,
    'Layered lachha paratha' as description,
    40.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    false as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Paratha\'s' LIMIT 1), 'Aloo Pyaz Paratha', 'Paratha stuffed with potato and onion', 60.00, 'AVAILABLE', true, false, 2, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Paratha\'s' LIMIT 1), 'Pyaz Paratha', 'Onion stuffed paratha', 70.00, 'AVAILABLE', true, false, 3, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Paratha\'s' LIMIT 1), 'Mix Paratha', 'Mixed vegetable paratha', 90.00, 'AVAILABLE', true, false, 4, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Paratha\'s' LIMIT 1), 'Paneer Paratha', 'Paneer stuffed paratha', 120.00, 'AVAILABLE', true, false, 5, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Paratha\'s' LIMIT 1), 'Pyaz Paneer Paratha', 'Paneer and onion paratha', 120.00, 'AVAILABLE', true, false, 6, NOW(), NOW();

-- Insert Menu Items for Snacks
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Snacks' LIMIT 1) as category_id,
    'Butter Toast (2 pcs)' as name,
    'Buttery toast - 2 pieces' as description,
    50.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    false as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at;

-- Insert Menu Items for Rice
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1) as category_id,
    'Plain Rice' as name,
    'Steamed basmati rice' as description,
    70.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    false as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1), 'Jeera Rice', 'Cumin flavored rice', 80.00, 'AVAILABLE', true, false, 2, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1), 'Veg Pulao', 'Vegetable pulao', 120.00, 'AVAILABLE', true, false, 3, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1), 'Veg Biryani', 'Vegetable biryani', 120.00, 'AVAILABLE', true, false, 4, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1), 'Matar Pulao', 'Peas pulao', 120.00, 'AVAILABLE', true, false, 5, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1), 'Paneer Pulao', 'Paneer pulao', 130.00, 'AVAILABLE', true, false, 6, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1), 'Veg Fried Rice', 'Vegetable fried rice', 130.00, 'AVAILABLE', true, false, 7, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1), 'Cheese Fried Rice', 'Cheese fried rice', 140.00, 'AVAILABLE', true, false, 8, NOW(), NOW();

-- Insert Menu Items for Beverages
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1) as category_id,
    'Tea' as name,
    'Hot tea' as description,
    20.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    false as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1), 'Jaggery Tea', 'Tea with jaggery', 25.00, 'AVAILABLE', true, false, 2, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1), 'Special Tea (Kulhad)', 'Special tea in kulhad', 25.00, 'AVAILABLE', true, false, 3, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1), 'Coffee', 'Hot coffee', 25.00, 'AVAILABLE', true, false, 4, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1), 'Chhachh Per Glass (Mattha)', 'Buttermilk per glass', 40.00, 'AVAILABLE', true, false, 5, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1), 'Sweet Lassi Per Glass', 'Sweet lassi per glass', 60.00, 'AVAILABLE', true, false, 6, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1), 'Milk Per Glass', 'Milk per glass', 35.00, 'AVAILABLE', true, false, 7, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1), 'Cold Drink', 'Cold drink', 35.00, 'AVAILABLE', true, false, 8, NOW(), NOW();

-- Insert Menu Items for Sabji's - Paneer Dishes
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1) as category_id,
    'Chilli Paneer Dry' as name,
    'Dry chilli paneer' as description,
    300.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    true as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Chilli Paneer', 'Chilli paneer gravy', 250.00, 'AVAILABLE', true, true, 2, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Kadai Paneer', 'Kadai paneer', 230.00, 'AVAILABLE', true, true, 3, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Khoya Paneer', 'Khoya paneer', 230.00, 'AVAILABLE', true, false, 4, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Paneer Bhurji', 'Scrambled paneer', 300.00, 'AVAILABLE', true, false, 5, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Paneer Butter Masala', 'Paneer in butter masala', 230.00, 'AVAILABLE', true, false, 6, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Paneer Do Pyaza', 'Paneer with double onion', 230.00, 'AVAILABLE', true, false, 7, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Handi Paneer', 'Handi paneer', 230.00, 'AVAILABLE', true, false, 8, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Matar Mushroom', 'Peas and mushroom curry', 210.00, 'AVAILABLE', true, false, 9, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Malai Kofta', 'Creamy kofta curry', 230.00, 'AVAILABLE', true, false, 10, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Shahi Paneer', 'Royal paneer curry', 220.00, 'AVAILABLE', true, false, 11, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Cheese Tomato', 'Cheese and tomato curry', 230.00, 'AVAILABLE', true, false, 12, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Matar Paneer', 'Peas and paneer curry', 200.00, 'AVAILABLE', true, false, 13, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Palak Paneer', 'Spinach and paneer curry', 200.00, 'AVAILABLE', true, false, 14, NOW(), NOW();

-- Insert Menu Items for Sabji's - Chaap and Veg Items
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1) as category_id,
    'Kadai Chaap' as name,
    'Kadai style chaap' as description,
    250.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    true as is_spicy,
    15 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Gravy Chaap', 'Gravy chaap', 200.00, 'AVAILABLE', true, false, 16, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Chana Masala', 'Chickpea curry', 160.00, 'AVAILABLE', true, false, 17, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Dum Aloo', 'Potato dum curry', 200.00, 'AVAILABLE', true, false, 18, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Mix Veg', 'Mixed vegetable curry', 180.00, 'AVAILABLE', true, false, 19, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Shev Bhaji', 'Shev curry', 150.00, 'AVAILABLE', true, false, 20, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Aloo Jeera', 'Cumin potatoes', 90.00, 'AVAILABLE', true, false, 21, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Aloo Matar', 'Potato and peas curry', 100.00, 'AVAILABLE', true, false, 22, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Aloo Palak', 'Potato and spinach curry', 100.00, 'AVAILABLE', true, false, 23, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Kadhi Pakora', 'Yogurt curry with pakoras', 90.00, 'AVAILABLE', true, false, 24, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Aloo Chholey', 'Potato and chickpea curry', 90.00, 'AVAILABLE', true, false, 25, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Dal Makhani', 'Creamy black lentils', 170.00, 'AVAILABLE', true, false, 26, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Dal Fry Kali', 'Black dal fry', 110.00, 'AVAILABLE', true, false, 27, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Dal Fry', 'Dal fry', 100.00, 'AVAILABLE', true, false, 28, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Dal Tadka', 'Tempered dal', 120.00, 'AVAILABLE', true, false, 29, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Plain Maggie', 'Plain maggie noodles', 50.00, 'AVAILABLE', true, false, 30, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1), 'Veg Maggie', 'Vegetable maggie', 80.00, 'AVAILABLE', true, false, 31, NOW(), NOW();

-- Insert Menu Items for Salad's
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Salad\'s' LIMIT 1) as category_id,
    'Onion Salad' as name,
    'Fresh onion salad' as description,
    30.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    false as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Salad\'s' LIMIT 1), 'Green Salad', 'Fresh green salad', 60.00, 'AVAILABLE', true, false, 2, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Salad\'s' LIMIT 1), 'Kheera Salad', 'Cucumber salad', 30.00, 'AVAILABLE', true, false, 3, NOW(), NOW();

-- Insert Menu Items for Raita
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM menu_categories WHERE name = 'Raita' LIMIT 1) as category_id,
    'Dahi (Half)' as name,
    'Yogurt - half portion' as description,
    50.00 as price,
    'AVAILABLE' as status,
    true as is_vegetarian,
    false as is_spicy,
    1 as display_order,
    NOW() as created_at,
    NOW() as updated_at
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Raita' LIMIT 1), 'Dahi (Full)', 'Yogurt - full portion', 80.00, 'AVAILABLE', true, false, 2, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Raita' LIMIT 1), 'Mix Raita', 'Mixed vegetable raita', 100.00, 'AVAILABLE', true, false, 3, NOW(), NOW()
UNION ALL SELECT (SELECT id FROM menu_categories WHERE name = 'Raita' LIMIT 1), 'Boondi Raita', 'Boondi raita', 90.00, 'AVAILABLE', true, false, 4, NOW(), NOW();

-- Verify data was inserted
SELECT 
    mc.name as category_name,
    COUNT(mi.id) as item_count
FROM menu_categories mc
LEFT JOIN menu_items mi ON mc.id = mi.category_id
GROUP BY mc.id, mc.name
ORDER BY mc.display_order;






















