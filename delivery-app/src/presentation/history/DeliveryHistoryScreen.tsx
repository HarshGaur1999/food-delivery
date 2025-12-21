/**
 * Delivery History Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {OrderStackParamList} from '@navigation/OrderNavigator';
import {orderRepository} from '@data/repositories/orderRepository';
import {Order, OrderStatus} from '@domain/models/Order';
import {formatCurrency, formatDate, formatTime} from '@utils/format';

type Props = NativeStackScreenProps<OrderStackParamList, 'DeliveryHistory'>;

export const DeliveryHistoryScreen: React.FC<Props> = ({navigation}: Props) => {
  const {
    data: orders,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderRepository.getMyOrders(),
  });

  const deliveredOrders = orders?.filter((o: Order) => o.status === OrderStatus.DELIVERED) || [];

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetails', {orderId: order.id});
  };

  const renderOrderItem = ({item}: {item: Order}): React.ReactElement => {
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderPress(item)}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {item.deliveredAt
                ? formatDate(item.deliveredAt)
                : formatDate(item.createdAt)}
            </Text>
          </View>
          <View style={styles.orderAmountContainer}>
            <Text style={styles.orderAmount}>{formatCurrency(item.totalAmount)}</Text>
            <Text style={styles.earningsText}>
              Earnings: {formatCurrency(item.deliveryCharge || 0)}
            </Text>
          </View>
        </View>
        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Icon name="person" size={16} color="#666" />
            <Text style={styles.infoText}>{item.customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={16} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.deliveryAddress}
            </Text>
          </View>
          {item.deliveredAt && (
            <View style={styles.infoRow}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.infoText}>
                Delivered at {formatTime(item.deliveredAt)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No delivery history</Text>
            <Text style={styles.emptySubtext}>
              Completed orders will appear here
            </Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  orderAmountContainer: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  earningsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  orderInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
});

