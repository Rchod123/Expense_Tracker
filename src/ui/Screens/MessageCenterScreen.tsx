import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ScreenHeader from '../Components/ScreenHeader';
import { TextComponent } from '../Components/TextComponent';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';

const MessageCenterScreen = () => {
  return (
    <>
      <ScreenHeader value={STRINGS.profile.messageCenter} required={false} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <FontAwesome6
              name="inbox"
              iconStyle="solid"
              size={22}
              color={COLORS.brandStrong}
            />
          </View>
          <TextComponent
            value={STRINGS.profile.messageTitle}
            size="MMedium"
            variant="bold"
            color={COLORS.textPrimary}
          />
          <TextComponent
            value={STRINGS.profile.messageSubtitle}
            size="Small"
            color={COLORS.textSecondary}
          />
        </View>

        <View style={styles.card}>
          <TextComponent
            value={STRINGS.profile.messageUpdates}
            size="Small"
            variant="bold"
            color={COLORS.textPrimary}
          />
          <View style={styles.listItem}>
            <View style={styles.dot} />
            <View style={styles.listCopy}>
              <TextComponent
                value={STRINGS.profile.messageEmptyTitle}
                variant="medium"
              />
              <TextComponent
                value={STRINGS.profile.messageEmptySubtitle}
                size="ExtraSmall"
                color={COLORS.textSecondary}
              />
            </View>
          </View>
        </View>

        <View style={styles.tipCard}>
          <FontAwesome6
            name="bell"
            iconStyle="solid"
            size={16}
            color={COLORS.info}
          />
          <TextComponent
            value={STRINGS.profile.messageTip}
            size="Small"
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
    gap: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.info,
    marginTop: 6,
  },
  listCopy: {
    flex: 1,
    gap: 2,
  },
  tipCard: {
    backgroundColor: COLORS.brandLighter,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
});

export default MessageCenterScreen;
