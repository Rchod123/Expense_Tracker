import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { ImageAssets } from '../../assets';
import { formatCurrency } from '../../utils/currency';
import { TextComponent } from './TextComponent';
import { TransactionType } from '../../types/domain';
import { COLORS, RADIUS, STRINGS } from '../Constants';

type TransactionLike = {
  ui: keyof typeof ImageAssets;
  title: string;
  type: TransactionType;
  amount: number;
  date: string | Date;
};

type TransactionProps = {
  transactions?: TransactionLike[];
  scrollEnabled?: boolean;
  emptyMessage?: string;
};

const formatDate = (date: Date | string): string => {
  const dateValue = new Date(date);
  const today = new Date().toISOString().slice(0, 10);
  const newDate = dateValue.toISOString().slice(0, 10);
  if (newDate === today) {
    return STRINGS.common.today;
  }
  return new Date(`${newDate}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const TransactionComp: React.FC<TransactionProps> = ({
  transactions = [],
  scrollEnabled = true,
  emptyMessage = 'No transactions yet',
}) => (
  <FlatList
    data={transactions}
    scrollEnabled={scrollEnabled}
    showsVerticalScrollIndicator={false}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    ListEmptyComponent={
      <View style={styles.emptyState}>
        <TextComponent value={emptyMessage} size="Small" color="#7A8787" />
        <TextComponent
          value={STRINGS.transaction.emptySubtitle}
          size="ExtraSmall"
          color="#A0AAAA"
        />
      </View>
    }
    renderItem={({ item }) => {
      const isIncome = item.type === 'income';
      const asset = ImageAssets[item.ui as keyof typeof ImageAssets];
      return (
        <View style={styles.row}>
          <View style={styles.merchant}>
            <View style={styles.logoWrap}>
              {asset ? (
                <Image
                  style={styles.logo}
                  source={asset}
                  resizeMode="contain"
                />
              ) : (
                <TextComponent
                  value={item.type.slice(0, 1)}
                  size="Small"
                  variant="bold"
                  color={COLORS.brandStrong}
                />
              )}
            </View>
            <View style={styles.merchantCopy}>
              <TextComponent value={item.title} size="Small" variant="bold" />
              <TextComponent
                value={formatDate(item.date)}
                size="ExtraSmall"
                color={COLORS.textSecondary}
              />
            </View>
          </View>
          <View style={styles.amount}>
            <TextComponent
              color={isIncome ? COLORS.success : COLORS.danger}
              variant="bold"
              size="Small"
              value={`${isIncome ? '+' : '-'}${formatCurrency(item.amount)}`}
            />
            <TextComponent
              value={isIncome ? STRINGS.common.income : STRINGS.common.expense}
              size="ExtraSmall"
              color={COLORS.textMuted}
            />
          </View>
        </View>
      );
    }}
  />
);

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  merchant: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 28, height: 28, borderRadius: 8 },
  merchantCopy: { flex: 1, minWidth: 0, marginLeft: 11, gap: 3 },
  amount: { alignItems: 'flex-end', marginLeft: 12, gap: 3 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#E9EEEE' },
  emptyState: {
    minHeight: 128,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});

export default TransactionComp;
