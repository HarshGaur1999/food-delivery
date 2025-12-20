import React, {useEffect, useRef, useState, useMemo, useCallback, memo} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Animated,
  Dimensions,
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMenu} from '../store/slices/menuSlice';
import {addToCart, updateQuantity, removeFromCart} from '../store/slices/cartSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// LayoutAnimation preset for smooth quantity changes
const quantityChangeAnimation = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

// Helper function for category icons (moved outside component for stability)
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('paratha') || name.includes('chapati')) return '🫓';
  if (name.includes('rice')) return '🍚';
  if (name.includes('beverage') || name.includes('drink')) return '☕';
  if (name.includes('sabji') || name.includes('curry')) return '🍛';
  if (name.includes('salad')) return '🥗';
  if (name.includes('raita')) return '🥣';
  if (name.includes('snack')) return '🍞';
  return '🍽️';
};

/**
 * OPTIMIZED MenuItem Component
 * 
 * Performance optimizations:
 * 1. React.memo with shallow comparison - only re-renders when quantity or item data changes
 * 2. Stable handlers passed from parent (useCallback)
 * 3. LayoutAnimation for smooth quantity transitions (no re-render needed)
 * 4. Uses item.id as key for React reconciliation
 * 
 * Why this works:
 * - When cart changes, only the affected item's quantity prop changes
 * - Other items keep same props, so React.memo prevents re-render
 * - LayoutAnimation handles visual updates without component re-render
 */
const MenuItem = memo(({item, quantity = 0, onQuantityChange, onItemPress, index}) => {
  // Animation refs for initial render only (not recreated on re-render)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Animate only on mount (initial render)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, []); // Empty deps: only run on mount

  // Handler for quantity changes
  // Uses LayoutAnimation for smooth transitions
  const handleQuantityChange = useCallback(
    (e, change) => {
      e.stopPropagation();
      // Trigger LayoutAnimation for smooth quantity update
      LayoutAnimation.configureNext(quantityChangeAnimation);
      onQuantityChange(item.id, quantity + change);
    },
    [item.id, quantity, onQuantityChange],
  );

  // Handler for add button
  const handleAdd = useCallback(
    (e) => {
      e.stopPropagation();
      LayoutAnimation.configureNext(quantityChangeAnimation);
      onQuantityChange(item.id, 1);
    },
    [item.id, onQuantityChange],
  );

  return (
    <Animated.View
      style={[
        styles.menuItemContainer,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}, {scale: scaleAnim}],
        },
      ]}>
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.8}
        onPress={() => onItemPress(item)}>
        <View style={styles.menuItemContent}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.description && (
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <View style={styles.itemFooter}>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              {quantity > 0 ? (
                <View style={styles.quantityButtonContainer}>
                  <TouchableOpacity
                    style={styles.quantityButtonMinus}
                    activeOpacity={0.8}
                    onPress={(e) => handleQuantityChange(e, -1)}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButtonPlus}
                    activeOpacity={0.8}
                    onPress={(e) => handleQuantityChange(e, 1)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButtonOutlined}
                  activeOpacity={0.8}
                  onPress={handleAdd}>
                  <Text style={styles.addButtonText}>ADD</Text>
                  <Icon name="add" size={18} color="#4CAF50" style={styles.addIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  /**
   * OPTIMIZED: Shallow comparison for React.memo
   * 
   * Only re-render if:
   * 1. Item ID changed (different item)
   * 2. Quantity changed (cart update)
   * 3. Item data changed (name, price, description)
   * 
   * Handlers (onQuantityChange, onItemPress) are stable from useCallback,
   * so they won't trigger re-renders.
   * 
   * This ensures only the clicked item re-renders, not the entire list.
   */
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.item.description === nextProps.item.description &&
    prevProps.quantity === nextProps.quantity
    // Note: index and handlers are not compared - they're stable
  );
});

MenuItem.displayName = 'MenuItem';

/**
 * OPTIMIZED CategoryItem Component
 * 
 * CRITICAL: Defined OUTSIDE MenuScreen to prevent recreation on parent re-render
 * 
 * Performance optimizations:
 * 1. React.memo prevents re-render when props unchanged
 * 2. Only re-renders when items in THIS category change
 * 3. Receives cartQuantityMap for O(1) quantity lookups
 * 
 * Why this works:
 * - Component is stable (not recreated on parent re-render)
 * - When item in Category A changes, Category B doesn't re-render
 * - Custom comparison checks only this category's items
 */
