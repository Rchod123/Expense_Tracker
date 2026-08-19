import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

export function useExit() {
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Exit App',
        'Do you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => backHandler.remove();
  }, []);
}

export interface BiometricCheckResult {
  available: boolean;
  biometryType: string | null;
}

export const useBiometric = () => {
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true
  });
  const checkBiometricAvailability =
    async (): Promise<BiometricCheckResult> => {
      try {
         const { available, biometryType } = await rnBiometrics.isSensorAvailable();
        if (available && biometryType === BiometryTypes.FaceID) {
          console.log('Face ID is available');
        } else if (available && biometryType === BiometryTypes.TouchID) {
          console.log('Touch ID is available');
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log('Android Biometrics is available');
        } else {
          console.log('Biometrics not available or not enrolled');
        }

        return { available, biometryType: biometryType || null };
      } catch (error) {
        console.error('Error checking biometric sensor:', error);
        return { available: false, biometryType: null };
      }
    };

  const authenticateWithBiometrics = async (
    promptMessage: string = 'Confirm your identity to log in',
  ): Promise<boolean> => {
    
    try {
         const { available } = await rnBiometrics.isSensorAvailable();
         console.log(available,"from ")
      if (!available) {
        console.warn('Biometrics not available on this device');
        return false;
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      return success;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };

  const authenticateAndSignPayload = async (
    payloadToSign: string,
  ): Promise<{ success: boolean; signature?: string }> => {
    try {
      // Check if key already exists, create if not
      const { keysExist } = await rnBiometrics.biometricKeysExist();

      if (!keysExist) {
        await rnBiometrics.createKeys();
      }

      // Prompt user to sign payload
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Sign in with Face ID / Biometrics',
        payload: payloadToSign,
      });

      if (success && signature) {
        return { success: true, signature };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to create biometric signature:', error);
      return { success: false };
    }
  };

  return {
    authenticateAndSignPayload,
    checkBiometricAvailability,
    authenticateWithBiometrics,
  };
};
