import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const OrderDetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <Text style={styles.subtitle}>Order info will appear here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    marginTop: 8,
    color: '#777',
  },
});
