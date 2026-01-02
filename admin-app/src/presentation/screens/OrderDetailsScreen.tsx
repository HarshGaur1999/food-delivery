import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {orderStore} from '@store/orderStore';
import {Order, adminRepository} from '@data/repositories/adminRepository';
import MapView, {Marker, Polyline} from 'react-native-maps';

export const OrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const orderId = route.params?.orderId;

  const selectedOrder = orderStore((state: any) => state.selectedOrder);
  const isLoading = orderStore((state: any) => state.isLoading);
  const error = orderStore((state: any) => state.error);
  const fetchOrderDetail = orderStore((state: any) => state.fetchOrderDetail);
  const acceptOrder = orderStore((state: any) => state.acceptOrder);
  const rejectOrder = orderStore((state: any) => state.rejectOrder);
  const updateOrderStatus = orderStore((state: any) => state.updateOrderStatus);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState<{
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const trackingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId, fetchOrderDetail]);

  // Start/stop location tracking based on order status
  useEffect(() => {
    if (
      selectedOrder &&
      selectedOrder.deliveryBoy &&
      (selectedOrder.status === 'OUT_FOR_DELIVERY' || selectedOrder.status === 'READY')
    ) {
      setIsTrackingLocation(true);
      fetchDeliveryLocation();
      
      // Refresh location every 5 seconds
      trackingIntervalRef.current = setInterval(() => {
        fetchDeliveryLocation();
      }, 5000);
    } else {
      setIsTrackingLocation(false);
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
    }

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, [selectedOrder?.status, selectedOrder?.deliveryBoy]);

  const fetchDeliveryLocation = async () => {
    if (!orderId || !selectedOrder?.deliveryBoy) return;

    try {
      const location = await adminRepository.getDeliveryLocation(orderId);
      setDeliveryLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp,
      });
    } catch (err: any) {
      // Silently fail - location might not be available yet
      console.log('Location tracking error:', err.message);
    }
  };

  const handleAccept = async () => {
    if (!selectedOrder) return;

    if (selectedOrder.status !== 'PLACED' && selectedOrder.status !== 'PENDING_PAYMENT') {
      Alert.alert('Error', 'Only PLACED or PENDING_PAYMENT orders can be accepted');
      return;
    }

    Alert.alert('Accept Order', 'Are you sure you want to accept this order?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Accept',
        onPress: async () => {
          try {
            await acceptOrder(orderId);
            Alert.alert('Success', 'Order accepted successfully');
            navigation.goBack();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to accept order');
          }
        },
      },
    ]);
  };

  const handleReject = () => {
    if (!selectedOrder) return;

    if (selectedOrder.status !== 'PLACED' && selectedOrder.status !== 'PENDING_PAYMENT') {
      Alert.alert('Error', 'Only PLACED or PENDING_PAYMENT orders can be rejected');
      return;
    }

    setRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    try {
      await rejectOrder(orderId, rejectReason.trim());
      Alert.alert('Success', 'Order rejected successfully');
      setRejectModalVisible(false);
      setRejectReason('');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reject order');
    }
  };

  const handleStatusUpdate = () => {
    if (!selectedOrder) return;

    const validNextStatuses = getValidNextStatuses(selectedOrder.status);
    if (validNextStatuses.length === 0) {
      Alert.alert('Info', 'No valid status transitions available');
      return;
    }

    setStatusModalVisible(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedStatus) return;

    try {
      await updateOrderStatus(orderId, selectedStatus);
      Alert.alert('Success', 'Order status updated successfully');
      setStatusModalVisible(false);
      setSelectedStatus('');
      await fetchOrderDetail(orderId);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update order status');
    }
  };

  const getValidNextStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case 'ACCEPTED':
        return ['PREPARING'];
      case 'PREPARING':
        return ['READY'];
      case 'READY':
        return []; // READY status handled separately
      default:
        return [];
    }
  };

  const canAccept = (order: Order | null): boolean => {
    if (!order) return false;
    return order.status === 'PLACED' || order.status === 'PENDING_PAYMENT';
  };

  const canReject = (order: Order | null): boolean => {
    if (!order) return false;
    return order.status === 'PLACED' || order.status === 'PENDING_PAYMENT';
  };

  const canUpdateStatus = (order: Order | null): boolean => {
    if (!order) return false;
    return ['ACCEPTED', 'PREPARING'].includes(order.status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'PENDING_PAYMENT':
        return '#FF9800';
      case 'ACCEPTED':
      case 'PREPARING':
        return '#2196F3';
      case 'READY':
        return '#4CAF50';
      case 'OUT_FOR_DELIVERY':
        return '#9C27B0';
      case 'DELIVERED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#666666';
    }
  };

  const callCustomer = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  if (isLoading && !selectedOrder) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!selectedOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Order not found</Text>
      </View>
    );
  }

  const validNextStatuses = getValidNextStatuses(selectedOrder.status);

  return (
    <ScrollView style={styles.container}>
      {/* Order Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>#{selectedOrder.orderNumber}</Text>
          <View
            style={[styles.statusBadge, {backgroundColor: getStatusColor(selectedOrder.status)}]}>
            <Text style={styles.statusText}>{selectedOrder.status.replace('_', ' ')}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(selectedOrder.createdAt).toLocaleString()}
        </Text>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <TouchableOpacity
          onPress={() => callCustomer(selectedOrder.customer.mobileNumber)}
          style={styles.customerRow}>
          <View style={styles.flex1}>
            <Text style={styles.customerName}>
              {selectedOrder.customer.fullName || 'Customer'}
            </Text>
            <Text style={styles.customerPhone}>{selectedOrder.customer.mobileNumber}</Text>
          </View>
          <Text style={styles.callButton}>📞 Call</Text>
        </TouchableOpacity>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {selectedOrder.items.map((item: any) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.flex1}>
              <Text style={styles.itemName}>{item.menuItem.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Payment Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Payment Method:</Text>
          <Text style={styles.paymentValue}>{selectedOrder.paymentMethod}</Text>
        </View>
        {selectedOrder.paymentMethod === 'COD' && (
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>COD Amount:</Text>
            <Text style={styles.codAmount}>₹{selectedOrder.totalAmount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Subtotal:</Text>
          <Text style={styles.paymentValue}>₹{selectedOrder.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Delivery Charge:</Text>
          <Text style={styles.paymentValue}>₹{selectedOrder.deliveryCharge.toFixed(2)}</Text>
        </View>
        <View style={[styles.paymentRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹{selectedOrder.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.addressText}>{selectedOrder.deliveryAddress}</Text>
        {selectedOrder.deliveryLatitude && selectedOrder.deliveryLongitude && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedOrder.deliveryLatitude,
                longitude: selectedOrder.deliveryLongitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={{
                  latitude: selectedOrder.deliveryLatitude,
                  longitude: selectedOrder.deliveryLongitude,
                }}
                title="Delivery Location"
              />
            </MapView>
          </View>
        )}
      </View>

      {/* Special Instructions */}
      {selectedOrder.specialInstructions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <Text style={styles.instructionsText}>{selectedOrder.specialInstructions}</Text>
        </View>
      )}

      {/* Delivery Boy Info */}
      {selectedOrder.deliveryBoy && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Delivery Boy</Text>
          <View style={styles.deliveryBoyRow}>
            <View style={styles.flex1}>
              <Text style={styles.deliveryBoyName}>
                {selectedOrder.deliveryBoy.fullName}
              </Text>
              <Text style={styles.deliveryBoyPhone}>
                {selectedOrder.deliveryBoy.mobileNumber}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => callCustomer(selectedOrder.deliveryBoy.mobileNumber)}
              style={styles.callButtonSmall}>
              <Text style={styles.callButtonText}>📞</Text>
            </TouchableOpacity>
          </View>

          {/* Live Location Tracking */}
          {isTrackingLocation && deliveryLocation && (
            <View style={styles.trackingContainer}>
              <Text style={styles.trackingTitle}>Live Location Tracking</Text>
              <Text style={styles.trackingSubtitle}>
                Last updated: {new Date(deliveryLocation.timestamp).toLocaleTimeString()}
              </Text>
              <View style={styles.trackingMapContainer}>
                <MapView
                  style={styles.trackingMap}
                  region={{
                    latitude: deliveryLocation.latitude,
                    longitude: deliveryLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: deliveryLocation.latitude,
                      longitude: deliveryLocation.longitude,
                    }}
                    title="Delivery Boy"
                    pinColor="#FF6B35"
                  />
                  <Marker
                    coordinate={{
                      latitude: selectedOrder.deliveryLatitude,
                      longitude: selectedOrder.deliveryLongitude,
                    }}
                    title="Delivery Address"
                    pinColor="#4CAF50"
                  />
                  <Polyline
                    coordinates={[
                      {
                        latitude: deliveryLocation.latitude,
                        longitude: deliveryLocation.longitude,
                      },
                      {
                        latitude: selectedOrder.deliveryLatitude,
                        longitude: selectedOrder.deliveryLongitude,
                      },
                    ]}
                    strokeColor="#FF6B35"
                    strokeWidth={2}
                  />
                </MapView>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {canAccept(selectedOrder) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAccept}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>Accept Order</Text>
            )}
          </TouchableOpacity>
        )}

        {canReject(selectedOrder) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={handleReject}
            disabled={isLoading}>
            <Text style={styles.actionButtonText}>Reject Order</Text>
          </TouchableOpacity>
        )}

        {canUpdateStatus(selectedOrder) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.statusButton]}
            onPress={handleStatusUpdate}
            disabled={isLoading}>
            <Text style={styles.actionButtonText}>Update Status</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Reject Modal */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRejectModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Order</Text>
            <Text style={styles.modalSubtitle}>Please provide a reason for rejection</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999999"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setRejectModalVisible(false);
                  setRejectReason('');
                }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmReject}>
                <Text style={styles.modalButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            <Text style={styles.modalSubtitle}>Select new status</Text>
            {validNextStatuses.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  selectedStatus === status && styles.statusOptionSelected,
                ]}
                onPress={() => setSelectedStatus(status)}>
                <Text
                  style={[
                    styles.statusOptionText,
                    selectedStatus === status && styles.statusOptionTextSelected,
                  ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setStatusModalVisible(false);
                  setSelectedStatus('');
                }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmStatusUpdate}
                disabled={!selectedStatus}>
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
    </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666666',
  },
  callButton: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  codAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  mapContainer: {
    height: 200,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  deliveryBoyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryBoyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  deliveryBoyPhone: {
    fontSize: 14,
    color: '#666666',
  },
  callButtonSmall: {
    padding: 8,
  },
  callButtonText: {
    fontSize: 20,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  statusButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333333',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusOption: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: '#FF6B35',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  statusOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trackingContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  trackingSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  trackingMapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  trackingMap: {
    flex: 1,
  },
});
