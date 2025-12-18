import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {placeOrder} from '../store/slices/orderSlice';
import {clearCart} from '../store/slices/cartSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CheckoutScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {items, total} = useSelector(state => state.cart);
  const {isAuthenticated} = useSelector(state => state.auth);
  const {isLoading} = useSelector(state => state.order || {isLoading: false});

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter delivery address');
      return;
    }

    // Validate Meerut city (basic check)
    if (!deliveryAddress.toLowerCase().includes('meerut')) {
      Alert.alert('Error', 'Delivery is only available in Meerut');
      return;
    }

    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to place order', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Login', onPress: () => navigation.navigate('Login')},
      ]);
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        paymentMethod,
        deliveryAddress,
        deliveryLatitude: 28.9845, // Meerut coordinates - should get from location
        deliveryLongitude: 77.7064,
        deliveryCity: 'Meerut',
        specialInstructions,
      };

      // Place order logic here
      Alert.alert('Success', 'Order placed successfully');
      dispatch(clearCart());
      navigation.replace('OrderTracking');
    } catch (error) {
      Alert.alert('Error', 'Failed to place order');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address in Meerut"
            multiline
            numberOfLines={4}
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'COD' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('COD')}>
            <Text style={styles.paymentOptionText}>Cash on Delivery (COD)</Text>
            {paymentMethod === 'COD' && (
              <Icon name="check-circle" size={24} color="#FF6B35" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'ONLINE' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('ONLINE')}>
            <Text style={styles.paymentOptionText}>Online Payment</Text>
            {paymentMethod === 'ONLINE' && (
              <Icon name="check-circle" size={24} color="#FF6B35" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Any special instructions..."
            multiline
            numberOfLines={3}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charge</Text>
            <Text style={styles.summaryValue}>₹50.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{(total + 50).toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    padding: 15,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
  },
  summary: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  placeOrderButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  placeOrderButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;







