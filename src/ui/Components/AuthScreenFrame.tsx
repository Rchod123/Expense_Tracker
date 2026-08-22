import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextComponent } from './TextComponent';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';
import { useTheme } from '../../context/themeContext';

type AuthScreenFrameProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerActionText: string;
  onFooterPress: () => void;
  children: React.ReactNode;
};

const AuthScreenFrame: React.FC<AuthScreenFrameProps> = ({
  title,
  subtitle,
  footerText,
  footerActionText,
  onFooterPress,
  children,
}) => {
  const { colors } = useTheme();
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.surfaceMuted }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.hero, { backgroundColor: colors.surface }]}>
        <View style={styles.brandPill}>
          <TextComponent
            value={STRINGS.app.brand}
            size="ExtraSmall"
            variant="bold"
            color={COLORS.brandStrong}
          />
        </View>
        <TextComponent
          value={title}
          size="GMedium"
          variant="bold"
          color={COLORS.textPrimary}
        />
        <TextComponent value={subtitle} size="Small" color={COLORS.textSecondary} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>{children}</View>

      <View style={styles.footer}>
        <TextComponent value={footerText} size="Small" color={COLORS.textSecondary} />
        <TouchableOpacity onPress={onFooterPress} style={styles.footerAction}>
          <TextComponent
            value={footerActionText}
            size="Small"
            variant="bold"
            color={COLORS.brandStrong}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  hero: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  brandPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.brandLight,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  footerAction: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});

export default AuthScreenFrame;
