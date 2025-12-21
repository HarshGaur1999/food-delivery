/**
 * Order Details Screen
 * Shows order information, status management, COD handling, and navigation
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {OrderStackParamList} from '@navigation/OrderNavigator';
import {orderRepository} from '@data/repositories/orderRepository';
import {orderStore} from '@store/orderStore';
import {locationStore} from '@store/locationStore';
import {locationService} from '@services/locationService';
import {Order, OrderStatus, PaymentMethod} from '@domain/models/Order';
import {formatCurrency, formatDateTime, calculateDistance} from '@utils/format';
import {APP_CONSTANTS} from '@config/constants';

type Props = NativeStackScreenProps<OrderStackParamList, 'OrderDetails'>;

export const OrderDetailsScreen: React.FC<Props> = ({route, navigation}: Props) => {
  const {orderId} = route.params;
  const queryClient = useQueryClient();
  const [codConfirmed, setCodConfirmed] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const assignedOrder = orderStore((state: any) => state.assignedOrder);
  const updateOrderStatus = orderStore((state: any) => state.updateOrderStatus);

  // Fetch order details
  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const orders = await orderRepository.getMyOrders();
      return orders.find((o) => o.id === orderId);
    },
    enabled: !!orderId,
  });

  // Get current location
  useEffect(() => {
    locationService
      .getCurrentLocation()
      .then((loc) => {
        setCurrentLocation({latitude: loc.latitude, longitude: loc.longitude});
      })
      .catch((error) => {
        console.error('Get location error:', error);
      });
  }, []);

  // Start location tracking if order is active
  useEffect(() => {
    if (order && (order.status === OrderStatus.READY || order.status === OrderStatus.OUT_FOR_DELIVERY)) {
      locationService.startTracking(order.id);
    } else {
      locationService.stopTracking();
    }

    return () => {
      locationService.stopTracking();
    };
  }, [order?.status, order?.id]);

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      if (newStatus === 'OUT_FOR_DELIVERY') {
        return orderRepository.acceptOrder(orderId);
      } else if (newStatus === 'DELIVERED') {
        return orderRepository.deliverOrder(orderId);
      }
      throw new Error('Invalid status transition');
    },
    onSuccess: (updatedOrder: Order) => {
      updateOrderStatus(orderId, updatedOrder.status);
      queryClient.invalidateQueries({queryKey: ['order', orderId]});
      queryClient.invalidateQueries({queryKey: ['myOrders']});
      if (updatedOrder.status === 'DELIVERED') {
        Alert.alert('Success', 'Order marked as delivered');
        navigation.goBack();
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to update order status');
    },
  });

  const handleCallCustomer = () => {
    if (order?.customerMobile) {
      Linking.openURL(`tel:${order.customerMobile}`);
    }
  };

  const handleOpenMaps = () => {
    if (order?.deliveryLatitude && order?.deliveryLongitude) {
      const url = Platform.select({
        ios: `maps://app?daddr=${order.deliveryLatitude},${order.deliveryLongitude}`,
        android: `google.navigation:q=${order.deliveryLatitude},${order.deliveryLongitude}`,
      });
      if (url) {
        Linking.openURL(url).catch(() => {
          Alert.alert('Error', 'Could not open maps app');
        });
      }
    }
  };

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    if (!order) return;

    // Validate status transition
    if (order.status === OrderStatus.READY && newStatus !== OrderStatus.OUT_FOR_DELIVERY) {
      Alert.alert('Invalid Status', 'Order must be accepted first (OUT_FOR_DELIVERY)');
      return;
    }

    if (order.status === OrderStatus.OUT_FOR_DELIVERY && newStatus !== OrderStatus.DELIVERED) {
      Alert.alert('Invalid Status', 'Order must be marked as DELIVERED');
      return;
    }

    // Check COD confirmation
    if (newStatus === 'DELIVERED' && order.paymentMethod === PaymentMethod.COD) {
      if (!codConfirmed) {
        Alert.alert(
          'COD Confirmation Required',
          'Please confirm that you have collected the cash before marking as delivered.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Confirm Collection',
              onPress: () => {
                setCodConfirmed(true);
                updateStatusMutation.mutate(newStatus);
              },
            },
          ],
        );
        return;
      }
    }

    Alert.alert(
      'Confirm Status Update',
      `Change order status to ${newStatus.replace('_', ' ')}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: () => updateStatusMutation.mutate(newStatus),
        },
      ],
    );
  };

  const getNextStatus = (): OrderStatus | null => {
    if (!order) return null;
    if (order.status === OrderStatus.READY) return OrderStatus.OUT_FOR_DELIVERY;
    if (order.status === OrderStatus.OUT_FOR_DELIVERY) return OrderStatus.DELIVERED;
    return null;
  };

  const getStatusButtonText = (): string => {
    const nextStatus = getNextStatus();
    if (nextStatus === OrderStatus.OUT_FOR_DELIVERY) return 'Accept & Start Delivery';
    if (nextStatus === OrderStatus.DELIVERED) return 'Mark as Delivered';
    return 'Order Completed';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const distance = currentLocation && order.deliveryLatitude && order.deliveryLongitude
    ? calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        order.deliveryLatitude,
        order.deliveryLongitude,
      )
    : null;

  const nextStatus = getNextStatus();

  return (
    <ScrollView style={styles.container}>
      {/* Order Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <Text style={styles.statusText}>
            Status: {order.status.replace('_', ' ')}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{order.status}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoRow}>
          <Icon name="person" size={20} color="#666" />
          <Text style={styles.infoText}>{order.customerName}</Text>
        </View>
        <TouchableOpacity style={styles.infoRow} onPress={handleCallCustomer}>
          <Icon name="phone" size={20} color="#FF6B35" />
          <Text style={[styles.infoText, styles.linkText]}>
            {order.customerMobile}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.addressText}>{order.deliveryAddress}</Text>
        {distance && (
          <Text style={styles.distanceText}>Distance: {distance.toFixed(2)} km</Text>
        )}
        {order.deliveryLatitude && order.deliveryLongitude && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: order.deliveryLatitude!,
                longitude: order.deliveryLongitude!,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <MapView.Marker
                coordinate={{
                  latitude: order.deliveryLatitude!,
                  longitude: order.deliveryLongitude!,
                }}
                title="Delivery Address"
              />
              {currentLocation && (
                <MapView.Marker
                  coordinate={currentLocation}
                  title="Your Location"
                  pinColor="#FF6B35"
                />
              )}
            </MapView>
          </View>
        )}
        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMaps}>
          <Icon name="directions" size={20} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Method:</Text>
          <Text style={styles.paymentValue}>{order.paymentMethod}</Text>
        </View>
        {order.paymentMethod === PaymentMethod.COD && (
          <View style={styles.codWarning}>
            <Icon name="warning" size={20} color="#FF6B35" />
            <Text style={styles.codWarningText}>
              COD Amount: {formatCurrency(order.totalAmount)}
            </Text>
          </View>
        )}
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item: any) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.menuItemName} x {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.subtotal)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(order.totalAmount)}</Text>
        </View>
      </View>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <Text style={styles.instructionsText}>{order.specialInstructions}</Text>
        </View>
      )}

      {/* Status Update Button */}
      {nextStatus && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              updateStatusMutation.isPending && styles.statusButtonDisabled,
            ]}
            onPress={() => handleStatusUpdate(nextStatus)}
            disabled={updateStatusMutation.isPending}>
            {updateStatusMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.statusButtonText}>{getStatusButtonText()}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  codWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  codWarningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#DDD',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  actionContainer: {
    padding: 20,
  },
  statusButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonDisabled: {
    opacity: 0.6,
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

