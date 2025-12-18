import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {Marker} from 'react-native-maps';

const OrderTrackingScreen = ({navigation, route}) => {
  const {orderId} = route?.params || {};
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch order details
    // setOrder(orderData);
    setIsLoading(false);
  }, [orderId]);

  const getStatusColor = status => {
    switch (status) {
      case 'PLACED':
        return '#FFA500';
      case 'ACCEPTED':
        return '#4CAF50';
      case 'PREPARING':
        return '#2196F3';
      case 'READY':
        return '#9C27B0';
      case 'OUT_FOR_DELIVERY':
        return '#FF9800';
      case 'DELIVERED':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{width: 24}} />
      </View>

      {order && (
        <>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(order.status)},
              ]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Text style={styles.sectionContent}>{order.deliveryAddress}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Delivery</Text>
            <Text style={styles.sectionContent}>
              {order.estimatedDeliveryTime || 'Calculating...'}
            </Text>
          </View>

          {order.deliveryLatitude && order.deliveryLongitude && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: order.deliveryLatitude,
                  longitude: order.deliveryLongitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: order.deliveryLatitude,
                    longitude: order.deliveryLongitude,
                  }}
                  title="Delivery Location"
                />
              </MapView>
            </View>
          )}
        </>
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
  orderInfo: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 15,
    borderRadius: 8,
    elevation: 2,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
  },
  mapContainer: {
    height: 300,
    margin: 15,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  map: {
    flex: 1,
  },
});

export default OrderTrackingScreen;







