// services/authStorage.ts
import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'user_jwt_token';
const USER_KEY = 'user_profile_data';
const DEVICE_LOCAL = 'user_local_device';
const CHAT_HISTORY = 'chatHistory';
const PIN_KEY = 'userPIN';

export const saveAuthData = async (token: string, user: object) => {
  try {
    await EncryptedStorage.setItem(TOKEN_KEY, token);
    await EncryptedStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth data securely:', error);
  }
};

export const deviceData = async (device: object) => {
  try{
    await EncryptedStorage.setItem(DEVICE_LOCAL, JSON.stringify(device));
  }catch(err){
    console.log('Failed to save device security data: ',err);
  }
}

// export const userData = async (user: object) => {
//   try{
//     await EncryptedStorage.setItem(DEVICE_LOCAL, JSON.stringify(user));
//   }catch(err){
//     console.log('Failed to save device security data: ',err);
//   }
// }

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await EncryptedStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
};

export const getDeviceData = async () => {
  try{
     const device = await EncryptedStorage.getItem(DEVICE_LOCAL);
    return device ? JSON.parse(device) : null;
  }catch(err){
    console.error('Failed to retrieve auth token:', err);
    return null;
  }
}

export const getStoredUser = async () => {
  try {
    const user = await EncryptedStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    return null;
  }
};

export const savePin = async (pin: string) => {
  await EncryptedStorage.setItem(PIN_KEY, pin);
};

export const getStoredPin = async (): Promise<string | null> => {
  return EncryptedStorage.getItem(PIN_KEY);
};

export const clearPin = async () => {
  await EncryptedStorage.removeItem(PIN_KEY);
};

export const clearAuthData = async () => {
  try {
    await clearPin();
    await EncryptedStorage.removeItem(TOKEN_KEY);
    await EncryptedStorage.removeItem(USER_KEY);
    await EncryptedStorage.removeItem(DEVICE_LOCAL);
    await EncryptedStorage.removeItem(CHAT_HISTORY);
    
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};
