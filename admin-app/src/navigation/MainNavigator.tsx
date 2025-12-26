import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DashboardScreen} from '@presentation/screens/DashboardScreen';
import {OrdersListScreen} from '@presentation/screens/OrdersListScreen';
import {OrderDetailsScreen} from '@presentation/screens/OrderDetailsScreen';
import {CategoriesListScreen} from '@presentation/screens/CategoriesListScreen';
import {AddEditCategoryScreen} from '@presentation/screens/AddEditCategoryScreen';
import {MenuItemsListScreen} from '@presentation/screens/MenuItemsListScreen';
import {AddEditMenuItemScreen} from '@presentation/screens/AddEditMenuItemScreen';
import {DeliveryBoysScreen} from '@presentation/screens/DeliveryBoysScreen';
import {ReportsScreen} from '@presentation/screens/ReportsScreen';

const Stack = createNativeStackNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#FF6B35'},
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'Dashboard'}}
      />
      <Stack.Screen
        name="OrdersList"
        component={OrdersListScreen}
        options={{title: 'Orders'}}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{title: 'Order Details'}}
      />
      <Stack.Screen
        name="CategoriesList"
        component={CategoriesListScreen}
        options={{title: 'Categories'}}
      />
      <Stack.Screen
        name="AddEditCategory"
        component={AddEditCategoryScreen}
        options={{title: 'Category'}}
      />
      <Stack.Screen
        name="MenuItemsList"
        component={MenuItemsListScreen}
        options={{title: 'Menu Items'}}
      />
      <Stack.Screen
        name="AddEditMenuItem"
        component={AddEditMenuItemScreen}
        options={{title: 'Menu Item'}}
      />
      <Stack.Screen
        name="DeliveryBoys"
        component={DeliveryBoysScreen}
        options={{title: 'Delivery Boys'}}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{title: 'Reports'}}
      />
    </Stack.Navigator>
  );
};



