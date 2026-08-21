import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/authContext';
import { COLORS, STRINGS } from '../Constants';
import { ImageAssets } from '../../assets';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
  },
  textStyle: {
    color: COLORS.surface,
    fontSize: 50,
    fontWeight: 'bold',
  },
  logo: {
    width: 112,
    height: 112,
    borderRadius: 34,
    marginBottom: 20,
  },
  nameStyle: {
    color: COLORS.surface,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

const SplashScreen = () => {
  const stackNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { token, isLoading } = useAuth();
useEffect(() => {
  if (isLoading) {
    return;
  }

    const timer = setTimeout(() => {
      if (token) {
      stackNavigation.replace('Biometric');
      } else {
      stackNavigation.replace('onBoarding');
      }
    }, 2000);

  return () => clearTimeout(timer);
}, [isLoading, token, stackNavigation]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.info} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Image source={ImageAssets.manCoinDonut} style={styles.logo} resizeMode="contain" />
      <Text style={styles.nameStyle}>{STRINGS.app.name}</Text>
    </View>
  );
};

export default SplashScreen;
