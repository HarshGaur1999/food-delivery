import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {deliveryStore} from '@store/deliveryStore';
import {DeliveryBoy} from '@data/repositories/adminRepository';
import {orderStore} from '@store/orderStore';

export const DeliveryBoysScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedBoyId, setSelectedBoyId] = useState<number | null>(null);

  const deliveryBoys = deliveryStore((state: any) => state.deliveryBoys);
  const isLoading = deliveryStore((state: any) => state.isLoading);
  const fetchDeliveryBoys = deliveryStore((state: any) => state.fetchDeliveryBoys);
  const orders = orderStore((state: any) => state.orders);
  const fetchOrders = orderStore((state: any) => state.fetchOrders);

  useEffect(() => {
    fetchDeliveryBoys();
    fetchOrders();
  }, [fetchDeliveryBoys, fetchOrders]);

  const getDeliveryBoyStatus = (boy: DeliveryBoy): string => {
    if (!boy.isOnDuty) {
      return 'OFFLINE';
    }
    if (boy.isAvailable) {
      return 'AVAILABLE';
    }
    return 'BUSY';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return '#4CAF50';
      case 'BUSY':
        return '#FF9800';
      case 'OFFLINE':
        return '#9E9E9E';
      default:
        return '#666666';
    }
  };

  const getAssignedOrdersCount = (boyId: number): number => {
    return orders.filter(
      (order: any) =>
        order.deliveryBoy &&
        order.deliveryBoy.id === boyId &&
        order.status !== 'DELIVERED' &&
        order.status !== 'CANCELLED',
    ).length;
  };

  const renderDeliveryBoy = ({item}: {item: DeliveryBoy}) => {
    const status = getDeliveryBoyStatus(item);
    const assignedOrders = getAssignedOrdersCount(item.userId);

    return (
      <View style={styles.boyCard}>
        <View style={styles.boyHeader}>
          <View style={styles.flex1}>
            <Text style={styles.boyName}>{item.name}</Text>
            <Text style={styles.boyPhone}>{item.mobile}</Text>
          </View>
          <View
            style={[styles.statusBadge, {backgroundColor: getStatusColor(status)}]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.boyDetails}>
          {item.vehicleNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vehicle:</Text>
              <Text style={styles.detailValue}>
                {item.vehicleNumber} {item.vehicleType ? `(${item.vehicleType})` : ''}
              </Text>
            </View>
          )}
          {item.licenseNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>License:</Text>
              <Text style={styles.detailValue}>{item.licenseNumber}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Deliveries:</Text>
            <Text style={styles.detailValue}>{item.totalDeliveries}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Earnings:</Text>
            <Text style={styles.detailValue}>₹{item.totalEarnings.toFixed(2)}</Text>
          </View>
          {assignedOrders > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Active Orders:</Text>
              <Text style={[styles.detailValue, styles.activeOrders]}>
                {assignedOrders}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.viewOrdersButton}
          onPress={() => {
            // Filter orders for this delivery boy
            const boyOrders = orders.filter(
              (order: any) => order.deliveryBoy && order.deliveryBoy.id === item.userId,
            );
            if (boyOrders.length > 0) {
              navigation.navigate('OrdersList' as never, {
                deliveryBoyId: item.userId,
              } as never);
            } else {
              // Show message that no orders assigned
            }
          }}>
          <Text style={styles.viewOrdersButtonText}>
            {assignedOrders > 0 ? `View ${assignedOrders} Active Order(s)` : 'View Orders'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && deliveryBoys.length === 0 ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : deliveryBoys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No delivery boys found</Text>
        </View>
      ) : (
        <FlatList
          data={deliveryBoys}
          renderItem={renderDeliveryBoy}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchDeliveryBoys} />
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
  },
  listContent: {
    padding: 16,
  },
  boyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  boyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  boyPhone: {
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  boyDetails: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  activeOrders: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  viewOrdersButton: {
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewOrdersButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
