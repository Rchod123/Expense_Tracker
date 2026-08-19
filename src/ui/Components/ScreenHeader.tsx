import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from './TextComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../Constants';

const styles = StyleSheet.create({
  radius: {
    height: heightPercentageToDP(7.5),
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: heightPercentageToDP(3),
    borderTopRightRadius: heightPercentageToDP(3),
  },
  container: {
    backgroundColor: COLORS.brandStrong,
    paddingTop: heightPercentageToDP(1.5),
    height: heightPercentageToDP(22),
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  glowLeft: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -80,
    left: -48,
  },
  glowRight: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -52,
    right: -30,
  },
  row: {
    paddingHorizontal: widthPercentageToDP(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightPercentageToDP(8),
    alignItems: 'center',
    gap: widthPercentageToDP(2),
    zIndex: 1,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP(2),
  },
});

const Icon = ({
  name,
  size,
}: {
  name: 'chevron-left' | 'ellipsis';
  size: number;
}) => (
  <FontAwesome6
    name={name}
    iconStyle="solid"
    color={'white'}
    size={heightPercentageToDP(size)}
  />
);

type ScreenHeaderProps = {
  value: string;
  onPress?: () => void;
  iconName?: 'ellipsis';
  required: boolean;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  value,
  iconName,
  onPress,
  required = false,
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glowLeft} />
      <View style={styles.glowRight} />
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Icon name="chevron-left" size={2} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <TextComponent
            value={value}
            color={COLORS.surface}
            size="MMedium"
            variant="bold"
          />
        </View>
        <TouchableOpacity
          onPress={onPress ?? (() => navigation.goBack())}
          style={styles.iconButton}
        >
          {iconName && <Icon name={iconName} size={3} />}
        </TouchableOpacity>
      </View>
      {required && <View style={styles.radius} />}
    </SafeAreaView>
  );
};

export default ScreenHeader;
