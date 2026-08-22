import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ScreenHeader from '../Components/ScreenHeader';
import { TextComponent } from '../Components/TextComponent';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';
import { useTheme } from '../../context/themeContext';
import { useQuery, useRealm } from '@realm/react';
import { useAuth } from '../../context/authContext';
import { User } from '../../db/schema/User';
import Realm, { BSON } from 'realm';
import { userApi } from '../../services/apiClient';

const AccountInfoScreen = () => {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const realm = useRealm();
  const users = useQuery(User);
  const [isSaving, setIsSaving] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    name: '',
    email: '',
    mobile: '',
    tag: '',
  });

  useEffect(() => {
    const savedUser = Array.from(users).find(
      item => item._id.toString() === user?.id,
    );
    setAccountInfo({
      name: savedUser?.name ?? user?.name ?? '',
      email: savedUser?.email ?? user?.email ?? '',
      mobile: savedUser?.mobile ?? user?.mobile ?? '',
      tag: savedUser?.tag ?? user?.tag ?? '',
    });
  }, [user, users]);

  const handleSave = async () => {
    if (!user?.id || !BSON.ObjectId.isValid(user.id)) {
      Alert.alert(STRINGS.profile.saveError);
      return;
    }

    const payload = {
      id: user.id,
      name: accountInfo.name.trim(),
      email: accountInfo.email.trim().toLowerCase(),
      mobile: accountInfo.mobile.trim(),
      tag: accountInfo.tag.trim(),
    };

    setIsSaving(true);
    try {
      realm.write(() => {
        realm.create(
          User,
          {
            _id: new BSON.ObjectId(payload.id),
            ...payload,
            synced: false,
          },
          Realm.UpdateMode.Modified,
        );
      });
      const savedUser = await userApi.update(payload);
      realm.write(() => {
        realm.create(
          User,
          {
            _id: new BSON.ObjectId(savedUser.id),
            name: savedUser.name,
            email: savedUser.email,
            mobile: savedUser.mobile,
            tag: savedUser.tag,
            synced: true,
          },
          Realm.UpdateMode.Modified,
        );
      });
      await updateUser(savedUser);
      Alert.alert(STRINGS.profile.saveSuccess);
    } catch (error) {
      Alert.alert(
        STRINGS.profile.saveError,
        error instanceof Error ? error.message : STRINGS.profile.saveError,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ScreenHeader value={STRINGS.profile.accountInfo} required={false} />
      <ScrollView
        contentContainerStyle={[styles.container,{ backgroundColor: colors.surfaceMuted,}]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero,{ backgroundColor: colors.surface,}]}>
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

        <View style={[styles.card,{backgroundColor: colors.surface}]}>
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
            value={accountInfo.mobile}
            keyboardType="phone-pad"
            onChangeText={text =>
              setAccountInfo(prev => ({ ...prev, mobile: text }))
            }
          />
          <Field
            label={STRINGS.profile.tagPlaceholder}
            value={accountInfo.tag}
            autoCapitalize="none"
            onChangeText={text =>
              setAccountInfo(prev => ({ ...prev, tag: text }))
            }
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
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
   
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  hero: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  card: {
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
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default AccountInfoScreen;
