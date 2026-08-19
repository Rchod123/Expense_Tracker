import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

import PinInput from '../Components/PinInput';
import { RootStackParamList } from '../../types/navigation';
import { heightPercentageToDP } from '../../utils/responsive';
import ScreenHeader from '../Components/ScreenHeader';
import { useBiometric } from '../../utils/hooks';
import { getDeviceData } from '../../services/authStorage';
import { COLORS } from '../Constants';
import { STRINGS } from '../Constants';

const PIN_LENGTH = 4;

const PINScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));

  const [confirmPin, setConfirmPin] = useState<string[]>(
    Array(PIN_LENGTH).fill(''),
  );
  const [storedPIN, setStoredPIN] = useState('');
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const { authenticateWithBiometrics } = useBiometric();

  useEffect(() => {
    checkExistingPin();
  }, []);

  useEffect(() => {
    const checkBiometric = async () => {
      const device = await getDeviceData();
      if (storedPIN.length > 3 && (device.fingerprint || device.faceId)) {
        const success = await authenticateWithBiometrics();
        success && navigation.navigate('Home');
      }
    };

    void checkBiometric();
  }, [authenticateWithBiometrics, navigation, storedPIN]);

  const checkExistingPin = async () => {
    try {
      const savedPin = await EncryptedStorage.getItem('userPIN');
      if (savedPin) {
        setStoredPIN(savedPin);
        setIsCreatingPin(false);
      } else {
        setIsCreatingPin(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = useCallback(() => {
    const enteredPin = confirmPin.join('') || pin.join('');
    console.log(enteredPin, pin);
    if (enteredPin === storedPIN) {
      navigation.navigate('Home');
      return;
    }

    Alert.alert(STRINGS.alerts.incorrectPin);
    setPin(Array(PIN_LENGTH).fill(''));
  }, [confirmPin, navigation, pin, storedPIN]);

  const handleRegister = async () => {
    const firstPin = pin.join('');
    const secondPin = confirmPin.join('');

    if (firstPin.length !== PIN_LENGTH) {
      Alert.alert(STRINGS.alerts.pinLength);
      return;
    }

    if (firstPin !== secondPin) {
      Alert.alert(STRINGS.alerts.pinMismatch);

      setPin(Array(PIN_LENGTH).fill(''));
      setConfirmPin(Array(PIN_LENGTH).fill(''));

      return;
    }

    try {
      await EncryptedStorage.setItem('userPIN', firstPin);

      Alert.alert(STRINGS.alerts.pinCreatedTitle, STRINGS.alerts.pinCreated);

      navigation.navigate('Home');
    } catch (err) {
      console.log(err);
      Alert.alert(STRINGS.alerts.unableToSavePin);
    }
  };

  return (
    <>
      <ScreenHeader
        value={
          isCreatingPin
            ? STRINGS.alerts.createPinTitle
            : STRINGS.alerts.enterPinTitle
        }
        required={true}
      />
      <View style={styles.container}>
        <View style={{ gap: heightPercentageToDP(4) }}>
          <PinInput values={pin} onChange={setPin} />

          {isCreatingPin && (
            <PinInput values={confirmPin} onChange={setConfirmPin} />
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => isCreatingPin ? handleRegister() : handleLogin()}
        >
          <Text style={styles.buttonText}>
            {isCreatingPin
              ? STRINGS.alerts.createPinButton
              : STRINGS.alerts.unlockButton}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PINScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
  },

  button: {
    width: '80%',
    backgroundColor: COLORS.info,
    marginTop: heightPercentageToDP(5),
    paddingVertical: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: COLORS.surface,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});
