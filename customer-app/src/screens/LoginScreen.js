import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {sendOtp, verifyOtp} from '../store/slices/authSlice';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.auth);

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      await dispatch(sendOtp(mobileNumber)).unwrap();
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your mobile number');
    } catch (error) {
      Alert.alert('Error', error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter 6-digit OTP');
      return;
    }

    try {
      await dispatch(verifyOtp({mobileNumber, otp})).unwrap();
      Alert.alert('Success', 'Login successful');
      navigation.replace('Menu');
    } catch (error) {
      Alert.alert('Error', error || 'Invalid OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your mobile number</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        editable={!otpSent}
      />

      {otpSent && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={otpSent ? handleVerifyOtp : handleSendOtp}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            {otpSent ? 'Verify OTP' : 'Send OTP'}
          </Text>
        )}
      </TouchableOpacity>

      {otpSent && (
        <TouchableOpacity
          style={styles.resendButton}
          onPress={() => {
            setOtpSent(false);
            setOtp('');
          }}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace('Menu')}>
        <Text style={styles.skipText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendText: {
    color: '#FF6B35',
    fontSize: 14,
  },
  skipButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    color: '#666',
    fontSize: 14,
  },
});

export default LoginScreen;







