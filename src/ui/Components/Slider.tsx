import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextComponent } from './TextComponent';
import { COLORS } from '../Constants';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceMuted,
    marginTop: heightPercentageToDP(2),
    height: heightPercentageToDP(4),
    paddingHorizontal: widthPercentageToDP(1),
    paddingVertical: widthPercentageToDP(1),
    width: widthPercentageToDP(74),
    borderRadius: widthPercentageToDP(4),
    justifyContent: 'space-between',
  },
  slider: {
    width: widthPercentageToDP(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthPercentageToDP(2),
  },
});

type SliderProp = {
  name1: string;
  name2: string;
  toggle: boolean;
  setToggle: (value: boolean) => void;
};

export const Slider: React.FC<SliderProp> = ({
  name1,
  name2,
  toggle = false,
  setToggle,
}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => setToggle(false)}
        style={[styles.slider, !toggle && { backgroundColor: COLORS.surface }]}
      >
        <TextComponent value={name1} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setToggle(true)}
        style={[styles.slider, toggle && { backgroundColor: COLORS.surface }]}
      >
        <TextComponent value={name2} />
      </TouchableOpacity>
    </View>
  );
};
