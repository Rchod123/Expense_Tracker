// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { TextInput, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/authContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import ScreenHeader from '../Components/ScreenHeader';
import AuthScreenFrame from '../Components/AuthScreenFrame';
import ButtonComponent from '../Components/ButtonComponent';
import { COLORS, STRINGS } from '../Constants';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        STRINGS.alerts.validationTitle,
        STRINGS.alerts.enterBothAuth,
      );
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigation.navigate('Biometric');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : STRINGS.auth.loginGenericError;
      Alert.alert(STRINGS.auth.loginErrorTitle, message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScreenHeader value={STRINGS.auth.loginButton} required showBackButton={false} />
      <AuthScreenFrame
        title={STRINGS.auth.loginTitle}
        subtitle={STRINGS.auth.loginSubtitle}
        footerText={STRINGS.auth.signUpPrompt}
        footerActionText={STRINGS.auth.signUpLink}
        onFooterPress={() => navigation.navigate('Register')}
      >
        <TextInput
          style={styles.input}
          placeholder={STRINGS.auth.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder={STRINGS.auth.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ButtonComponent
          value={submitting ? STRINGS.common.loading : STRINGS.auth.loginButton}
          onPress={handleLogin}
          type="primary"
          disabled={submitting}
        />
      </AuthScreenFrame>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    minHeight: 56,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});
