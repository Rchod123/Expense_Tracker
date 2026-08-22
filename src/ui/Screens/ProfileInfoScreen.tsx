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
import { useTheme } from '../../context/themeContext';

const PersonalProfileScreen = () => {
  const { colors } = useTheme();
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    bio: '',
  });

  const handleSave = () => {
    console.log('Profile Info:', profileInfo);
  };

  return (
    <>
      <ScreenHeader value={STRINGS.profile.personalProfile} required={false} />
      <ScrollView
        contentContainerStyle={[styles.container,{backgroundColor: colors.surfaceMuted}]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero,{backgroundColor: colors.surface,}]}>
          <FontAwesome6
            name="user-pen"
            iconStyle="solid"
            size={26}
            color={COLORS.brandStrong}
          />
          <TextComponent
            value={STRINGS.profile.personalTitle}
            size="MMedium"
            variant="bold"
            color={COLORS.textPrimary}
          />
          <TextComponent
            value={STRINGS.profile.personalSubtitle}
            size="Small"
            color={COLORS.textSecondary}
          />
        </View>

        <View style={[styles.card,{backgroundColor: colors.surface,}]}>
          <Field
            label={STRINGS.profile.namePlaceholder}
            value={profileInfo.name}
            onChangeText={text =>
              setProfileInfo(prev => ({ ...prev, name: text }))
            }
          />
          <Field
            label={STRINGS.profile.bioPlaceholder}
            value={profileInfo.bio}
            multiline
            onChangeText={text =>
              setProfileInfo(prev => ({ ...prev, bio: text }))
            }
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <TextComponent
            value={STRINGS.profile.saveProfile}
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
  multiline?: boolean;
};

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChangeText,
  multiline = false,
}) => (
  <View style={styles.field}>
    <TextComponent
      value={label}
      size="ExtraSmall"
      variant="medium"
      color={COLORS.textMuted}
    />
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      placeholder={label}
      placeholderTextColor={COLORS.textMuted}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
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
  multilineInput: {
    minHeight: 120,
    paddingTop: SPACING.md,
  },
  button: {
    minHeight: 54,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.brandStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
});

export default PersonalProfileScreen;
