import { ScrollView, View } from 'react-native';
import ScreenHeader from '../Components/ScreenHeader';
import { TextComponent } from '../Components/TextComponent';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/responsive';
import { Slider } from '../Components/Slider';
import { useState } from 'react';
import TransactionComp from '../Components/TransactionComponent';
import type { TransactionListItem } from '../Components/TransactionComponent';
import TransactionDetailsModal from '../Components/TransactionDetailsModal';
import UpcomingBillsComp from '../Components/UpcomingBillsComponent';
import { useRealmData } from '../../utils/commonHooks';
import { formatCurrency } from '../../utils/currency';
import { STRINGS } from '../Constants';
import { useTheme } from '../../context/themeContext';

const WalletScreen = () => {
  const { colors } = useTheme();
  const [toggle, setToggle] = useState(false);
  const { totalIncome, transactionData } = useRealmData();
  const expense = transactionData();
  const { income, expenses } = totalIncome();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionListItem | null>(null);
  return (
    <View style={{ backgroundColor: colors.surfaceMuted, flex: 1 }}>
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
        <ScrollView
          style={{
            height: heightPercentageToDP(56),
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
        </ScrollView>
      </View>
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </View>
  );
};

export default WalletScreen;
