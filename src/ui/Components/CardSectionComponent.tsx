import { View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from './TextComponent';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/responsive';
import { COLORS, STRINGS } from '../Constants';

type CardSectionProp = {
  type: 'up' | 'down';
  value: string;
};

const CardSectionComponent: React.FC<CardSectionProp> = ({ type, value }) => {
  return (
    <View style={{ gap: heightPercentageToDP(1) }}>
      <View style={{ flexDirection: 'row', gap: widthPercentageToDP(1) }}>
        <View
          style={[
            {
              height: heightPercentageToDP(2),
              width: widthPercentageToDP(5),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: heightPercentageToDP(1),
            },
            { backgroundColor: type === 'up' ? COLORS.success : COLORS.danger },
          ]}
        >
          <FontAwesome6
            name={type === 'up' ? 'arrow-down' : 'arrow-up'}
            iconStyle="solid"
            color={COLORS.surface}
          />
        </View>
        <TextComponent value={value} color={COLORS.surface} />
      </View>
      <TextComponent
        variant="bold"
        value={STRINGS.common.sampleAmount}
        color={COLORS.surface}
      />
    </View>
  );
};


export default CardSectionComponent;
