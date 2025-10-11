import { FlatList, Image, View } from 'react-native';
import { ImageAssets } from '../../assets';
import { TextComponent } from './TextComponent';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';

const Data = [
  {
    name: 'Upwork',
    time: 'Today',
    amount: '850.00',
    icon: 'salary',
    type: 'InFlow',
  },
  {
    name: 'Transfer',
    time: 'Yesterday',
    amount: '85.00',
    icon: 'transfer',
    type: 'OutFlow',
  },
  {
    name: 'PayPal',
    time: 'Jan 30 2022',
    icon: 'payPal',
    amount: '1406.00',
    type: 'InFlow',
  },
  {
    name: 'Youtube',
    time: 'Jan 16 2022',
    icon : 'youtube',
    amount: '11.99',
    type: 'OutFlow',
  },
];

const TransactionComp = () => {
  return (
    <FlatList
      data={Data}
      renderItem={({ item }) => (
        <View
          style={{
            height: heightPercentageToDP(8),
            width: widthPercentageToDP(78),
            marginVertical: heightPercentageToDP(1),
            justifyContent: 'space-between',
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{
                height: heightPercentageToDP(6),
                width: heightPercentageToDP(6),
              }}
              source={ImageAssets[item.icon]}
            />
            <View style={{ justifyContent: 'space-between', paddingLeft: widthPercentageToDP(2) }}>
              <TextComponent value={item.name} />
              <TextComponent value={item.time} color={"#666666"}/>
            </View>
          </View>
          <TextComponent color={item.type === "InFlow" ? "#25A969" : "#F95B51"} varient='bold' size='GMedium' value={`${item.type === "InFlow" ? '+' : '-'}₹ ${item.amount}`}/>
        </View>
      )}
    />
  );
};

export default TransactionComp;
