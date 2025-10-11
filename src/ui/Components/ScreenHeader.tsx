import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from './TextComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  radius: {
    height: heightPercentageToDP(8),
    backgroundColor: 'white',

    borderTopLeftRadius: heightPercentageToDP(3),
    borderTopRightRadius: heightPercentageToDP(3),
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
  iconName: 'ellipsis';
  required: boolean;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ value, iconName,required = false }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#2A7C76',
        paddingTop: heightPercentageToDP(2),
        height: heightPercentageToDP(24),
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          paddingHorizontal: widthPercentageToDP(4),
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: heightPercentageToDP(8),
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={2} />
        </TouchableOpacity>
        <TextComponent
          value={value}
          color="white"
          size="Medium"
          varient="bold"
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={iconName} size={3} />
        </TouchableOpacity>
      </View>
     {required &&  <View style={styles.radius} />}
    </SafeAreaView>
  );
};

export default ScreenHeader;
