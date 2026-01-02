import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '@presentation/screens/LoginScreen';
import {AdminOtpScreen} from '@presentation/screens/AdminOtpScreen';

const Stack = createNativeStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AdminOtp"
        component={AdminOtpScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};





