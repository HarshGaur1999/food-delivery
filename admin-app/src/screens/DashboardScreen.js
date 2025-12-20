import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/slices/authSlice';
import {fetchDashboardStats} from '../store/slices/dashboardSlice';

const DashboardScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {stats, isLoading} = useSelector((state) => state.dashboard);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [refreshing, setRefreshing] = useState(false);

  const periods = [
    {key: 'today', label: 'Today'},
    {key: 'week', label: 'This Week'},
    {key: 'month', label: 'Last 30 Days'},
    {key: '6months', label: 'Last 6 Months'},
  ];

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    await dispatch(fetchDashboardStats(selectedPeriod));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toFixed(2) || '0.00'}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Period Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.filterButton,
                  selectedPeriod === period.key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.key)}>
                <Text
                  style={[
                    styles.filterText,
                    selectedPeriod === period.key && styles.filterTextActive,
                  ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {isLoading && !stats ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        ) : (
          <>
            {/* Stats Cards */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.totalOrders || 0}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatCurrency(stats?.totalRevenue)}
                </Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatCurrency(stats?.averageOrderValue)}
                </Text>
                <Text style={styles.statLabel}>Avg Order Value</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.codOrders || 0}</Text>
                <Text style={styles.statLabel}>COD Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats?.onlineOrders || 0}
                </Text>
                <Text style={styles.statLabel}>Online Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats?.pendingOrders || 0}
                </Text>
                <Text style={styles.statLabel}>Pending Orders</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionGrid}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('OrdersList')}>
                  <Text style={styles.actionButtonText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('CategoriesList')}>
                  <Text style={styles.actionButtonText}>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('DeliveryBoys')}>
                  <Text style={styles.actionButtonText}>Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('Reports')}>
                  <Text style={styles.actionButtonText}>Reports</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FF6B35',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  loadingContainer: {
    padding: 50,
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    marginRight: '2%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    marginRight: '2%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;




