# Icon Fix Instructions

## Problem
Icons are showing as placeholder boxes instead of proper icons.

## Solution Applied

### 1. Updated Icon Names
Changed icon names to more reliable MaterialIcons:
- `add` → `add-circle` (for add to cart button)
- `remove` → `remove-circle-outline` (for quantity decrease)
- `add` → `add-circle-outline` (for quantity increase)

### 2. Updated build.gradle
Added vector drawables support:
```gradle
vectorDrawables.useSupportLibrary = true
```

## Next Steps - REBUILD REQUIRED

### Step 1: Clean Build
```powershell
cd d:\food-delivery\ShivDhabaCustomer\android
.\gradlew clean
```

### Step 2: Rebuild App
```powershell
cd d:\food-delivery\ShivDhabaCustomer
npx react-native run-android
```

### Step 3: Verify Icons
After rebuild, icons should display correctly:
- ✅ Add to cart button shows circle with plus
- ✅ Quantity controls show circle icons
- ✅ Shopping cart icon shows properly
- ✅ Delete/remove icons show properly

## Alternative: If Icons Still Don't Show

### Option 1: Check Font Files
Ensure font files are linked:
```powershell
# Check if fonts exist
dir node_modules\react-native-vector-icons\Fonts\MaterialIcons.ttf
```

### Option 2: Manual Font Linking (if auto-linking fails)
1. Copy fonts to `android/app/src/main/assets/fonts/`:
   ```powershell
   mkdir android\app\src\main\assets\fonts -ErrorAction SilentlyContinue
   copy node_modules\react-native-vector-icons\Fonts\*.ttf android\app\src\main\assets\fonts\
   ```

2. Rebuild app

### Option 3: Use Text Icons as Fallback
If icons still don't work, we can use text-based icons as fallback:
- Use Unicode characters like ➕, ➖, 🛒
- Or use Text component with emoji

## Current Icon Usage

### MenuScreen
- Add to cart: `add-circle` icon
- Shopping cart header: `shopping-cart` icon

### CartScreen  
- Increase quantity: `add-circle-outline` icon
- Decrease quantity: `remove-circle-outline` icon
- Delete item: `delete` icon
- Back button: `arrow-back` icon

## Testing
After rebuild:
1. Open Menu screen
2. Check add to cart buttons show plus icon
3. Add item to cart
4. Go to Cart screen
5. Verify quantity controls and delete icons show properly

---

**Important:** Icons require app rebuild to work properly!

