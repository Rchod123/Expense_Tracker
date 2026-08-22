import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { STRINGS } from '../Constants';
import { useTheme } from '../../context/themeContext';
import type { ThemeMode } from '../Constants/theme';

type ThemeSelectorProps = {
  showCustomFields?: boolean;
};

const customFields = [
  { key: 'brandStrong', label: STRINGS.security.primaryColor },
  { key: 'surfaceMuted', label: STRINGS.security.backgroundColor },
  { key: 'surface', label: STRINGS.security.surfaceColor },
  { key: 'textPrimary', label: STRINGS.security.textColor },
] as const;

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  showCustomFields = true,
}) => {
  const { mode, colors, customColors, setMode, updateCustomColors } = useTheme();
  const modes: Array<{ value: ThemeMode; label: string }> = [
    { value: 'light', label: STRINGS.security.lightTheme },
    { value: 'dark', label: STRINGS.security.darkTheme },
    { value: 'custom', label: STRINGS.security.customTheme },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {STRINGS.security.theme}
      </Text>
      <View style={styles.modes}>
        {modes.map(item => (
          <Pressable
            key={item.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: mode === item.value }}
            onPress={() => setMode(item.value)}
            style={[
              styles.mode,
              { borderColor: colors.border, backgroundColor: colors.surfaceMuted },
              mode === item.value && {
                borderColor: colors.brandStrong,
                backgroundColor: colors.brandStrong,
              },
            ]}
          >
            <Text
              style={[
                styles.modeText,
                { color: mode === item.value ? colors.surface : colors.textPrimary },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {showCustomFields && mode === 'custom' && (
        <View style={styles.customColors}>
          <Text style={[styles.customTitle, { color: colors.textSecondary }]}>
            {STRINGS.security.customColors}
          </Text>
          {customFields.map(field => (
            <View key={field.key} style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                {field.label}
              </Text>
              <TextInput
                value={customColors[field.key]}
                onChangeText={value => {
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    updateCustomColors({
                      [field.key]: value,
                    } as Partial<typeof customColors>);
                  }
                }}
                autoCapitalize="characters"
                maxLength={7}
                style={[
                  styles.input,
                  {
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceMuted,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  modes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  mode: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  customColors: {
    gap: 10,
    marginTop: 18,
  },
  customTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldLabel: {
    flex: 1,
    fontSize: 14,
  },
  input: {
    width: 100,
    height: 38,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 13,
  },
});
