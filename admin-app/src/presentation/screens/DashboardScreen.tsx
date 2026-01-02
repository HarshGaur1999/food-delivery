import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dashboardStore} from '@store/dashboardStore';
import {authStore} from '@store/authStore';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState('today');
  const fetchStats = dashboardStore((state: any) => state.fetchStats);
  const stats = dashboardStore((state: any) => state.stats);
  const isLoading = dashboardStore((state: any) => state.isLoading);
  const logout = authStore((state: any) => state.logout);

  useEffect(() => {
    // Check token before making API calls
    checkTokenAndFetchStats(period);
  }, [period, fetchStats]);

  const checkTokenAndFetchStats = async (periodValue: string) => {
    try {
      // Check if token exists before making admin API calls
      const token = await AsyncStorage.getItem('ADMIN_TOKEN');
      
      if (!token) {
        console.error('❌ [DashboardScreen] No token found. Redirecting to login...');
        Alert.alert(
          'Authentication Required',
          'Please login to access the dashboard',
          [
            {
              text: 'OK',
              onPress: async () => {
                await authStore.getState().logout();
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Auth'}],
                });
              },
            },
          ],
        );
        return;
      }

      console.log('✅ [DashboardScreen] Token found, fetching stats...');
      fetchStats(periodValue);
    } catch (error) {
      console.error('❌ [DashboardScreen] Error checking token:', error);
      Alert.alert('Error', 'Failed to verify authentication');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const periods = [
    {label: 'Today', value: 'today'},
    {label: 'This Week', value: 'week'},
    {label: 'Last 30 Days', value: 'month'},
    {label: 'Last 6 Months', value: '6months'},
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => checkTokenAndFetchStats(period)}
        />
      }>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.periodContainer}>
        {periods.map(p => (
          <TouchableOpacity
            key={p.value}
            style={[
              styles.periodButton,
              period === p.value && styles.periodButtonActive,
            ]}
            onPress={() => setPeriod(p.value)}>
            <Text
              style={[
                styles.periodButtonText,
                period === p.value && styles.periodButtonTextActive,
              ]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && !stats ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : stats ? (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{stats.totalRevenue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.preparingOrders}</Text>
            <Text style={styles.statLabel}>Preparing</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{stats.averageOrderValue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Avg Order Value</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.codOrders}</Text>
            <Text style={styles.statLabel}>COD Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.onlineOrders}</Text>
            <Text style={styles.statLabel}>Online Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeDeliveryBoys}</Text>
            <Text style={styles.statLabel}>Active Delivery Boys</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('OrdersList' as never)}>
          <Text style={styles.actionButtonText}>View Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CategoriesList' as never)}>
          <Text style={styles.actionButtonText}>Manage Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DeliveryBoys' as never)}>
          <Text style={styles.actionButtonText}>Delivery Boys</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Reports' as never)}>
          <Text style={styles.actionButtonText}>Reports</Text>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  logoutText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  periodContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  periodButtonText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  actionButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
});







