/**
 * Home Dashboard Screen
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {OrderStackParamList} from '@navigation/OrderNavigator';
import {orderRepository} from '@data/repositories/orderRepository';
import {deliveryRepository} from '@data/repositories/deliveryRepository';
import {orderStore} from '@store/orderStore';
import {authStore} from '@store/authStore';
import {earningsStore} from '@store/earningsStore';
import {Order, OrderStatus} from '@domain/models/Order';
import {formatCurrency} from '@utils/format';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<OrderStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({navigation}: Props) => {
  const queryClient = useQueryClient();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const assignedOrder = orderStore((state: any) => state.assignedOrder);
  const setAssignedOrder = orderStore((state: any) => state.setAssignedOrder);
  const user = authStore((state: any) => state.user);
  const earnings = earningsStore((state: any) => state.earnings);

  // Fetch assigned orders
  const {
    data: myOrders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const orders = await orderRepository.getMyOrders();
      // Find active order (READY or OUT_FOR_DELIVERY)
      const activeOrder = orders.find(
        (o) => o.status === OrderStatus.READY || o.status === OrderStatus.OUT_FOR_DELIVERY,
      );
      if (activeOrder) {
        setAssignedOrder(activeOrder);
      }
      return orders;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update availability status
  const updateStatusMutation = useMutation({
    mutationFn: async (data: {isAvailable: boolean; isOnDuty: boolean}) => {
      return deliveryRepository.updateStatus(data.isAvailable, data.isOnDuty);
    },
    onSuccess: (data) => {
      setIsAvailable(data.isAvailable);
      setIsOnDuty(data.isOnDuty);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to update status');
    },
  });

  const handleToggleAvailability = () => {
    updateStatusMutation.mutate({
      isAvailable: !isAvailable,
      isOnDuty: isOnDuty,
    });
  };

  const handleToggleDuty = () => {
    updateStatusMutation.mutate({
      isAvailable: isAvailable,
      isOnDuty: !isOnDuty,
    });
  };

  const handleViewOrder = (order: Order) => {
    navigation.navigate('OrderDetails', {orderId: order.id});
  };

  const handleAcceptOrder = async (order: Order) => {
    Alert.alert(
      'Accept Order',
      `Do you want to accept order #${order.orderNumber}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const acceptedOrder = await orderRepository.acceptOrder(order.id);
              setAssignedOrder(acceptedOrder);
              queryClient.invalidateQueries({queryKey: ['myOrders']});
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to accept order');
            }
          },
        },
      ],
    );
  };

  // Calculate earnings from delivered orders
  useEffect(() => {
    if (myOrders) {
      const deliveredOrders = myOrders.filter((o) => o.status === OrderStatus.DELIVERED);
      const today = new Date().toDateString();
      const todayOrders = deliveredOrders.filter(
        (o) => o.deliveredAt && new Date(o.deliveredAt).toDateString() === today,
      );

      const todayEarnings = todayOrders.reduce((sum, o) => sum + (o.deliveryCharge || 0), 0);
      const totalEarnings = deliveredOrders.reduce(
        (sum, o) => sum + (o.deliveryCharge || 0),
        0,
      );

      earningsStore.getState().setEarnings({
        today: todayEarnings,
        total: totalEarnings,
      });
    }
  }, [myOrders]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={ordersLoading} onRefresh={refetchOrders} />
      }>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'Delivery Boy'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account-circle" size={40} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Status Toggle */}
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, isAvailable && styles.statusButtonActive]}
          onPress={handleToggleAvailability}>
          <Icon
            name={isAvailable ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={isAvailable ? '#FFFFFF' : '#666'}
          />
          <Text
            style={[
              styles.statusButtonText,
              isAvailable && styles.statusButtonTextActive,
            ]}>
            {isAvailable ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusButton, isOnDuty && styles.statusButtonActive]}
          onPress={handleToggleDuty}>
          <Icon
            name={isOnDuty ? 'work' : 'work-outline'}
            size={24}
            color={isOnDuty ? '#FFFFFF' : '#666'}
          />
          <Text
            style={[
              styles.statusButtonText,
              isOnDuty && styles.statusButtonTextActive,
            ]}>
            {isOnDuty ? 'On Duty' : 'Off Duty'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Earnings Summary */}
      <View style={styles.earningsContainer}>
        <Text style={styles.sectionTitle}>Earnings</Text>
        <View style={styles.earningsRow}>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Today</Text>
            <Text style={styles.earningsAmount}>{formatCurrency(earnings.today)}</Text>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Total</Text>
            <Text style={styles.earningsAmount}>{formatCurrency(earnings.total)}</Text>
          </View>
        </View>
      </View>

      {/* Assigned Order */}
      {assignedOrder ? (
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Current Order</Text>
            <Text style={styles.orderNumber}>#{assignedOrder.orderNumber}</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderInfoText}>
              Customer: {assignedOrder.customerName}
            </Text>
            <Text style={styles.orderInfoText}>
              Amount: {formatCurrency(assignedOrder.totalAmount)}
            </Text>
            <Text style={styles.orderInfoText}>
              Status: {assignedOrder.status.replace('_', ' ')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewOrderButton}
            onPress={() => handleViewOrder(assignedOrder)}>
            <Text style={styles.viewOrderButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noOrderCard}>
          <Icon name="inbox" size={48} color="#CCC" />
          <Text style={styles.noOrderText}>No assigned orders</Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DeliveryHistory')}>
          <Icon name="history" size={24} color="#FF6B35" />
          <Text style={styles.actionButtonText}>Delivery History</Text>
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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    gap: 8,
  },
  statusButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  earningsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  earningsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  orderCard: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderNumber: {
    fontSize: 14,
    color: '#666',
  },
  orderInfo: {
    marginBottom: 16,
  },
  orderInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  viewOrderButton: {
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noOrderCard: {
    margin: 20,
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  noOrderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

