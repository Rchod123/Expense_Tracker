import { View } from 'react-native';
import ScreenHeader from '../Components/ScreenHeader';
import { TextComponent } from '../Components/TextComponent';
import { widthPercentageToDP } from '../../utils/responsive';
import { Slider } from '../Components/Slider';
import { useState } from 'react';
import TransactionComp from '../Components/TransactionComponent';
import type { TransactionListItem } from '../Components/TransactionComponent';
import TransactionDetailsModal from '../Components/TransactionDetailsModal';
import UpcomingBillsComp from '../Components/UpcomingBillsComponent';
import { useRealmData } from '../../utils/commonHooks';
import { formatCurrency } from '../../utils/currency';
import { COLORS, STRINGS } from '../Constants';

const WalletScreen = () => {
  const [toggle, setToggle] = useState(false);
  const { totalIncome, transactionData } = useRealmData();
  const expense = transactionData();
  const { income, expenses } = totalIncome();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionListItem | null>(null);
  return (
    <View style={{ backgroundColor: COLORS.surface, height: '100%' }}>
      <ScreenHeader value={STRINGS.wallet.title} required showBackButton={false} />
      <View style={{ alignItems: 'center' }}>
        <TextComponent value={STRINGS.wallet.totalBalance} varient="thin" />
        <TextComponent
          value={`${formatCurrency(income - expenses)}`}
          varient="bold"
          size="Large"
        />
        <Slider
          name1={STRINGS.wallet.transactions}
          name2={STRINGS.wallet.upcomingBills}
          toggle={toggle}
          setToggle={setToggle}
        />
        <View
          style={{
            width: widthPercentageToDP(80),
            margin: widthPercentageToDP(2),
          }}
        >
          {!toggle ? (
            <TransactionComp
              transactions={expense.map(item => ({
                ui: item.ui as keyof typeof import('../../assets').ImageAssets,
                title: item.title,
                type: item.type as any,
                description: item.description,
                amount: item.amount,
                date: item.date,
              }))}
              scrollEnabled={true}
              onPress={setSelectedTransaction}
            />
          ) : (
            <UpcomingBillsComp />
          )}
        </View>
      </View>
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </View>
  );
};

export default WalletScreen;
