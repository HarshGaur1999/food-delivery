import React, {useEffect, useRef} from 'react';
import {StatusBar, Platform, AppState, Alert} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AppNavigator} from '@navigation/AppNavigator';
import {authStore} from '@store/authStore';
import {orderStore} from '@store/orderStore';
import {API_CONFIG} from '@config/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  const checkAuth = authStore((state: any) => state.checkAuth);
  const fetchOrders = orderStore((state: any) => state.fetchOrders);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log('🚀 [App] Starting Admin App...');
    console.log('🔧 [App] API Configuration:', {
      BASE_URL: API_CONFIG.BASE_URL,
      TIMEOUT: API_CONFIG.TIMEOUT,
      IS_DEV: __DEV__,
      PLATFORM: Platform.OS,
    });
    console.log('🔧 [App] For physical devices, ensure BASE_URL matches your computer IP');
    
    // Check authentication status (does not call admin APIs)
    // Only check if not in OTP flow (to prevent interference)
    const currentState = authStore.getState();
    if (!currentState.otpEmailOrPhone) {
      checkAuth();
    } else {
      console.log('⚠️ [App] Skipping checkAuth - OTP flow in progress');
    }

    // Setup notification listener
    // Note: For full FCM integration, you need to:
    // 1. Install @react-native-firebase/messaging
    // 2. Configure Firebase in android/app/google-services.json
    // 3. Request notification permissions
    // 4. Get FCM token and send to backend
    // 5. Handle foreground/background messages
    
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Only refresh orders if authenticated (token exists)
        const isAuthenticated = authStore.getState().isAuthenticated;
        if (isAuthenticated) {
          console.log('🔄 [App] App came to foreground, refreshing orders...');
          fetchOrders();
        } else {
          console.log('⚠️ [App] App came to foreground but not authenticated, skipping order fetch');
        }
      }
      appState.current = nextAppState;
    });

    // Poll for new orders every 30 seconds when app is active AND authenticated
    const pollInterval = setInterval(() => {
      if (AppState.currentState === 'active') {
        const isAuthenticated = authStore.getState().isAuthenticated;
        if (isAuthenticated) {
          fetchOrders();
        }
      }
    }, 30000);

    return () => {
      subscription.remove();
      clearInterval(pollInterval);
    };
  }, [checkAuth, fetchOrders]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#FF6B35"
      />
      <AppNavigator />
    </QueryClientProvider>
  );
};

export default App;






