import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from './TextComponent';
import { formatCurrency } from '../../utils/currency';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import { COLORS, RADIUS, STRINGS } from '../Constants';

type BalanceCardProps = {
  balance: number;
  income: number;
  expenses: number;
  onPress: (id: number) => void;
};

const balanceMenu = [
  { id: 1, name: STRINGS.dashboard.refresh },
  { id: 2, name: STRINGS.dashboard.wallet },
  { id: 3, name: STRINGS.dashboard.cardChange },
  { id: 4, name: STRINGS.dashboard.exit },
] as const;

const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  income,
  expenses,
  onPress,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.content}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceCopy}>
            <TextComponent
              value={STRINGS.wallet.totalBalance}
              size="Small"
              color="#D4ECE8"
            />
            <TextComponent
              value={formatCurrency(balance)}
              size="MidSection"
              variant="bold"
              color={COLORS.surface}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Balance options"
            style={styles.moreButton}
            onPress={() => setVisible(true)}
          >
            <FontAwesome6
              name="ellipsis"
              iconStyle="solid"
              color={COLORS.surface}
              size={18}
            />
          </Pressable>
        </View>

        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Summary
            icon="arrow-down"
            label={STRINGS.statistics.inflowLabel}
            value={formatCurrency(income)}
            color="#8DE2B9"
          />
          <View style={styles.verticalDivider} />
          <Summary
            icon="arrow-up"
            label={STRINGS.statistics.outflowLabel}
            value={formatCurrency(expenses)}
            color="#FFB89B"
          />
        </View>
      </View>
      <Modal transparent animationType="fade" visible={visible}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <TextComponent
                value={STRINGS.wallet.totalBalance}
                size="Small"
                variant="bold"
              />
              <Text style={styles.modalHint}>Quick actions</Text>
            </View>
            <FlatList
              data={balanceMenu}
              contentContainerStyle={styles.modalContent}
              keyExtractor={item => `${item.id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalRow}
                  onPress={() => {
                    onPress(item.id);
                    setVisible(false);
                  }}
                >
                  <View style={styles.modalRowIcon}>
                    <FontAwesome6
                      name="circle-dot"
                      iconStyle="solid"
                      size={12}
                      color={COLORS.brandStrong}
                    />
                  </View>
                  <TextComponent value={item.name} size="Small" />
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

type SummaryProps = {
  icon: 'arrow-down' | 'arrow-up';
  label: string;
  value: string;
  color: string;
};

const Summary: React.FC<SummaryProps> = ({ icon, label, value, color }) => (
  <View style={styles.summary}>
    <View style={[styles.summaryIcon, { backgroundColor: color }]}>
      <FontAwesome6 name={icon} iconStyle="solid" color="#176B65" size={12} />
    </View>
    <View>
      <TextComponent value={label} size="ExtraSmall" color="#CBE5E1" />
      <TextComponent
        value={value}
        size="Small"
        variant="bold"
        color={COLORS.surface}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    minHeight: 185,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: '#114F4B',
  },
  content: { flex: 1, padding: 22, justifyContent: 'space-between', gap: 16 },
  glowOne: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    right: -82,
    top: -105,
    backgroundColor: 'rgba(83, 188, 176, 0.24)',
  },
  glowTwo: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 63,
    left: -48,
    bottom: -72,
    backgroundColor: 'rgba(83, 188, 176, 0.17)',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceCopy: { gap: 4 },
  moreButton: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summary: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11, 30, 29, 0.38)',
  },
  modalCard: {
    minHeight: heightPercentageToDP(24),
    width: '100%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },
  modalContent: {
    gap: 12,
    paddingTop: 10,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.border,
  },
  modalHeader: {
    paddingTop: 14,
    paddingBottom: 6,
    gap: 4,
  },
  modalHint: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  modalRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surfaceMuted,
  },
  modalRowIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: COLORS.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BalanceCard;
