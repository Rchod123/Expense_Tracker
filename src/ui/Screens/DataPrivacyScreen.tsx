import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ScreenHeader from '../Components/ScreenHeader';
import { TextComponent } from '../Components/TextComponent';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';

const policyRows = [
  {
    icon: 'shield-halved',
    title: STRINGS.profile.privacyEncryptionTitle,
    subtitle: STRINGS.profile.privacyEncryptionSubtitle,
  },
  {
    icon: 'cloud-arrow-up',
    title: STRINGS.profile.privacyCloudTitle,
    subtitle: STRINGS.profile.privacyCloudSubtitle,
  },
  {
    icon: 'user-shield',
    title: STRINGS.profile.privacyAccountTitle,
    subtitle: STRINGS.profile.privacyAccountSubtitle,
  },
] as const;

const DataPrivacyScreen = () => {
  return (
    <>
      <ScreenHeader value={STRINGS.profile.dataAndPrivacy} required={true} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <FontAwesome6
            name="shield"
            iconStyle="solid"
            size={26}
            color={COLORS.brandStrong}
          />
          <TextComponent
            value={STRINGS.profile.privacyTitle}
            size="MMedium"
            variant="bold"
            color={COLORS.textPrimary}
          />
          <TextComponent
            value={STRINGS.profile.privacySubtitle}
            size="Small"
            color={COLORS.textSecondary}
          />
        </View>

        <View style={styles.card}>
          {policyRows.map((row, index) => (
            <View
              key={row.title}
              style={[
                styles.row,
                index !== policyRows.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={styles.rowIcon}>
                <FontAwesome6
                  name={row.icon}
                  iconStyle="solid"
                  size={15}
                  color={COLORS.info}
                />
              </View>
              <View style={styles.rowCopy}>
                <TextComponent
                  value={row.title}
                  size="Small"
                  variant="bold"
                  color={COLORS.textPrimary}
                />
                <TextComponent
                  value={row.subtitle}
                  size="ExtraSmall"
                  color={COLORS.textSecondary}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <TextComponent
            value={STRINGS.profile.privacyControlTitle}
            size="Small"
            variant="bold"
            color={COLORS.textPrimary}
          />
          <TextComponent
            value={STRINGS.profile.privacyControlSubtitle}
            size="ExtraSmall"
            color={COLORS.textSecondary}
          />
        </View>
      </ScrollView>
    </>
  );
};

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
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: {
    flex: 1,
    gap: 3,
  },
  noteCard: {
    backgroundColor: COLORS.brandLighter,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: 4,
  },
});

export default DataPrivacyScreen;
