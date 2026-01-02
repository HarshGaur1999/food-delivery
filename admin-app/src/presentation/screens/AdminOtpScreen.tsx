import React, {useState, useEffect, useRef} from 'react';
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
import {useRoute, useNavigation} from '@react-navigation/native';
import {authStore} from '@store/authStore';

export const AdminOtpScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  // Get emailOrPhone from route params
  const emailOrPhone = (route.params as any)?.emailOrPhone || '';

  useEffect(() => {
    if (!emailOrPhone) {
      Alert.alert('Error', 'Email or phone number is missing');
      navigation.goBack();
    }
  }, [emailOrPhone, navigation]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const handleOtpChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Limit to 6 digits
    if (numericValue.length <= 6) {
      setOtp(numericValue);
      setError(null);
    }
  };

  const handleVerify = async () => {
    // Validate OTP length
    if (otp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    if (!emailOrPhone) {
      Alert.alert('Error', 'Email or phone number is missing');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      console.log('🔐 [AdminOtpScreen] Verifying OTP...');
      console.log('🔐 [AdminOtpScreen] Email/Phone:', emailOrPhone);
      console.log('🔐 [AdminOtpScreen] OTP Length:', otp.length);

      // Use authStore.verifyAdminOtp which handles API call, token storage, and state update
      console.log('💾 [AdminOtpScreen] Calling authStore.verifyAdminOtp...');
      await authStore.getState().verifyAdminOtp(emailOrPhone.trim(), otp.trim());
      
      console.log('✅ [AdminOtpScreen] OTP verified and token saved successfully');
      console.log('✅ [AdminOtpScreen] isAuthenticated:', authStore.getState().isAuthenticated);
      console.log('✅ [AdminOtpScreen] User:', authStore.getState().user);

      // AppNavigator will automatically switch to Main screen when isAuthenticated becomes true
      // No manual navigation needed - the AppNavigator handles this based on auth state
      console.log('✅ [AdminOtpScreen] Authentication complete. AppNavigator will show Main screen automatically.');
    } catch (err: any) {
      console.error('❌ [AdminOtpScreen] OTP verification failed:', err);

      // Handle specific error cases
      let errorMessage = 'OTP verification failed';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Handle specific error types
      if (errorMessage.includes('Invalid') || errorMessage.includes('invalid')) {
        setError('Invalid OTP. Please check and try again.');
      } else if (errorMessage.includes('Expired') || errorMessage.includes('expired')) {
        setError('OTP has expired. Please request a new OTP.');
      } else if (errorMessage.includes('attempts') || errorMessage.includes('Attempts')) {
        setError('Maximum attempts exceeded. Please request a new OTP.');
      } else {
        setError(errorMessage);
      }

      Alert.alert('Error', errorMessage);
      
      // Clear OTP on error
      setOtp('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.heading}>Verify OTP</Text>
        <Text style={styles.subheading}>
          Enter the 6-digit OTP sent to you
        </Text>

        <View style={styles.form}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              error && styles.inputError,
            ]}
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            placeholderTextColor="#999999"
            editable={!isVerifying}
            autoFocus
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[
              styles.button,
              (isVerifying || otp.length !== 6) && styles.buttonDisabled,
            ]}
            onPress={handleVerify}
            disabled={isVerifying || otp.length !== 6}>
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Verify & Login</Text>
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
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
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
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#000000',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 4,
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 2,
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

