import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user, isAuthenticated} = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Menu');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{width: 24}} />
      </View>

      {isAuthenticated && user ? (
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color="#FF6B35" />
            </View>
            <Text style={styles.name}>{user.fullName || 'User'}</Text>
            <Text style={styles.mobile}>{user.mobileNumber}</Text>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="history" size={24} color="#333" />
              <Text style={styles.menuItemText}>Order History</Text>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="location-on" size={24} color="#333" />
              <Text style={styles.menuItemText}>Saved Addresses</Text>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="settings" size={24} color="#333" />
              <Text style={styles.menuItemText}>Settings</Text>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Icon name="logout" size={24} color="#FF0000" />
              <Text style={[styles.menuItemText, {color: '#FF0000'}]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.loginPrompt}>
          <Icon name="person" size={64} color="#CCC" />
          <Text style={styles.loginPromptText}>Please login to view profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FF6B35',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    padding: 15,
  },
  profileSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mobile: {
    fontSize: 16,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    marginTop: 100,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;







