import { StyleSheet } from 'react-native';
import { COLORS } from '../ui/Constants';
import { heightPercentageToDP, widthPercentageToDP } from './responsive';

const commonStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.brand,
  },
  radius: {
    borderBottomLeftRadius: heightPercentageToDP(6),
    borderBottomRightRadius: heightPercentageToDP(6),
    paddingHorizontal: widthPercentageToDP(6),
  },
});


export default commonStyles;
