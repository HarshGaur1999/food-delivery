-- Menu Data Initialization Script for Shiv Dhaba
-- This script populates the menu_categories and menu_items tables

-- Clear existing data (optional - uncomment if you want to reset)
-- DELETE FROM menu_items;
-- DELETE FROM menu_categories;

-- Insert Menu Categories
INSERT INTO menu_categories (name, description, display_order, is_active, created_at, updated_at) VALUES
('Snacks', 'Delicious snacks and quick bites', 1, true, NOW(), NOW()),
('Parantha\'s', 'Freshly made paranthas with various fillings', 2, true, NOW(), NOW()),
('Chapati\'s', 'Traditional Indian breads and naans', 3, true, NOW(), NOW()),
('Beverages', 'Refreshing drinks and beverages', 4, true, NOW(), NOW()),
('Rice', 'Flavorful rice dishes and biryanis', 5, true, NOW(), NOW()),
('Sabji\'s', 'Delicious vegetable and paneer curries', 6, true, NOW(), NOW()),
('Salad\'s', 'Fresh and healthy salads', 7, true, NOW(), NOW()),
('Raita', 'Cooling yogurt-based side dishes', 8, true, NOW(), NOW());

-- Get category IDs (assuming they are inserted in order)
SET @snacks_id = (SELECT id FROM menu_categories WHERE name = 'Snacks' LIMIT 1);
SET @parantha_id = (SELECT id FROM menu_categories WHERE name = 'Parantha\'s' LIMIT 1);
SET @chapati_id = (SELECT id FROM menu_categories WHERE name = 'Chapati\'s' LIMIT 1);
SET @beverages_id = (SELECT id FROM menu_categories WHERE name = 'Beverages' LIMIT 1);
SET @rice_id = (SELECT id FROM menu_categories WHERE name = 'Rice' LIMIT 1);
SET @sabji_id = (SELECT id FROM menu_categories WHERE name = 'Sabji\'s' LIMIT 1);
SET @salad_id = (SELECT id FROM menu_categories WHERE name = 'Salad\'s' LIMIT 1);
SET @raita_id = (SELECT id FROM menu_categories WHERE name = 'Raita' LIMIT 1);

-- Insert Snacks
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@snacks_id, 'Butter Toast (2 pcs)', 'Crispy butter toast served in pairs', 50.00, 'AVAILABLE', true, false, 1, NOW(), NOW());

-- Insert Parantha's
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@parantha_id, 'Lachha Parantha', 'Layered parantha with butter', 40.00, 'AVAILABLE', true, false, 1, NOW(), NOW()),
(@parantha_id, 'Aloo Pyaz Parantha', 'Parantha stuffed with potato and onion', 60.00, 'AVAILABLE', true, false, 2, NOW(), NOW()),
(@parantha_id, 'Pyaz Parantha', 'Parantha stuffed with onions', 70.00, 'AVAILABLE', true, false, 3, NOW(), NOW()),
(@parantha_id, 'Mix Parantha', 'Parantha with mixed vegetables', 90.00, 'AVAILABLE', true, false, 4, NOW(), NOW()),
(@parantha_id, 'Paneer Parantha', 'Parantha stuffed with paneer', 120.00, 'AVAILABLE', true, false, 5, NOW(), NOW()),
(@parantha_id, 'Pyaz Paneer Parantha', 'Parantha stuffed with paneer and onion', 120.00, 'AVAILABLE', true, false, 6, NOW(), NOW());

-- Insert Chapati's
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@chapati_id, 'Tandoori Chapati', 'Fresh tandoori chapati', 10.00, 'AVAILABLE', true, false, 1, NOW(), NOW()),
(@chapati_id, 'Butter Chapati', 'Buttery soft chapati', 12.00, 'AVAILABLE', true, false, 2, NOW(), NOW()),
(@chapati_id, 'Missi Roti', 'Traditional missi roti', 30.00, 'AVAILABLE', true, false, 3, NOW(), NOW()),
(@chapati_id, 'Missi Roti Pyaz Wali', 'Missi roti with onions', 40.00, 'AVAILABLE', true, false, 4, NOW(), NOW()),
(@chapati_id, 'Plain Naan', 'Soft plain naan', 40.00, 'AVAILABLE', true, false, 5, NOW(), NOW()),
(@chapati_id, 'Butter Naan', 'Buttery naan', 50.00, 'AVAILABLE', true, false, 6, NOW(), NOW()),
(@chapati_id, 'Stuff Naan Mix', 'Stuffed naan with mixed vegetables', 90.00, 'AVAILABLE', true, false, 7, NOW(), NOW()),
(@chapati_id, 'Garlic Naan', 'Garlic flavored naan', 100.00, 'AVAILABLE', true, false, 8, NOW(), NOW()),
(@chapati_id, 'Stuff Paneer Naan', 'Naan stuffed with paneer', 130.00, 'AVAILABLE', true, false, 9, NOW(), NOW());

