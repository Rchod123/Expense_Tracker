import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from './TextComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/themeContext';

const styles = StyleSheet.create({
  radius: {
    height: heightPercentageToDP(7.5),
    borderTopLeftRadius: heightPercentageToDP(3),
    borderTopRightRadius: heightPercentageToDP(3),
  },
  container: {

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
  iconPlaceholder: { width: 42, height: 42 },
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
  required?: boolean;
  showBackButton?: boolean;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  value,
  iconName,
  onPress,
  required = false,
  showBackButton = true,
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.brandStrong }]}>
      <View style={styles.glowLeft} />
      <View style={styles.glowRight} />
      <View style={styles.row}>
        {showBackButton ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
            }}
            style={styles.iconButton}
          >
            <Icon name="chevron-left" size={2} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
        <View style={styles.titleWrap}>
          <TextComponent
            value={value}
            color={colors.surface}
            size="MMedium"
            variant="bold"
          />
        </View>
        {iconName || onPress ? (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onPress}
            style={styles.iconButton}
          >
            {iconName && <Icon name={iconName} size={3} />}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
      {required && <View style={[styles.radius,{backgroundColor: colors.surface}]} />}
    </SafeAreaView>
  );
};

export default ScreenHeader;
