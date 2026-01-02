import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {authStore} from '@store/authStore';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = authStore((state: any) => state.isAuthenticated);
  // ✅ FIX: Only check isLoading on initial mount, not on every state change
  // This prevents AppNavigator from re-rendering during OTP flow
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check initial loading state once
    const checkInitialAuth = () => {
      const currentState = authStore.getState();
      // Only show loading if app is starting AND checking auth
      // Don't show loading during OTP flow (when otpEmailOrPhone is set)
      if (!currentState.isLoading || currentState.otpEmailOrPhone) {
        setInitialLoading(false);
      } else {
        // Wait a bit for initial auth check
        setTimeout(() => {
          setInitialLoading(false);
        }, 500);
      }
    };
    checkInitialAuth();
  }, []);

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});