-- Insert Beverages
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@beverages_id, 'Tea', 'Hot tea', 20.00, 'AVAILABLE', true, false, 1, NOW(), NOW()),
(@beverages_id, 'Jaggery Tea', 'Tea with jaggery', 25.00, 'AVAILABLE', true, false, 2, NOW(), NOW()),
(@beverages_id, 'Special Tea (Kullhad)', 'Special tea served in clay cup', 25.00, 'AVAILABLE', true, false, 3, NOW(), NOW()),
(@beverages_id, 'Coffee', 'Hot coffee', 25.00, 'AVAILABLE', true, false, 4, NOW(), NOW()),
(@beverages_id, 'Chach Per Glass (Matha)', 'Buttermilk per glass', 40.00, 'AVAILABLE', true, false, 5, NOW(), NOW()),
(@beverages_id, 'Sweet Lassi Per Glass', 'Sweet yogurt drink per glass', 60.00, 'AVAILABLE', true, false, 6, NOW(), NOW()),
(@beverages_id, 'Milk Per Glass', 'Fresh milk per glass', 35.00, 'AVAILABLE', true, false, 7, NOW(), NOW()),
(@beverages_id, 'Cold Drink', 'Refreshing cold drink', 30.00, 'AVAILABLE', true, false, 8, NOW(), NOW());

-- Insert Rice
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@rice_id, 'Plain Rice', 'Steamed basmati rice', 70.00, 'AVAILABLE', true, false, 1, NOW(), NOW()),
(@rice_id, 'Jeera Rice', 'Cumin flavored rice', 80.00, 'AVAILABLE', true, false, 2, NOW(), NOW()),
(@rice_id, 'Veg Pulao', 'Vegetable pulao', 120.00, 'AVAILABLE', true, false, 3, NOW(), NOW()),
(@rice_id, 'Veg Biryani', 'Vegetable biryani', 120.00, 'AVAILABLE', true, true, 4, NOW(), NOW()),
(@rice_id, 'Matar Pulao', 'Peas pulao', 120.00, 'AVAILABLE', true, false, 5, NOW(), NOW()),
(@rice_id, 'Paneer Pulao', 'Paneer pulao', 130.00, 'AVAILABLE', true, false, 6, NOW(), NOW()),
(@rice_id, 'Veg Fried Rice', 'Vegetable fried rice', 130.00, 'AVAILABLE', true, false, 7, NOW(), NOW()),
(@rice_id, 'Cheese Fried Rice', 'Cheese fried rice', 140.00, 'AVAILABLE', true, false, 8, NOW(), NOW());

-- Insert Sabji's (Left Column)
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@sabji_id, 'Chilli Paneer Dry', 'Spicy dry paneer with chillies', 300.00, 'AVAILABLE', true, true, 1, NOW(), NOW()),
(@sabji_id, 'Chilli Paneer', 'Paneer in spicy chilli gravy', 250.00, 'AVAILABLE', true, true, 2, NOW(), NOW()),
(@sabji_id, 'Kadai Paneer', 'Paneer in kadai masala', 230.00, 'AVAILABLE', true, true, 3, NOW(), NOW()),
(@sabji_id, 'Khoya Paneer', 'Paneer in rich khoya gravy', 230.00, 'AVAILABLE', true, false, 4, NOW(), NOW()),
(@sabji_id, 'Paneer Bhurji', 'Scrambled paneer', 300.00, 'AVAILABLE', true, false, 5, NOW(), NOW()),
(@sabji_id, 'Paneer Butter Masala', 'Paneer in creamy tomato gravy', 230.00, 'AVAILABLE', true, false, 6, NOW(), NOW()),
(@sabji_id, 'Paneer Do Pyaza', 'Paneer with double onions', 230.00, 'AVAILABLE', true, false, 7, NOW(), NOW()),
(@sabji_id, 'Handi Paneer', 'Paneer cooked in handi style', 230.00, 'AVAILABLE', true, true, 8, NOW(), NOW()),
(@sabji_id, 'Matar Mushroom', 'Peas and mushroom curry', 210.00, 'AVAILABLE', true, false, 9, NOW(), NOW()),
(@sabji_id, 'Malai Kofta', 'Creamy kofta curry', 230.00, 'AVAILABLE', true, false, 10, NOW(), NOW()),
(@sabji_id, 'Shahi Paneer', 'Royal paneer curry', 220.00, 'AVAILABLE', true, false, 11, NOW(), NOW()),
(@sabji_id, 'Cheese Tomato', 'Cheese in tomato gravy', 230.00, 'AVAILABLE', true, false, 12, NOW(), NOW()),
(@sabji_id, 'Matar Paneer', 'Peas and paneer curry', 200.00, 'AVAILABLE', true, false, 13, NOW(), NOW()),
(@sabji_id, 'Palak Paneer', 'Paneer in spinach gravy', 200.00, 'AVAILABLE', true, false, 14, NOW(), NOW()),
(@sabji_id, 'Kadai Chaap', 'Soya chaap in kadai masala', 250.00, 'AVAILABLE', true, true, 15, NOW(), NOW()),
(@sabji_id, 'Gravy Chaap', 'Soya chaap in gravy', 200.00, 'AVAILABLE', true, false, 16, NOW(), NOW());

