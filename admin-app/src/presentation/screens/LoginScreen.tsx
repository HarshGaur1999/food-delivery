import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {authStore} from '@store/authStore';

export const LoginScreen: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const navigation = useNavigation<any>();
  const sendAdminOtp = authStore((state: any) => state.sendAdminOtp);
  const isLoading = authStore((state: any) => state.isLoading);
  const error = authStore((state: any) => state.error);
  const clearError = authStore((state: any) => state.clearError);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearError();
    });
    return unsubscribe;
  }, [navigation, clearError]);

  const handleSendOtp = async () => {
    const trimmed = emailOrPhone.trim();
    console.log('🖥️ [LoginScreen] handleSendOtp() called with:', trimmed);
    
    if (!trimmed) {
      console.warn('⚠️ [LoginScreen] Empty email/phone entered');
      Alert.alert('Error', 'Please enter email or phone number');
      return;
    }

    // No password validation - OTP-only login
    console.log('🖥️ [LoginScreen] Calling sendAdminOtp...');
    try {
      await sendAdminOtp(trimmed);
      console.log('✅ [LoginScreen] sendAdminOtp succeeded');
      
      // CRITICAL: Navigate to OTP screen after successful OTP send
      // Use setTimeout to ensure navigation happens after state updates
      console.log('🚀 [LoginScreen] Preparing to navigate to AdminOtp screen with emailOrPhone:', trimmed);
      
      setTimeout(() => {
        try {
          console.log('🚀 [LoginScreen] Executing navigation...');
          (navigation as any).navigate('AdminOtp', {emailOrPhone: trimmed});
          console.log('✅ [LoginScreen] Navigation executed successfully');
        } catch (navError: any) {
          console.error('❌ [LoginScreen] Navigation error:', navError);
          // Try alternative navigation method
          try {
            const navigateAction = CommonActions.navigate({
              name: 'AdminOtp',
              params: {emailOrPhone: trimmed},
            });
            navigation.dispatch(navigateAction);
            console.log('✅ [LoginScreen] Navigation dispatched via CommonActions');
          } catch (dispatchError: any) {
            console.error('❌ [LoginScreen] Both navigation methods failed:', dispatchError);
            Alert.alert('Error', 'Failed to navigate. Please try again.');
          }
        }
      }, 100);
    } catch (err: any) {
      console.error('❌ [LoginScreen] sendAdminOtp failed:', err);
      console.error('❌ [LoginScreen] Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        request: err.request,
      });
      
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to send OTP';
      
      // More detailed error message for network errors
      let displayMessage = errorMessage;
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        displayMessage = `Network Error: ${errorMessage}\n\nPlease check:\n- Backend is running\n- Correct IP address\n- Same WiFi network`;
      }
      
      console.error('❌ [LoginScreen] Showing alert with message:', displayMessage);
      Alert.alert('Error', displayMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>Shiv Dhaba Admin</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email or Phone Number"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!isLoading}
            placeholderTextColor="#999999"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSendOtp}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#000000',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});
