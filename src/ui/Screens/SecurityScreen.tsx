import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ScreenHeader from '../Components/ScreenHeader';
import ButtonComponent from '../Components/ButtonComponent';
import { heightPercentageToDP } from '../../utils/responsive';
import { deviceData, getDeviceData } from '../../services/authStorage';
import { useAuth } from '../../context/authContext';
import { useRealmServices } from '../../utils/storageFunctions';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { useBiometric } from '../../utils/hooks';
import { COLORS, STRINGS } from '../Constants';
import { useTheme } from '../../context/themeContext';
import { ThemeSelector } from '../Components/ThemeSelector';

type SecurityItem = {
  id: string;
  title: string;
  type: 'switch' | 'navigation' | 'radio';
};

const SecurityScreen = () => {
  const [fingerprint, setFingerprint] = useState(false);
  const [faceId, setFaceId] = useState(false);
  const [appLock, setAppLock] = useState(false);
  const { logout } = useAuth();
  const { clearStorage } = useRealmServices();
  const [autoLock, setAutoLock] = useState('30');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { checkBiometricAvailability } = useBiometric();
  const { colors } = useTheme();
  useEffect(() => {
    const getData = async () => {
    const device = await getDeviceData();
    const { available, biometryType } = await checkBiometricAvailability();
    if (device !== undefined && device.autoLock) {
        setFingerprint(
          device.fingerprint && available && biometryType === 'Biometrics',
        );
        setFaceId(device.faceId && available && biometryType === 'FaceID');
        setAppLock(device.appLock);
        setAutoLock(device.autoLock);
      }
    };

    void getData();
  }, [checkBiometricAvailability]);

  const onSave = async () => {
      const { available, biometryType } = await checkBiometricAvailability();
    if (!available) {
      Alert.alert(STRINGS.security.biometricUnavailable);
    }
    if (biometryType === 'FaceID' && fingerprint) {
      Alert.alert(STRINGS.security.fingerprintUnavailable);
      setFingerprint(false);
      return;
    } else if (biometryType === 'Biometrics' && faceId) {
      Alert.alert(STRINGS.security.faceIdUnavailable);
      setFaceId(false);
      return;
    }
    await deviceData({
      fingerprint: fingerprint,
      faceId,
      appLock,
      autoLock,
    });
    navigation.goBack();
  };

  const securityItems: SecurityItem[] = [
    {
      id: '1',
      title: STRINGS.security.fingerprint,
      type: 'switch',
    },
    {
      id: '2',
      title: STRINGS.security.faceId,
      type: 'switch',
    },
    {
      id: '3',
      title: STRINGS.security.appLock,
      type: 'switch',
    },
    {
      id: '4',
      title: STRINGS.security.autoLock,
      type: 'radio',
    },
    // {
    //   id: '5',
    //   title: 'Change Password',
    //   type: 'navigation',
    // },
    // {
    //   id: '6',
    //   title: 'Manage Devices',
    //   type: 'navigation',
    // },
    {
      id: '7',
      title: STRINGS.security.logout,
      type: 'navigation',
    },
  ];

  const renderSwitch = (id: string) => {
    switch (id) {
      case '1':
        return <Switch value={fingerprint} onValueChange={setFingerprint} />;

      case '2':
        return <Switch value={faceId} onValueChange={setFaceId} />;

      case '3':
        return <Switch value={appLock} onValueChange={setAppLock} />;

      default:
        return null;
    }
  };

  const renderRadioOptions = () => {
    const options = [
      {
        label: STRINGS.security.immediately,
        value: '0',
      },
      {
        label: STRINGS.security.thirtySeconds,
        value: '30',
      },
      {
        label: STRINGS.security.oneMinute,
        value: '60',
      },
    ];

    return (
      <View style={styles.radioContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.radioRow}
            onPress={() => setAutoLock(option.value)}
          >
            <View
              style={[
                styles.radioCircle,
                autoLock === option.value && styles.radioSelected,
              ]}
            />
            <Text style={[styles.radioText,{color: colors.textPrimary}]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const onNavClick = async (id: string) => {
    switch (id) {
      case '7': {
        await logout();
        clearStorage();
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
            },
          ],
        });
        return;
      }
      default:
        null;
    }
  };

  const renderItem = ({ item }: { item: SecurityItem }) => {
    if (item.type === 'radio') {
      return (
        <View style={[styles.card,{backgroundColor: colors.surface,}]}>
          <Text style={[styles.title,{color: colors.textPrimary}]}>{item.title}</Text>
          {renderRadioOptions()}
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.card,{backgroundColor: colors.surface}]}
        activeOpacity={0.8}
        onPress={() => {
          if (item.type === 'navigation') {
            onNavClick(item.id);
          }
        }}
      >
        <Text style={[styles.title,{color: colors.textPrimary}]}>{item.title}</Text>

        {item.type === 'switch' ? (
          renderSwitch(item.id)
        ) : (
          <Text style={[styles.arrow,{color: colors.textPrimary}]}>›</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScreenHeader value={STRINGS.security.title} required={true} />
      <View style={[styles.container, { backgroundColor: colors.surfaceMuted }]}>
        <FlatList
          data={securityItems}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 30,
          }}
          ListHeaderComponent={<ThemeSelector />}
          ListFooterComponentStyle={{
            paddingTop: heightPercentageToDP(6),
            alignSelf: 'center',
          }}
          ListFooterComponent={() => (
            <ButtonComponent
              value={STRINGS.security.save}
              onPress={onSave}
              type="primary"
            />
          )}
        />
      </View>
    </>
  );
};

export default SecurityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
  },

  card: {
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  arrow: {
    fontSize: 28,
    color: COLORS.textMuted,
  },

  radioContainer: {
    marginTop: 15,
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },

  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginRight: 12,
  },

  radioSelected: {
    backgroundColor: COLORS.info,
    borderColor: COLORS.info,
  },

  radioText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});
