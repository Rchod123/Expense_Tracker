import { StyleSheet } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from './responsive';

const commonStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#2A7C76',
  },
  radius: {
    borderBottomLeftRadius: heightPercentageToDP(6),
    borderBottomRightRadius: heightPercentageToDP(6),
    paddingHorizontal: widthPercentageToDP(6),
  }
});


export default commonStyles;