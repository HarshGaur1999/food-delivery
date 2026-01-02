import AsyncStorage from '@react-native-async-storage/async-storage';

// Using ADMIN_TOKEN as per requirements
const TOKEN_KEY = 'ADMIN_TOKEN';
const REFRESH_TOKEN_KEY = '@admin_refresh_token';
const USER_PROFILE_KEY = '@admin_user_profile';

export const secureStorage = {
  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async setUserProfile(profile: any): Promise<void> {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  },

  async getUserProfile(): Promise<any | null> {
    const profile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_PROFILE_KEY]);
  },
};







