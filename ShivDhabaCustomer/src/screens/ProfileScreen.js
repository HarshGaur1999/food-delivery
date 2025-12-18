import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user, isAuthenticated} = useSelector(state => state.auth);
  
  // Local state for profile settings
  const [spiceLevel, setSpiceLevel] = useState('Normal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('Hindi');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.mobileNumber || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data
  const savedAddress = {
    address: '306 Lotus Tower, Meerut Modipuram',
    instructions: 'Gate ke paas call kare',
  };

  const specialInstructions = [
    {id: 1, label: 'Less Oil', selected: false},
    {id: 2, label: 'No Onion', selected: false},
    {id: 3, label: 'Less Spicy', selected: false},
  ];

  const [instructions, setInstructions] = useState(specialInstructions);
  const [loyaltyPoints] = useState(3); // 3 orders completed

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement delete account logic
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ],
    );
  };

  const handleCall = () => {
    Alert.alert('Call Shiv Dhaba', 'Calling: +91 1234567890');
    // Implement actual call functionality
  };

  const handleWhatsApp = () => {
    Alert.alert('WhatsApp Support', 'Opening WhatsApp...');
    // Implement WhatsApp functionality
  };

  const handleReportIssue = (issueType) => {
    Alert.alert('Report Issue', `Reporting: ${issueType}`);
    // Implement issue reporting
  };

  const toggleInstruction = (id) => {
    setInstructions(prev =>
      prev.map(item =>
        item.id === id ? {...item, selected: !item.selected} : item,
      ),
    );
  };

  const handleSaveProfile = () => {
    // Implement save profile logic
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const getInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.mobileNumber) {
      return user.mobileNumber.charAt(user.mobileNumber.length - 1);
    }
    return 'U';
  };

  // Section Component
  const SectionCard = ({title, children, style}) => (
    <View style={[styles.sectionCard, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  // Menu Item Component
  const MenuItem = ({icon, title, onPress, rightComponent, showArrow = true}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={24} color="#FF6B35" />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {rightComponent}
        {showArrow && <Icon name="chevron-right" size={24} color="#999" />}
      </View>
    </TouchableOpacity>
  );

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{width: 24}} />
        </View>
        <View style={styles.loginPrompt}>
          <Icon name="person" size={64} color="#CCC" />
          <Text style={styles.loginPromptText}>Please login to view profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => {
              // Navigate to menu with search query
              navigation.navigate('Menu', {searchQuery});
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Top Section */}
        <View style={styles.profileTopSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial()}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditModalVisible(true)}>
              <Icon name="edit" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.fullName || 'User'}</Text>
          <Text style={styles.userPhone}>{user.mobileNumber}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setEditModalVisible(true)}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Orders Section */}
        <SectionCard title="Orders">
          <MenuItem
            icon="history"
            title="My Orders"
            onPress={() => navigation.navigate('OrderTracking')}
          />
          <MenuItem
            icon="refresh"
            title="Reorder"
            onPress={() => navigation.navigate('Menu')}
          />
        </SectionCard>

        {/* 2. Delivery Details Section */}
        <SectionCard title="Delivery Details">
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Icon name="location-on" size={20} color="#FF6B35" />
              <Text style={styles.addressTitle}>Saved Address</Text>
            </View>
            <Text style={styles.addressText}>{savedAddress.address}</Text>
            <View style={styles.instructionsRow}>
              <Icon name="info" size={16} color="#666" />
              <Text style={styles.instructionsText}>
                {savedAddress.instructions}
              </Text>
            </View>
            <TouchableOpacity style={styles.changeAddressButton}>
              <Text style={styles.changeAddressText}>Change Address</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* 3. Food Preferences Section (Veg-only, NO toggle) */}
        <SectionCard title="Food Preferences">
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Spice Level</Text>
            <View style={styles.spiceButtons}>
              {['Normal', 'Spicy'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.spiceButton,
                    spiceLevel === level && styles.spiceButtonActive,
                  ]}
                  onPress={() => setSpiceLevel(level)}>
                  <Text
                    style={[
                      styles.spiceButtonText,
                      spiceLevel === level && styles.spiceButtonTextActive,
                    ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.preferenceLabel}>Special Instructions</Text>
          <View style={styles.instructionsContainer}>
            {instructions.map(instruction => (
              <TouchableOpacity
                key={instruction.id}
                style={[
                  styles.instructionChip,
                  instruction.selected && styles.instructionChipActive,
                ]}
                onPress={() => toggleInstruction(instruction.id)}>
                <Text
                  style={[
                    styles.instructionChipText,
                    instruction.selected && styles.instructionChipTextActive,
                  ]}>
                  {instruction.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* 4. Offers & Rewards Section */}
        <SectionCard title="Offers & Rewards">
          <MenuItem
            icon="local-offer"
            title="Coupons"
            onPress={() => Alert.alert('Coupons', 'No active coupons')}
            rightComponent={
              <View style={styles.badge}>
                <Text style={styles.badgeText}>0</Text>
              </View>
            }
          />
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyHeader}>
              <Icon name="stars" size={24} color="#FFD700" />
              <Text style={styles.loyaltyTitle}>Loyalty Points</Text>
            </View>
            <Text style={styles.loyaltyText}>
              {loyaltyPoints} orders completed
            </Text>
            <Text style={styles.loyaltySubtext}>
              5 orders = 1 free roti
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${(loyaltyPoints / 5) * 100}%`},
                ]}
              />
            </View>
          </View>
        </SectionCard>

        {/* 5. Payments Section */}
        <SectionCard title="Payments">
          <MenuItem
            icon="money"
            title="Cash on Delivery (COD)"
            onPress={() => {}}
            rightComponent={
              <Icon name="check-circle" size={20} color="#4CAF50" />
            }
          />
          <MenuItem
            icon="account-balance-wallet"
            title="UPI"
            onPress={() => Alert.alert('UPI', 'UPI payment method')}
          />
        </SectionCard>

        {/* 6. Help & Support Section */}
        <SectionCard title="Help & Support">
          <MenuItem
            icon="phone"
            title="Call Shiv Dhaba"
            onPress={handleCall}
          />
          <MenuItem
            icon="chat"
            title="WhatsApp Support"
            onPress={handleWhatsApp}
          />
          <MenuItem
            icon="report-problem"
            title="Report an Issue"
            onPress={() => {
              Alert.alert(
                'Report Issue',
                'Select issue type',
                [
                  {text: 'Late Delivery', onPress: () => handleReportIssue('Late Delivery')},
                  {text: 'Item Missing', onPress: () => handleReportIssue('Item Missing')},
                  {text: 'Cancel', style: 'cancel'},
                ],
              );
            }}
          />
        </SectionCard>

        {/* 7. App Settings Section */}
        <SectionCard title="App Settings">
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="notifications" size={24} color="#FF6B35" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{false: '#CCC', true: '#FF6B35'}}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="language" size={24} color="#FF6B35" />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => {
                Alert.alert(
                  'Select Language',
                  '',
                  [
                    {text: 'Hindi', onPress: () => setLanguage('Hindi')},
                    {text: 'English', onPress: () => setLanguage('English')},
                    {text: 'Cancel', style: 'cancel'},
                  ],
                );
              }}>
              <Text style={styles.languageText}>{language}</Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="brightness-6" size={24} color="#FF6B35" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{false: '#CCC', true: '#FF6B35'}}
            />
          </View>
        </SectionCard>

        {/* Account Actions */}
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <Icon name="logout" size={20} color="#FF0000" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}>
            <Icon name="delete" size={20} color="#FF0000" />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FF6B35',
    elevation: 4,
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  profileTopSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
  },
  editProfileText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addressCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  instructionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  changeAddressButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
  },
  changeAddressText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  spiceButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  spiceButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  spiceButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  spiceButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  spiceButtonTextActive: {
    color: '#FFF',
  },
  instructionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  instructionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  instructionChipActive: {
    backgroundColor: '#FFF5F2',
    borderColor: '#FF6B35',
  },
  instructionChipText: {
    fontSize: 14,
    color: '#666',
  },
  instructionChipTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loyaltyCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  loyaltyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  loyaltyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  loyaltySubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  languageText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  accountActions: {
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF0000',
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    gap: 8,
  },
  deleteText: {
    fontSize: 16,
    color: '#FF0000',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
