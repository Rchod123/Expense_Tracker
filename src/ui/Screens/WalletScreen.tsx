import { FlatList, View } from 'react-native';
import ScreenHeader from '../Components/ScreenHeader';
import { TextComponent } from '../Components/TextComponent';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import { ColorScheme } from '../../utils/colors';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Slider } from '../Components/Slider';
import { useState } from 'react';
import TransactionComp from '../Components/TransactionComponent';
import UpcomingBillsComp from '../Components/UpcomingBillsComponent';

const section = [
  {
    name: 'Add',
    icon: 'plus',
  },
  {
    name: 'Pay',
    icon: 'qrcode',
  },
  {
    name: 'Send',
    icon: 'paper-plane',
  },
];

const WalletScreen = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <ScreenHeader value={'Wallet'} iconName="ellipsis" required={true} />
      <View style={{ alignItems: 'center' }}>
        <TextComponent value="Total Balance" varient="thin" />
        <TextComponent value="₹2,548.00" varient="bold" size="Large" />
        <FlatList
          data={section}
          horizontal
          style={{ marginTop: heightPercentageToDP(2) }}
          renderItem={({ item }) => (
            <View
              style={{ alignItems: 'center', gap: heightPercentageToDP(1) }}
            >
              <View
                style={{
                  height: heightPercentageToDP(6),
                  width: heightPercentageToDP(6),
                  marginHorizontal: widthPercentageToDP(6),
                  borderRadius: heightPercentageToDP(3),
                  borderWidth: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: ColorScheme.green,
                }}
              >
                <FontAwesome6
                  name={item.icon}
                  iconStyle="solid"
                  size={heightPercentageToDP(3)}
                  color={ColorScheme.green}
                />
              </View>
              <TextComponent value={item.name} />
            </View>
          )}
        />
        <Slider
          name1={'Transaction'}
          name2={'Upcoming Bills'}
          toggle={toggle}
          setToggle={setToggle}
        />
        {!toggle ? <TransactionComp /> : <UpcomingBillsComp />}

      </View>
    </View>
  );
};

export default WalletScreen;
