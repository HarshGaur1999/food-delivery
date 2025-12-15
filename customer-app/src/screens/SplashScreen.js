import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMenu} from '../store/slices/menuSlice';
import {loadCart} from '../store/slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {restoreSession} from '../store/slices/authSlice';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.menu);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Restore auth session
      const userStr = await AsyncStorage.getItem('user');
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (userStr && accessToken) {
        dispatch(restoreSession({
          user: JSON.parse(userStr),
          accessToken,
          refreshToken,
        }));
      }

      // Load cart from storage
      const cartStr = await AsyncStorage.getItem('@cart_items');
      if (cartStr) {
        dispatch(loadCart(JSON.parse(cartStr)));
      }

      // Fetch menu
      await dispatch(fetchMenu());

      // Navigate to Menu after 2 seconds
      setTimeout(() => {
        navigation.replace('Menu');
      }, 2000);
    } catch (error) {
      console.error('Initialization error:', error);
      navigation.replace('Menu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shiv Dhaba</Text>
      <Text style={styles.subtitle}>Food Delivery</Text>
      <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;


