// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/authContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import ScreenHeader from '../Components/ScreenHeader';
import AuthScreenFrame from '../Components/AuthScreenFrame';
import ButtonComponent from '../Components/ButtonComponent';
import { COLORS, STRINGS } from '../Constants';

export const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert(
        STRINGS.alerts.validationTitle,
        STRINGS.alerts.pleaseFillFields,
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        STRINGS.alerts.weakPasswordTitle,
        STRINGS.alerts.passwordTooShort,
      );
      return;
    }

    try {
      setSubmitting(true);
      await register(name.trim(), email.trim(), password);
      navigation.navigate('Biometric');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : STRINGS.auth.registrationGenericError;
      Alert.alert(STRINGS.auth.registrationErrorTitle, message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScreenHeader value={STRINGS.auth.registerButton} required showBackButton={false} />
      <AuthScreenFrame
        title={STRINGS.auth.registerTitle}
        subtitle={STRINGS.auth.registerSubtitle}
        footerText={STRINGS.auth.signInPrompt}
        footerActionText={STRINGS.auth.signInLink}
        onFooterPress={() => navigation.navigate('Login')}
      >
      <TextInput
        style={styles.input}
        placeholder={STRINGS.auth.fullNamePlaceholder}
        value={name}
        onChangeText={setName}
      />

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
          value={submitting ? STRINGS.common.loading : STRINGS.auth.registerButton}
          onPress={handleRegister}
          disabled={submitting}
          type={'primary'}      />
      {submitting && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={COLORS.info} />
        </View>
      )}
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
  loadingRow: {
    alignItems: 'center',
    marginTop: 4,
  },
});
