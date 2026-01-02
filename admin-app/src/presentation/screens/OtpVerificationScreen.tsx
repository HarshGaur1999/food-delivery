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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authRepository, AuthResponse} from '@data/repositories/authRepository';

export const OtpVerificationScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const emailOrPhone = (route.params as any)?.emailOrPhone || '';

  useEffect(() => {
    if (!emailOrPhone) {
      Alert.alert('Error', 'Email or phone number is missing');
      navigation.goBack();
    }
  }, [emailOrPhone, navigation]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus next empty or last input
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      return;
    }

    if (!/^\d$/.test(value) && value !== '') {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter complete 6-digit OTP');
      return;
    }

    if (!emailOrPhone) {
      Alert.alert('Error', 'Email or phone number is missing');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      console.log('🔐 [OtpVerificationScreen] Verifying OTP...');
      
      // Call API to verify OTP
      const response: AuthResponse = await authRepository.verifyAdminOtp({
        emailOrPhone: emailOrPhone.trim(),
        otp: otpString.trim(),
      });

      console.log('✅ [OtpVerificationScreen] OTP verified successfully');
      console.log('🔑 [OtpVerificationScreen] Token received:', response.accessToken.substring(0, 20) + '...');

      // Validate role is ADMIN
      if (response.user.role !== 'ADMIN') {
        throw new Error('Unauthorized: Invalid admin role');
      }

      // CRITICAL: Save token to ADMIN_TOKEN key with await
      console.log('💾 [OtpVerificationScreen] Saving token to ADMIN_TOKEN...');
      await AsyncStorage.setItem('ADMIN_TOKEN', response.accessToken);
      
      // Verify token was saved
      const savedToken = await AsyncStorage.getItem('ADMIN_TOKEN');
      if (!savedToken) {
        throw new Error('Failed to save token. Please try again.');
      }

      console.log('✅ [OtpVerificationScreen] Admin token saved successfully');
      console.log('✅ [OtpVerificationScreen] Token length:', savedToken.length);

      // Save refresh token and user profile
      await AsyncStorage.setItem('@admin_refresh_token', response.refreshToken);
      await AsyncStorage.setItem('@admin_user_profile', JSON.stringify(response.user));

      // Only navigate AFTER token is saved
      console.log('🚀 [OtpVerificationScreen] Navigating to Dashboard...');
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (err: any) {
      console.error('❌ [OtpVerificationScreen] OTP verification failed:', err);
      const errorMessage =
        err.response?.data?.message || err.message || 'OTP verification failed';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!emailOrPhone) {
      Alert.alert('Error', 'Email or phone number is missing');
      return;
    }

    setIsResendLoading(true);
    try {
      await authRepository.sendAdminOtp({
        emailOrPhone: emailOrPhone.trim(),
      });
      Alert.alert('Success', 'OTP resent successfully');
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to resend OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          {emailOrPhone}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit !== '' && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={({nativeEvent}) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isVerifying}
            />
          ))}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, (isVerifying || otp.join('').length !== 6) && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={isVerifying || otp.join('').length !== 6}>
          {isVerifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify & Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOtp}
          disabled={isResendLoading || isVerifying}>
          {isResendLoading ? (
            <ActivityIndicator color="#FF6B35" />
          ) : (
            <Text style={styles.resendText}>Resend OTP</Text>
          )}
        </TouchableOpacity>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#F5F5F5',
  },
  otpInputFilled: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFFFFF',
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
  resendButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  resendText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});

