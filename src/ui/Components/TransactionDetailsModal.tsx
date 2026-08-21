import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { ImageAssets } from '../../assets';
import { formatCurrency } from '../../utils/currency';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';
import { TextComponent } from './TextComponent';
import type { TransactionListItem } from './TransactionComponent';

type Props = {
  transaction: TransactionListItem | null;
  onClose: () => void;
};

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const TransactionDetailsModal: React.FC<Props> = ({ transaction, onClose }) => {
  if (!transaction) return null;
  const isIncome = transaction.type === 'income';
  const asset = ImageAssets[transaction.ui];

  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              {asset ? <Image source={asset} style={styles.icon} resizeMode="contain" /> : <FontAwesome6 name="receipt" iconStyle="solid" size={20} color={COLORS.brandStrong} />}
            </View>
            <View style={styles.headerCopy}>
              <TextComponent value={STRINGS.transaction.detailsTitle} size="ExtraSmall" color={COLORS.textSecondary} />
              <TextComponent value={transaction.title} size="MMedium" variant="bold" />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={STRINGS.transaction.close} onPress={onClose} style={styles.closeButton}>
              <FontAwesome6 name="xmark" iconStyle="solid" size={16} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.amountCard}>
            <TextComponent value={isIncome ? STRINGS.transaction.incomeAdded : STRINGS.transaction.expensePaid} size="Small" color={COLORS.textSecondary} />
            <TextComponent value={`${isIncome ? '+' : '-'}${formatCurrency(transaction.amount)}`} size="Large" variant="bold" color={isIncome ? COLORS.success : COLORS.danger} />
          </View>

          <View style={styles.details}>
            <Detail label={STRINGS.transaction.type} value={isIncome ? STRINGS.common.income : STRINGS.common.expense} />
            <Detail label={STRINGS.transaction.date} value={formatDate(transaction.date)} />
            <Detail label={STRINGS.transaction.description} value={transaction.description?.trim() || STRINGS.transaction.emptySubtitle} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <TextComponent value={label} size="Small" color={COLORS.textSecondary} />
    <TextComponent value={value} size="Small" variant="medium" style={styles.detailValue} />
  </View>
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: COLORS.overlay },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, paddingBottom: 34, ...SHADOWS.card },
  handle: { alignSelf: 'center', width: 42, height: 4, borderRadius: RADIUS.pill, backgroundColor: COLORS.border, marginBottom: SPACING.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconWrap: { width: 52, height: 52, borderRadius: RADIUS.lg, backgroundColor: COLORS.brandLight, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 32, height: 32, borderRadius: RADIUS.sm },
  headerCopy: { flex: 1, gap: 3 },
  closeButton: { width: 36, height: 36, borderRadius: RADIUS.pill, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  amountCard: { marginTop: SPACING.xl, padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.surfaceMuted, gap: 4 },
  details: { marginTop: SPACING.lg, gap: 0 },
  detailRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  detailValue: { textAlign: 'right' },
});

export default TransactionDetailsModal;
