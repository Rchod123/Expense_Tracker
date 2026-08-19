import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ScreenHeader from '../Components/ScreenHeader';
import { TextComponent } from '../Components/TextComponent';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';

const AccountInfoScreen = () => {
  const [accountInfo, setAccountInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const handleSave = () => {
    console.log('Account Info:', accountInfo);
  };

  return (
    <>
      <ScreenHeader value={STRINGS.profile.accountInfo} required={false} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <FontAwesome6
            name="address-card"
            iconStyle="solid"
            size={26}
            color={COLORS.brandStrong}
          />
          <TextComponent
            value={STRINGS.profile.accountTitle}
            size="MMedium"
            variant="bold"
            color={COLORS.textPrimary}
          />
          <TextComponent
            value={STRINGS.profile.accountSubtitle}
            size="Small"
            color={COLORS.textSecondary}
          />
        </View>

        <View style={styles.card}>
          <Field
            label={STRINGS.profile.namePlaceholder}
            value={accountInfo.name}
            onChangeText={text =>
              setAccountInfo(prev => ({ ...prev, name: text }))
            }
          />
          <Field
            label={STRINGS.profile.emailPlaceholder}
            value={accountInfo.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={text =>
              setAccountInfo(prev => ({ ...prev, email: text }))
            }
          />
          <Field
            label={STRINGS.profile.phonePlaceholder}
            value={accountInfo.phoneNumber}
            keyboardType="phone-pad"
            onChangeText={text =>
              setAccountInfo(prev => ({ ...prev, phoneNumber: text }))
            }
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <TextComponent
            value={STRINGS.profile.saveAccount}
            color={COLORS.surface}
            variant="bold"
          />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => (
  <View style={styles.field}>
    <TextComponent
      value={label}
      size="ExtraSmall"
      variant="medium"
      color={COLORS.textMuted}
    />
    <TextInput
      style={styles.input}
      placeholder={label}
      placeholderTextColor={COLORS.textMuted}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.surfaceMuted,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  hero: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.lg,
    ...SHADOWS.card,
  },
  field: {
    gap: SPACING.xs,
  },
  input: {
    minHeight: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: SPACING.md,
    color: COLORS.textPrimary,
  },
  button: {
    minHeight: 54,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.info,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
});

export default AccountInfoScreen;
