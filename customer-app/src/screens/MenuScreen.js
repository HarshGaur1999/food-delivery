import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMenu} from '../store/slices/menuSlice';
import {addToCart} from '../store/slices/cartSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MenuScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {categories, isLoading} = useSelector(state => state.menu);
  const {items: cartItems} = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderCategory = ({item: category}) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category.name}</Text>
      {category.items?.map(menuItem => (
        <TouchableOpacity
          key={menuItem.id}
          style={styles.menuItem}
          onPress={() => navigation.navigate('MenuItemDetail', {item: menuItem})}>
          {menuItem.imageUrl && (
            <Image source={{uri: menuItem.imageUrl}} style={styles.itemImage} />
          )}
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{menuItem.name}</Text>
            <Text style={styles.itemDescription} numberOfLines={2}>
              {menuItem.description}
            </Text>
            <View style={styles.itemFooter}>
              <Text style={styles.itemPrice}>₹{menuItem.price}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => dispatch(addToCart({menuItem, quantity: 1}))}>
                <Icon name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-cart" size={24} color="#FFF" />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchMenu())}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FF6B35',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MenuScreen;







