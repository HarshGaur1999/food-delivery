import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {menuStore} from '@store/menuStore';
import {MenuItem} from '@data/repositories/adminRepository';

export const MenuItemsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [groupedItems, setGroupedItems] = useState<Record<string, MenuItem[]>>({});

  const items = menuStore((state: any) => state.items);
  const isLoading = menuStore((state: any) => state.isLoading);
  const fetchItems = menuStore((state: any) => state.fetchItems);
  const toggleItem = menuStore((state: any) => state.toggleItem);
  const deleteItem = menuStore((state: any) => state.deleteItem);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    // Group items by category
    const grouped: Record<string, MenuItem[]> = {};
    items.forEach((item: MenuItem) => {
      const categoryName = item.category.name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(item);
    });
    setGroupedItems(grouped);
  }, [items]);

  const handleToggle = async (itemId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'DISCONTINUED' : 'AVAILABLE';
    Alert.alert(
      newStatus === 'AVAILABLE' ? 'Enable Item' : 'Disable Item',
      `Are you sure you want to ${newStatus === 'AVAILABLE' ? 'enable' : 'disable'} this item?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await toggleItem(itemId);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to update item status');
            }
          },
        },
      ],
    );
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.id);
              Alert.alert('Success', 'Menu item deleted successfully');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete item');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({item}: {item: MenuItem}) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.flex1}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category.name}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              item.status === 'AVAILABLE' ? styles.statusEnabled : styles.statusDisabled,
            ]}>
            {item.status === 'AVAILABLE' ? 'ENABLED' : 'DISABLED'}
          </Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.itemFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
          {item.discountPrice && (
            <Text style={styles.discountPrice}>₹{item.discountPrice.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>
            {item.status === 'AVAILABLE' ? 'Enabled' : 'Disabled'}
          </Text>
          <Switch
            value={item.status === 'AVAILABLE'}
            onValueChange={() => handleToggle(item.id, item.status)}
            trackColor={{false: '#E0E0E0', true: '#4CAF50'}}
            thumbColor={item.status === 'AVAILABLE' ? '#FFFFFF' : '#F44336'}
          />
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('AddEditMenuItem' as never, {itemId: item.id} as never)}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategorySection = (categoryName: string, categoryItems: MenuItem[]) => (
    <View key={categoryName} style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <FlatList
        data={categoryItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );

  const categoryNames = Object.keys(groupedItems).sort();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditMenuItem' as never, {} as never)}>
          <Text style={styles.addButtonText}>+ Add Food Item</Text>
        </TouchableOpacity>
      </View>

      {isLoading && items.length === 0 ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : categoryNames.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No menu items found</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddEditMenuItem' as never, {} as never)}>
            <Text style={styles.emptyButtonText}>Add First Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categoryNames}
          renderItem={({item: categoryName}) =>
            renderCategorySection(categoryName, groupedItems[categoryName])
          }
          keyExtractor={categoryName => categoryName}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchItems} />
          }
          contentContainerStyle={styles.listContent}
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  flex1: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#999999',
    textTransform: 'uppercase',
  },
  statusContainer: {
    marginLeft: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusEnabled: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  statusDisabled: {
    backgroundColor: '#FFEBEE',
    color: '#F44336',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  discountPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#666666',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
});
