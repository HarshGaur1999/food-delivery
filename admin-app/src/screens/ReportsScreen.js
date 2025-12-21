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
import {fetchSalesReport} from '../store/slices/dashboardSlice';

const ReportsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {salesReport, isLoading} = useSelector((state) => state.dashboard);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [refreshing, setRefreshing] = useState(false);

  const periods = [
    {key: 'today', label: 'Today'},
    {key: 'week', label: 'This Week'},
    {key: 'month', label: 'Last 30 Days'},
    {key: '6months', label: 'Last 6 Months'},
  ];

  useEffect(() => {
    loadReport();
  }, [selectedPeriod]);

  const loadReport = async () => {
    await dispatch(fetchSalesReport(selectedPeriod));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReport();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toFixed(2) || '0.00'}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sales Report</Text>
        <View style={styles.placeholder} />
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

        {isLoading && !salesReport ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        ) : salesReport ? (
          <>
            {/* Summary Cards */}
            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {salesReport.totalOrders || 0}
                </Text>
                <Text style={styles.summaryLabel}>Total Orders</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {salesReport.deliveredOrders || 0}
                </Text>
                <Text style={styles.summaryLabel}>Delivered</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {formatCurrency(salesReport.totalRevenue)}
                </Text>
                <Text style={styles.summaryLabel}>Total Revenue</Text>
              </View>
            </View>

            {/* Payment Method Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
              {salesReport.paymentMethodCount && (
                <View style={styles.breakdownContainer}>
                  {Object.entries(salesReport.paymentMethodCount).map(
                    ([method, count]) => (
                      <View key={method} style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>{method}:</Text>
                        <Text style={styles.breakdownValue}>{count} orders</Text>
                        <Text style={styles.breakdownRevenue}>
                          {formatCurrency(
                            salesReport.paymentMethodRevenue?.[method] || 0
                          )}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </View>

            {/* Status Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Status Breakdown</Text>
              {salesReport.statusBreakdown && (
                <View style={styles.breakdownContainer}>
                  {Object.entries(salesReport.statusBreakdown).map(
                    ([status, count]) => (
                      <View key={status} style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>{status}:</Text>
                        <Text style={styles.breakdownValue}>{count} orders</Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No report data available</Text>
          </View>
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
  summarySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  summaryCard: {
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
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
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
  breakdownContainer: {
    marginTop: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  breakdownRevenue: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
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

export default ReportsScreen;












