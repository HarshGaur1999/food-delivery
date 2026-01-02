/**
 * Authentication Navigator
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '@presentation/auth/LoginScreen';
import {OtpScreen} from '@presentation/auth/OtpScreen';

export type AuthStackParamList = {
  Login: undefined;
  Otp: {mobile: string};
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
    </Stack.Navigator>
  );
};