-- Insert Sabji's (Right Column)
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@sabji_id, 'Chana Masala', 'Spiced chickpea curry', 160.00, 'AVAILABLE', true, true, 17, NOW(), NOW()),
(@sabji_id, 'Dum Aloo', 'Potato curry cooked in dum style', 200.00, 'AVAILABLE', true, true, 18, NOW(), NOW()),
(@sabji_id, 'Mix Veg.', 'Mixed vegetable curry', 180.00, 'AVAILABLE', true, false, 19, NOW(), NOW()),
(@sabji_id, 'Shev Bhaji', 'Okra curry', 150.00, 'AVAILABLE', true, false, 20, NOW(), NOW()),
(@sabji_id, 'Aloo Jeera', 'Cumin potatoes', 90.00, 'AVAILABLE', true, false, 21, NOW(), NOW()),
(@sabji_id, 'Aloo Matar', 'Potato and peas curry', 100.00, 'AVAILABLE', true, false, 22, NOW(), NOW()),
(@sabji_id, 'Aloo Palak', 'Potato and spinach curry', 100.00, 'AVAILABLE', true, false, 23, NOW(), NOW()),
(@sabji_id, 'Kadhi Pakora', 'Yogurt curry with pakoras', 90.00, 'AVAILABLE', true, false, 24, NOW(), NOW()),
(@sabji_id, 'Aloo Chholey', 'Potato and chickpea curry', 90.00, 'AVAILABLE', true, true, 25, NOW(), NOW()),
(@sabji_id, 'Dal Makhani', 'Creamy black lentil curry', 170.00, 'AVAILABLE', true, false, 26, NOW(), NOW()),
(@sabji_id, 'Dal Fry Kali', 'Black dal fry', 110.00, 'AVAILABLE', true, false, 27, NOW(), NOW()),
(@sabji_id, 'Dal Fry', 'Fried lentil curry', 100.00, 'AVAILABLE', true, false, 28, NOW(), NOW()),
(@sabji_id, 'Dal Tadka', 'Tempered lentil curry', 120.00, 'AVAILABLE', true, false, 29, NOW(), NOW()),
(@sabji_id, 'Plain Maggie', 'Plain instant noodles', 50.00, 'AVAILABLE', true, false, 30, NOW(), NOW()),
(@sabji_id, 'Veg. Maggie', 'Vegetable instant noodles', 80.00, 'AVAILABLE', true, false, 31, NOW(), NOW());

-- Insert Salad's
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@salad_id, 'Onion Salad', 'Fresh onion salad', 30.00, 'AVAILABLE', true, false, 1, NOW(), NOW()),
(@salad_id, 'Green Salad', 'Fresh mixed green salad', 60.00, 'AVAILABLE', true, false, 2, NOW(), NOW()),
(@salad_id, 'Kheera Salad', 'Cucumber salad', 30.00, 'AVAILABLE', true, false, 3, NOW(), NOW());

-- Insert Raita
INSERT INTO menu_items (category_id, name, description, price, status, is_vegetarian, is_spicy, display_order, created_at, updated_at) VALUES
(@raita_id, 'Dhai (half)', 'Plain yogurt half portion', 50.00, 'AVAILABLE', true, false, 1, NOW(), NOW()),
(@raita_id, 'Dhai (full)', 'Plain yogurt full portion', 80.00, 'AVAILABLE', true, false, 2, NOW(), NOW()),
(@raita_id, 'Mix Raita', 'Mixed vegetable raita', 100.00, 'AVAILABLE', true, false, 3, NOW(), NOW()),
(@raita_id, 'Boondi Raita', 'Raita with boondi', 90.00, 'AVAILABLE', true, false, 4, NOW(), NOW());



