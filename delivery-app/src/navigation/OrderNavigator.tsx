/**
 * Order Navigator (Main App Navigator)
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '@presentation/home/HomeScreen';
import {OrderDetailsScreen} from '@presentation/orders/OrderDetailsScreen';
import {DeliveryHistoryScreen} from '@presentation/history/DeliveryHistoryScreen';
import {ProfileScreen} from '@presentation/profile/ProfileScreen';

export type OrderStackParamList = {
  Home: undefined;
  OrderDetails: {orderId: number};
  DeliveryHistory: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<OrderStackParamList>();

export const OrderNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Delivery Dashboard'}}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{title: 'Order Details'}}
      />
      <Stack.Screen
        name="DeliveryHistory"
        component={DeliveryHistoryScreen}
        options={{title: 'Delivery History'}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Stack.Navigator>
  );
};











