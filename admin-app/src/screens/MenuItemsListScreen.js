import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchMenuItems,
  deleteMenuItem,
  toggleMenuItem,
} from '../store/slices/menuSlice';

const MenuItemsListScreen = ({navigation, route}) => {
  const categoryId = route?.params?.categoryId;
  const dispatch = useDispatch();
  const {items, categories, isLoading} = useSelector((state) => state.menu);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    await dispatch(fetchMenuItems());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const filteredItems = categoryId
    ? items.filter((item) => item.category?.id === categoryId)
    : items;

  const getCategoryName = (item) => {
    if (item.category) return item.category.name;
    const category = categories.find((c) => c.id === item.categoryId);
    return category?.name || 'Unknown';
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMenuItem(item.id)).unwrap();
              Alert.alert('Success', 'Menu item deleted successfully');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const handleToggle = async (item) => {
    try {
      await dispatch(toggleMenuItem(item.id)).unwrap();
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toFixed(2) || '0.00'}`;
  };

  const renderItem = ({item}) => {
    const isAvailable = item.status === 'AVAILABLE';
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}
          <View style={styles.itemMeta}>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            <Text style={styles.itemCategory}>
              {getCategoryName(item)}
            </Text>
          </View>
          <View style={styles.itemMeta}>
            <Text
              style={[
                styles.statusBadge,
                isAvailable ? styles.statusActive : styles.statusInactive,
              ]}>
              {isAvailable ? 'Available' : 'Disabled'}
            </Text>
            {item.isVegetarian !== undefined && (
              <Text style={styles.vegBadge}>
                {item.isVegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditMenuItem', {item})}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isAvailable ? styles.toggleInactive : styles.toggleActive,
            ]}
            onPress={() => handleToggle(item)}>
            <Text style={styles.actionButtonText}>
              {isAvailable ? 'Disable' : 'Enable'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Menu Items</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddMenuItem')}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading && !items.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No menu items found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addButton: {
    padding: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    marginBottom: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  statusActive: {
    backgroundColor: '#4CAF50',
    color: '#FFF',
  },
  statusInactive: {
    backgroundColor: '#F44336',
    color: '#FFF',
  },
  vegBadge: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleInactive: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MenuItemsListScreen;