const CategoryItem = memo(({category, cartQuantityMap, onQuantityChange, onItemPress, index}) => {
  const categoryFadeAnim = useRef(new Animated.Value(0)).current;
  const categorySlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(categoryFadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(categorySlideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // Only on mount

  return (
    <Animated.View
      style={[
        styles.categoryContainer,
        {
          opacity: categoryFadeAnim,
          transform: [{translateY: categorySlideAnim}],
        },
      ]}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryIcon}>{getCategoryIcon(category.name)}</Text>
        <Text style={styles.categoryTitle}>{category.name}</Text>
      </View>
      {Array.isArray(category.items) && category.items
        .filter(menuItem => menuItem && menuItem.id)
        .map((menuItem, itemIndex) => (
          <MenuItem
            key={menuItem.id}
            item={menuItem}
            quantity={cartQuantityMap[menuItem.id] || 0}
            onQuantityChange={onQuantityChange}
            onItemPress={onItemPress}
            index={itemIndex}
          />
        ))}
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  /**
   * OPTIMIZED: Fast comparison for CategoryItem memo
   * 
   * Only checks:
   * 1. Category ID (different category = re-render)
   * 2. Category name (category renamed = re-render)
   * 3. Items count (items added/removed = re-render)
   * 4. Quantities for items in THIS category only
   * 
   * Why this is fast:
   * - Only checks items in this specific category
   * - O(n) where n = items in category (not all items)
   * - Skips deep comparison of item data (MenuItem handles that)
   * 
   * Result: Category only re-renders when its own items change
   */
  if (prevProps.category.id !== nextProps.category.id) return false;
  if (prevProps.category.name !== nextProps.category.name) return false;
  
  const prevItems = prevProps.category.items || [];
  const nextItems = nextProps.category.items || [];
  if (prevItems.length !== nextItems.length) return false;
  
  // Quick check: only verify quantities for items in this category
  // MenuItem component handles its own memoization for item data changes
  for (let i = 0; i < prevItems.length; i++) {
    const itemId = prevItems[i]?.id;
    if (itemId) {
      const prevQty = prevProps.cartQuantityMap[itemId] || 0;
      const nextQty = nextProps.cartQuantityMap[itemId] || 0;
      if (prevQty !== nextQty) {
        return false; // Quantity changed in this category
      }
    }
  }
  
  return true; // No changes, skip re-render
});

CategoryItem.displayName = 'CategoryItem';

const MenuScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {categories, isLoading, error} = useSelector(state => state.menu);
  const {items: cartItems} = useSelector(state => state.cart);
  const {user} = useSelector(state => state.auth);
  const cartAnimation = useRef(new Animated.Value(1)).current;
  const cartScale = useRef(new Animated.Value(1)).current;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log('Menu Error:', error);
    }
    if (categories && categories.length > 0) {
      console.log('Menu Categories loaded:', categories.length);
      console.log('Total items:', categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0));
    }
  }, [error, categories]);

  /**
   * OPTIMIZATION: Convert cart array to quantity map (id -> quantity)
   * 
   * Why: O(1) lookup instead of O(n) array.find()
   * This prevents re-scanning the entire cart array for each menu item.
   * 
   * CRITICAL: This map is used as extraData for FlatList.
   * The object reference only changes when cartItems array changes,
   * which prevents unnecessary FlatList re-renders.
   */
  const cartQuantityMap = useMemo(() => {
    const map = {};
    cartItems.forEach(item => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  /**
   * OPTIMIZATION: Memoized cart item count
   * Only recalculates when cartQuantityMap changes
   */
  const cartItemCount = useMemo(() => {
    return Object.values(cartQuantityMap).reduce((sum, qty) => sum + qty, 0);
  }, [cartQuantityMap]);

  // Animate cart icon when item count changes
  useEffect(() => {
    if (cartItemCount > 0) {
      Animated.sequence([
        Animated.timing(cartScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cartScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartItemCount, cartScale]);

  // Animate badge when it appears
  useEffect(() => {
    if (cartItemCount > 0) {
      Animated.spring(cartAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [cartItemCount, cartAnimation]);

  /**
   * OPTIMIZATION: useCallback for quantity change handler
   * 
   * CRITICAL FIX: Use refs to avoid dependencies
   * 
   * Why: 
   * - cartQuantityMap changes on every cart update, causing handler recreation
   * - Handler recreation causes all MenuItems to re-render (new function reference)
   * - Using refs allows us to access latest values without adding dependencies
   * 
   * Result: Handler reference stays stable, only affected item re-renders
   */
  const categoriesRef = useRef(categories);
  const cartQuantityMapRef = useRef(cartQuantityMap);
  
  useEffect(() => {
    categoriesRef.current = categories;
    cartQuantityMapRef.current = cartQuantityMap;
  }, [categories, cartQuantityMap]);

  const handleQuantityChange = useCallback(
    (itemId, newQuantity) => {
      // Use LayoutAnimation for smooth transition
      LayoutAnimation.configureNext(quantityChangeAnimation);
      
      if (newQuantity <= 0) {
        dispatch(removeFromCart(itemId));
      } else {
        // Access current values via refs (always latest, no dependency needed)
        const currentQuantityMap = cartQuantityMapRef.current;
        const existingQuantity = currentQuantityMap[itemId] || 0;
        
        if (existingQuantity === 0) {
          // Item not in cart, find it from categories and add
          const currentCategories = categoriesRef.current;
          let menuItem = null;
          if (currentCategories && Array.isArray(currentCategories)) {
            for (const category of currentCategories) {
              if (category && Array.isArray(category.items)) {
                menuItem = category.items.find(item => item && item.id === itemId);
                if (menuItem) break;
              }
            }
          }
          if (menuItem) {
            dispatch(addToCart({menuItem, quantity: 1}));
          }
        } else {
          // Update existing quantity
          dispatch(updateQuantity({itemId, quantity: newQuantity}));
        }
      }
    },
    [dispatch], // Only dispatch - handler stays stable!
  );

  /**
   * OPTIMIZATION: useCallback for item press handler
   * Stable reference prevents MenuItem re-renders
   */
  const handleItemPress = useCallback(
    (item) => {
      navigation.navigate('MenuItemDetail', {item});
    },
    [navigation],
  );

  /**
   * OPTIMIZATION: useCallback for renderCategory
   * 
   * Note: cartQuantityMap is a dependency, but it's memoized so reference
   * only changes when cartItems actually changes. This is correct behavior.
   * 
   * The key is that CategoryItem's memo comparison ensures only categories
   * with changed quantities re-render, not all categories.
   */
  const renderCategory = useCallback(
    ({item: category, index}) => (
      <CategoryItem
        category={category}
        cartQuantityMap={cartQuantityMap}
        onQuantityChange={handleQuantityChange}
        onItemPress={handleItemPress}
        index={index}
      />
    ),
    [cartQuantityMap, handleQuantityChange, handleItemPress],
  );

  /**
   * OPTIMIZATION: Stable keyExtractor
   * Uses item.id (not index) for proper React reconciliation
   * 
   * Safety: Falls back to index if id is missing (shouldn't happen in production)
   */
  const keyExtractor = useCallback((item, index) => {
    return item?.id != null ? item.id.toString() : `category-${index}`;
  }, []);

  // Get user initial for profile avatar
  const getUserInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.mobileNumber) {
      return user.mobileNumber.charAt(user.mobileNumber.length - 1);
    }
    return 'U';
  };

  /**
   * OPTIMIZATION: Memoized filtered categories
   * Only recalculates when categories or searchQuery changes
   * 
   * IMPORTANT: Always returns an array to prevent FlatList errors
   */
  const filteredCategories = useMemo(() => {
    // Ensure categories is always an array (default to empty array)
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    
    if (!searchQuery) {
      return categories;
    }
    
    return categories
      .map(category => ({
        ...category,
        items: category.items?.filter(
          item =>
            item &&
            item.name &&
            (
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            ),
        ) || [],
      }))
      .filter(category => category.items && Array.isArray(category.items) && category.items.length > 0);
  }, [categories, searchQuery]);

  /**
   * OPTIMIZATION: extraData for FlatList
   * 
   * CRITICAL: Use a stable identifier that only changes when cart actually changes
   * 
   * Why this works better than object reference:
   * - Object reference comparison can be unreliable
   * - Using a hash/count ensures FlatList only updates when cart changes
   * - CategoryItem's memo comparison handles which specific items need updates
   * 
   * Result: FlatList knows when to check for updates, but CategoryItem memo
   * prevents unnecessary re-renders of unchanged categories
   */
  const extraData = useMemo(() => {
    // Create a stable hash from cart quantities
    // Only changes when cart actually changes (memoized cartQuantityMap)
    return Object.keys(cartQuantityMap).length + '-' + 
           Object.values(cartQuantityMap).reduce((sum, qty) => sum + qty, 0);
  }, [cartQuantityMap]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>SHIV DHABA</Text>
            <Text style={styles.headerSubtitle}>Delicious Food Menu</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Profile')}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>{getUserInitial()}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cartButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Cart')}>
              <Animated.View style={{transform: [{scale: cartScale}]}}>
                <View style={styles.cartIconContainer}>
                  <Icon name="shopping-cart" size={24} color="#FFF" />
                </View>
              </Animated.View>
              {cartItemCount > 0 && (
                <Animated.View
                  style={[
                    styles.cartBadge,
                    {
                      transform: [{scale: cartAnimation}],
                    },
                  ]}>
                  <Text style={styles.cartBadgeText}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </Animated.View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredCategories || []}
        renderItem={renderCategory}
        keyExtractor={keyExtractor}
        extraData={extraData}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchMenu())}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Icon name="restaurant-menu" size={64} color="#FF6B35" />
                <Text style={styles.emptyText}>Loading delicious menu...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={64} color="#FF6B35" />
                <Text style={styles.errorText}>Error loading menu</Text>
                <Text style={styles.errorDetail}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  activeOpacity={0.8}
                  onPress={() => dispatch(fetchMenu())}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="restaurant-menu" size={64} color="#CCC" />
                <Text style={styles.emptyText}>No menu items available</Text>
                <Text style={styles.emptySubtext}>
                  Please add menu items to the database via Admin panel
                </Text>
              </View>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FF6B35',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginHorizontal: 20,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
  },
  cartIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF0000',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  categoryContainer: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  menuItemContainer: {
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuItemContent: {
    flexDirection: 'row',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  addButtonOutlined: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F8F4',
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  addIcon: {
    marginLeft: 2,
  },
  quantityButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButtonMinus: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonPlus: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    minHeight: 400,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 20,
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuScreen;
