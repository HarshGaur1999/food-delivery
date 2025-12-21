import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import OrdersListScreen from './src/screens/OrdersListScreen';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import CategoriesListScreen from './src/screens/CategoriesListScreen';
import MenuItemsListScreen from './src/screens/MenuItemsListScreen';
import AddEditCategoryScreen from './src/screens/AddEditCategoryScreen';
import AddEditMenuItemScreen from './src/screens/AddEditMenuItemScreen';
import DeliveryBoysScreen from './src/screens/DeliveryBoysScreen';
import ReportsScreen from './src/screens/ReportsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="OrdersList" component={OrdersListScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
          <Stack.Screen
            name="CategoriesList"
            component={CategoriesListScreen}
          />
          <Stack.Screen
            name="MenuItemsList"
            component={MenuItemsListScreen}
          />
          <Stack.Screen
            name="AddCategory"
            component={AddEditCategoryScreen}
          />
          <Stack.Screen
            name="EditCategory"
            component={AddEditCategoryScreen}
          />
          <Stack.Screen name="AddMenuItem" component={AddEditMenuItemScreen} />
          <Stack.Screen name="EditMenuItem" component={AddEditMenuItemScreen} />
          <Stack.Screen name="DeliveryBoys" component={DeliveryBoysScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;












