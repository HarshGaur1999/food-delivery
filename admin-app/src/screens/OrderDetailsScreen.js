import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchOrderDetails,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  assignDeliveryBoy,
} from '../store/slices/orderSlice';
import {fetchDeliveryBoys} from '../store/slices/deliverySlice';

const OrderDetailsScreen = ({route, navigation}) => {
  const {orderId} = route.params;
  const dispatch = useDispatch();
  const {currentOrder, isLoading} = useSelector((state) => state.orders);
  const {deliveryBoys} = useSelector((state) => state.delivery);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId));
    dispatch(fetchDeliveryBoys());
  }, [orderId, dispatch]);

  const formatCurrency = (amount) => {
    return `₹${amount?.toFixed(2) || '0.00'}`;
  };

  const handleAccept = async () => {
    try {
      await dispatch(acceptOrder(orderId)).unwrap();
      Alert.alert('Success', 'Order accepted successfully');
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Please provide a rejection reason');
      return;
    }
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this order?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(
                rejectOrder({orderId, reason: rejectReason})
              ).unwrap();
              Alert.alert('Success', 'Order rejected successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const handleStatusUpdate = (newStatus) => {
    Alert.alert(
      'Update Status',
      `Change order status to ${newStatus}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Update',
          onPress: async () => {
            try {
              await dispatch(
                updateOrderStatus({orderId, status: newStatus})
              ).unwrap();
              Alert.alert('Success', 'Order status updated successfully');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const handleAssignDelivery = () => {
    const availableBoys = deliveryBoys.filter(
      (db) => db.isAvailable && db.isOnDuty
    );
    if (availableBoys.length === 0) {
      Alert.alert('Error', 'No delivery boys available');
      return;
    }

    Alert.alert(
      'Assign Delivery Boy',
      'Select a delivery boy:',
      [
        ...availableBoys.map((db) => ({
          text: `${db.name} (${db.mobile})`,
          onPress: async () => {
            try {
              await dispatch(
                assignDeliveryBoy({
                  orderId,
                  deliveryBoyId: db.userId,
                })
              ).unwrap();
              Alert.alert('Success', 'Delivery boy assigned successfully');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        })),
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  if (isLoading && !currentOrder) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!currentOrder) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Number:</Text>
            <Text style={styles.infoValue}>#{currentOrder.orderNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, {color: '#FF6B35'}]}>
              {currentOrder.status}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoValue}>{currentOrder.paymentMethod}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Amount:</Text>
            <Text style={[styles.infoValue, {fontWeight: 'bold'}]}>
              {formatCurrency(currentOrder.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{currentOrder.customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile:</Text>
            <Text style={styles.infoValue}>{currentOrder.customerMobile}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>
              {currentOrder.deliveryAddress}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {currentOrder.items?.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.menuItemName}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery Boy Info */}
        {currentOrder.deliveryBoyName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Boy</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {currentOrder.deliveryBoyName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile:</Text>
              <Text style={styles.infoValue}>
                {currentOrder.deliveryBoyMobile}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          {currentOrder.status === 'PLACED' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={handleAccept}>
                <Text style={styles.actionButtonText}>Accept Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => setShowRejectModal(true)}>
                <Text style={styles.actionButtonText}>Reject Order</Text>
              </TouchableOpacity>
            </>
          )}

          {currentOrder.status === 'ACCEPTED' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => handleStatusUpdate('PREPARING')}>
              <Text style={styles.actionButtonText}>Mark as Preparing</Text>
            </TouchableOpacity>
          )}

          {currentOrder.status === 'PREPARING' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => handleStatusUpdate('READY')}>
              <Text style={styles.actionButtonText}>Mark as Ready</Text>
            </TouchableOpacity>
          )}

          {currentOrder.status === 'READY' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={handleAssignDelivery}>
              <Text style={styles.actionButtonText}>Assign Delivery Boy</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Reject Modal */}
      {showRejectModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Order</Text>
            <Text style={styles.modalLabel}>Reason:</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleReject}>
                <Text style={styles.modalButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  placeholder: {
    width: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  actionsSection: {
    padding: 15,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetailsScreen;












