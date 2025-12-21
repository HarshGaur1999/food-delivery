import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  createMenuItem,
  updateMenuItem,
  fetchCategories,
} from '../store/slices/menuSlice';

const AddEditMenuItemScreen = ({route, navigation}) => {
  const item = route?.params?.item;
  const isEdit = !!item;
  const dispatch = useDispatch();
  const {categories, isLoading} = useSelector((state) => state.menu);

  const [categoryId, setCategoryId] = useState(
    item?.categoryId || item?.category?.id || ''
  );
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price?.toString() || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [preparationTime, setPreparationTime] = useState(
    item?.preparationTimeMinutes?.toString() || ''
  );
  const [isVegetarian, setIsVegetarian] = useState(
    item?.isVegetarian !== undefined ? item.isVegetarian : true
  );
  const [displayOrder, setDisplayOrder] = useState(
    item?.displayOrder?.toString() || '0'
  );
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const selectedCategory = categories.find(
    (c) => c.id.toString() === categoryId.toString()
  );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Item name is required');
      return;
    }
    if (!categoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Valid price is required');
      return;
    }

    const itemData = {
      categoryId: parseInt(categoryId),
      name: name.trim(),
      description: description.trim() || null,
      price: parseFloat(price),
      imageUrl: imageUrl.trim() || null,
      preparationTimeMinutes: preparationTime
        ? parseInt(preparationTime)
        : null,
      isVegetarian,
      displayOrder: parseInt(displayOrder) || 0,
    };

    try {
      if (isEdit) {
        await dispatch(
          updateMenuItem({itemId: item.id, itemData})
        ).unwrap();
        Alert.alert('Success', 'Menu item updated successfully');
      } else {
        await dispatch(createMenuItem(itemData)).unwrap();
        Alert.alert('Success', 'Menu item created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEdit ? 'Edit Menu Item' : 'Add Menu Item'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategoryPicker(true)}>
            <Text
              style={[
                styles.categorySelectorText,
                !categoryId && styles.categorySelectorPlaceholder,
              ]}>
              {selectedCategory ? selectedCategory.name : 'Select Category'}
            </Text>
            <Text style={styles.categorySelectorArrow}>▼</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Price *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
          />

          <Text style={styles.label}>Preparation Time (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter preparation time"
            value={preparationTime}
            onChangeText={setPreparationTime}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Display Order</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter display order"
            value={displayOrder}
            onChangeText={setDisplayOrder}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                isVegetarian && styles.typeButtonActive,
              ]}
              onPress={() => setIsVegetarian(true)}>
              <Text
                style={[
                  styles.typeButtonText,
                  isVegetarian && styles.typeButtonTextActive,
                ]}>
                🟢 Vegetarian
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                !isVegetarian && styles.typeButtonActive,
              ]}
              onPress={() => setIsVegetarian(false)}>
              <Text
                style={[
                  styles.typeButtonText,
                  !isVegetarian && styles.typeButtonTextActive,
                ]}>
                🔴 Non-Vegetarian
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    categoryId === item.id.toString() &&
                      styles.categoryOptionSelected,
                  ]}
                  onPress={() => {
                    setCategoryId(item.id.toString());
                    setShowCategoryPicker(false);
                  }}>
                  <Text
                    style={[
                      styles.categoryOptionText,
                      categoryId === item.id.toString() &&
                        styles.categoryOptionTextSelected,
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryPicker(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categorySelectorText: {
    fontSize: 16,
    color: '#333',
  },
  categorySelectorPlaceholder: {
    color: '#999',
  },
  categorySelectorArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryOptionSelected: {
    backgroundColor: '#FFF5F2',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  categoryOptionTextSelected: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  typeButtonActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditMenuItemScreen;












