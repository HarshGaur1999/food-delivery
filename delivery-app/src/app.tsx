/**
 * Main App Component
 */

import React, {useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AppNavigator} from '@navigation/AppNavigator';
import {authStore} from '@store/authStore';
import {fcmService} from '@services/fcmService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  const checkAuth = authStore((state: any) => state.checkAuth);

  useEffect(() => {
    // Check authentication state on app launch
    checkAuth();

    // Initialize FCM
    fcmService.initialize().catch((error) => {
      console.error('FCM initialization error:', error);
    });

    // Cleanup on unmount
    return () => {
      fcmService.cleanup();
    };
  }, [checkAuth]);

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

