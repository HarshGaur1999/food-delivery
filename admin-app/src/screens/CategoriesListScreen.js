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
  fetchCategories,
  deleteCategory,
  toggleCategory,
} from '../store/slices/menuSlice';

const CategoriesListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {categories, isLoading} = useSelector((state) => state.menu);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    await dispatch(fetchCategories());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const handleDelete = (category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteCategory(category.id)).unwrap();
              Alert.alert('Success', 'Category deleted successfully');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const handleToggle = async (category) => {
    try {
      await dispatch(toggleCategory(category.id)).unwrap();
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const renderCategory = ({item}) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.categoryDescription}>{item.description}</Text>
        )}
        <View style={styles.categoryMeta}>
          <Text
            style={[
              styles.statusBadge,
              item.isActive
                ? styles.statusActive
                : styles.statusInactive,
            ]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      <View style={styles.categoryActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditCategory', {category: item})}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.isActive ? styles.toggleInactive : styles.toggleActive,
          ]}
          onPress={() => handleToggle(item)}>
          <Text style={styles.actionButtonText}>
            {item.isActive ? 'Disable' : 'Enable'}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddCategory')}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading && !categories.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories found</Text>
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
  categoryCard: {
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
  categoryInfo: {
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
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
  categoryActions: {
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

export default CategoriesListScreen;




