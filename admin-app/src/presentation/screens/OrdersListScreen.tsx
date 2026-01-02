import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {orderStore} from '@store/orderStore';
import {Order} from '@data/repositories/adminRepository';

export const OrdersListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [seenOrderIds, setSeenOrderIds] = useState<Set<number>>(new Set());
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const orders = orderStore((state: any) => state.orders);
  const isLoading = orderStore((state: any) => state.isLoading);
  const fetchOrders = orderStore((state: any) => state.fetchOrders);

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter, fetchOrders]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      fetchOrders(statusFilter);
    }, 30000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [statusFilter, fetchOrders]);

  // Mark orders as seen when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const currentOrderIds = new Set(orders.map((o: Order) => o.id));
      setSeenOrderIds(currentOrderIds);
    }, [orders]),
  );

  const isNewOrder = (order: Order): boolean => {
    return !seenOrderIds.has(order.id);
  };

  const statuses = [
    {label: 'All', value: undefined},
    {label: 'Placed', value: 'PLACED'},
    {label: 'Accepted', value: 'ACCEPTED'},
    {label: 'Preparing', value: 'PREPARING'},
    {label: 'Ready', value: 'READY'},
    {label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY'},
    {label: 'Delivered', value: 'DELIVERED'},
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
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

  const renderOrder = ({item}: {item: Order}) => {
    const isNew = isNewOrder(item);
    return (
      <TouchableOpacity
        style={[styles.orderCard, isNew && styles.newOrderCard]}
        onPress={() => {
          setSeenOrderIds(prev => new Set([...prev, item.id]));
          navigation.navigate('OrderDetails' as never, {orderId: item.id} as never);
        }}>
        {isNew && <View style={styles.newOrderIndicator} />}
        <View style={styles.orderHeader}>
          <View style={styles.flex1}>
            <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
            {isNew && <Text style={styles.newOrderBadge}>NEW</Text>}
          </View>
          <View
            style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
            <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
          </View>
        </View>
        <Text style={styles.customerName}>{item.customer.fullName || 'Customer'}</Text>
        <Text style={styles.customerMobile}>{item.customer.mobileNumber}</Text>
        <View style={styles.orderFooter}>
          <Text style={styles.amount}>₹{item.totalAmount.toFixed(2)}</Text>
          <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={statuses}
          keyExtractor={item => item.value || 'all'}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === item.value && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter(item.value)}>
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === item.value && styles.filterButtonTextActive,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {isLoading && orders.length === 0 ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => fetchOrders(statusFilter)}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
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
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B35',
  },
  filterButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  newOrderCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  newOrderIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  newOrderBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 2,
  },
  flex1: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  customerMobile: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
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
  },
});






