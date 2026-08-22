import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ImageAssets } from '../../assets';
import { RADIUS, STRINGS } from '../Constants';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/responsive';
import { TextComponent } from './TextComponent';
import { useTheme } from '../../context/themeContext';

type UpcomingBill = {
  name: string;
  time: string;
  icon: keyof typeof ImageAssets;
};

const data: UpcomingBill[] = [
  { name: 'Youtube', time: 'Feb 28 2022', icon: 'youtube' },
  { name: 'Electricity', time: 'Mar 28 2022', icon: 'electricity' },
  { name: 'House Rent', time: 'Mar 31 2022', icon: 'house' },
  { name: 'Spotify', time: 'Feb 28 2022', icon: 'spotify' },
];

const styles = StyleSheet.create({
  row: {
    height: heightPercentageToDP(6),
    marginVertical: heightPercentageToDP(1),
    width: widthPercentageToDP(78),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    gap: heightPercentageToDP(1),
  },
  image: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(10),
  },
  copy: {
    paddingLeft: widthPercentageToDP(1),
  },
  payButton: {
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
  },
});

const UpcomingBillsComp = () => {
  const { colors } = useTheme();
  return (
    <FlatList
      data={data}
      keyExtractor={item => `${item.name}-${item.time}`}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.left}>
            <Image
              resizeMode="stretch"
              style={styles.image}
              source={ImageAssets[item.icon]}
            />
            <View style={styles.copy}>
              <TextComponent value={item.name} />
              <TextComponent value={item.time} color={colors.textSecondary} />
            </View>
          </View>
          <TouchableOpacity style={[styles.payButton,{backgroundColor: colors.chip,}]}>
            <TextComponent value={STRINGS.common.pay} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default UpcomingBillsComp;
