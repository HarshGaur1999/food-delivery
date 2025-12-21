import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchDeliveryBoys} from '../store/slices/deliverySlice';

const DeliveryBoysScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {deliveryBoys, isLoading} = useSelector((state) => state.delivery);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadDeliveryBoys();
  }, []);

  const loadDeliveryBoys = async () => {
    await dispatch(fetchDeliveryBoys());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeliveryBoys();
    setRefreshing(false);
  };

  const getStatusColor = (isAvailable, isOnDuty) => {
    if (!isOnDuty) return '#9E9E9E';
    if (isAvailable) return '#4CAF50';
    return '#FF9800';
  };

  const getStatusText = (isAvailable, isOnDuty) => {
    if (!isOnDuty) return 'OFFLINE';
    if (isAvailable) return 'AVAILABLE';
    return 'BUSY';
  };

  const renderDeliveryBoy = ({item}) => (
    <View style={styles.deliveryBoyCard}>
      <View style={styles.deliveryBoyInfo}>
        <Text style={styles.deliveryBoyName}>{item.name}</Text>
        <Text style={styles.deliveryBoyMobile}>{item.mobile}</Text>
        {item.vehicleNumber && (
          <Text style={styles.vehicleInfo}>
            Vehicle: {item.vehicleNumber} ({item.vehicleType || 'N/A'})
          </Text>
        )}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            Deliveries: {item.totalDeliveries || 0}
          </Text>
          <Text style={styles.statText}>
            Earnings: ₹{item.totalEarnings?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          {backgroundColor: getStatusColor(item.isAvailable, item.isOnDuty)},
        ]}>
        <Text style={styles.statusText}>
          {getStatusText(item.isAvailable, item.isOnDuty)}
        </Text>
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
        <Text style={styles.title}>Delivery Boys</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading && !deliveryBoys.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={deliveryBoys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeliveryBoy}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No delivery boys found</Text>
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
  placeholder: {
    width: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
  },
  deliveryBoyCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryBoyInfo: {
    flex: 1,
  },
  deliveryBoyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  deliveryBoyMobile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
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

export default DeliveryBoysScreen;












