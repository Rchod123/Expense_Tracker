import { Image, TouchableOpacity, View } from 'react-native';
import { ImageAssets } from '../../assets';
import { TextComponent } from '../Components/TextComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useExit } from '../../utils/hooks';
import type { RootStackParamList } from '../../types/navigation';
import { COLORS, STRINGS } from '../Constants';

const OnBoardingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useExit();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.brandLighter,
          flex: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          style={{ height: '70%', width: '80%', marginTop: '25%' }}
          source={ImageAssets.manCoinDonut}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <TextComponent
          value={STRINGS.onboarding.headline}
          varient="bold"
          color={COLORS.info}
          size="Large"
        />
        <ButtonComponent
          value={STRINGS.onboarding.cta}
          onPress={() => navigation.navigate('Register')}
          type="primary"
        />
        <View style={{ flexDirection: 'row' }}>
          <TextComponent
            value={STRINGS.onboarding.signInPrompt}
            varient="thin"
            size="ExtraSmall"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <TextComponent
              value={` ${STRINGS.onboarding.signInLink}`}
              size="ExtraSmall"
              color={COLORS.info}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
