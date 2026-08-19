import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  type ImageSourcePropType,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import ScreenHeader from '../Components/ScreenHeader';
import { ImageAssets } from '../../assets';
import { TextComponent } from '../Components/TextComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { useState } from 'react';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';

const styles = StyleSheet.create({
  paymentImageContainer: {
    backgroundColor: COLORS.surface,
    width: widthPercentageToDP(14),
    alignItems: 'center',
    height: heightPercentageToDP(6),
    justifyContent: 'center',
    borderRadius: widthPercentageToDP(6),
    flexDirection: 'row',
  },
  headerMainContainer: {
    flexDirection: 'row',
    gap: widthPercentageToDP(6),
    alignItems: 'center',
    paddingBottom: heightPercentageToDP(3),
  },
  headerSubContainer: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(20),
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: heightPercentageToDP(2),
    borderWidth: 0.4,
  },
  paymentMainContainer: {

    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: widthPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),

  },
  paymentRadioContainer: {
    height: heightPercentageToDP(2.5),
    width: widthPercentageToDP(5.5),
    backgroundColor: COLORS.surface,
    borderWidth: 0.4,
    borderRadius: heightPercentageToDP(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentHighContainer: {
    backgroundColor: COLORS.info,
    height: heightPercentageToDP(1.5),
    width: widthPercentageToDP(3),
    borderRadius: heightPercentageToDP(1),
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    marginTop: -heightPercentageToDP(6),
    borderRadius: RADIUS.xl,
    paddingHorizontal: widthPercentageToDP(10),
    paddingVertical: SPACING.xl,
    ...SHADOWS.card,
  },
  sectionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
});

const BillDetailsScreen = () => {
  const [payment, setPayment] = useState('credit');
  const HeaderRender = () => {
    return (
        <View style={styles.headerMainContainer}>
          <View style={styles.headerSubContainer}>
            <Image source={ImageAssets.youtube} />
          </View>
          <View style={{ gap: heightPercentageToDP(1) }}>
            <TextComponent
              value={STRINGS.billDetails.merchant}
              size="MMedium"
              varient="medium"
            />
            <TextComponent value={STRINGS.billDetails.date} />
          </View>
        </View>
      );
  };

  type PriceTagProps = {
    name: string;
    amount: string;
  };
  const PriceTag: React.FC<PriceTagProps> = ({ name, amount }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: heightPercentageToDP(1),
        }}
      >
        <TextComponent value={name} size="MMedium" />
        <TextComponent value={`₹ ${amount}`} varient="bold" />
      </View>
    );
  };

  type PaymentSelectionProp = {
    name: string,
    image: ImageSourcePropType,
    selected: boolean,
  }
  const PaymentSelection : React.FC<PaymentSelectionProp> = ({name,image,selected}) => (
    <View
      style={[
        styles.paymentMainContainer,
        selected
          ? { backgroundColor: COLORS.info, borderWidth: 0 }
          : { backgroundColor: COLORS.surfaceMuted, borderWidth: 0.4 },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: heightPercentageToDP(1),
        }}
      >
        <View style={styles.paymentImageContainer}>
          <Image source={image} />
        </View>
        <TextComponent value={name} size="MMedium" varient="medium" />
      </View>

      <TouchableOpacity style={styles.paymentRadioContainer} onPress={() => setPayment(name)}>
        {selected && <View style={styles.paymentHighContainer} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ScreenHeader
        value={STRINGS.billDetails.title}
        iconName="ellipsis"
        required={true}
      />
      <View
        style={styles.content}
      >
        <HeaderRender />
        <PriceTag name={STRINGS.billDetails.price} amount="11.99" />
        <PriceTag name={STRINGS.billDetails.fee} amount="1.99" />
        <View style={styles.sectionDivider} />
        <PriceTag name={STRINGS.billDetails.total} amount="13.98" />
        <View style={{ height: heightPercentageToDP(2) }} />
        <TextComponent
          value={STRINGS.billDetails.paymentMethod}
          size="GMedium"
          varient="medium"
        />
        <View style={{ height: heightPercentageToDP(1) }} />
        <View style={{ gap: heightPercentageToDP(2) }}>
          <PaymentSelection
            name={STRINGS.billDetails.debitCard}
            selected={payment === STRINGS.billDetails.debitCard}
            image={ImageAssets.creditCard}
          />
          <PaymentSelection
            name={STRINGS.billDetails.paypal}
            selected={payment === STRINGS.billDetails.paypal}
            image={ImageAssets.payPal}
          />
        </View>
        <View
          style={{ alignItems: 'center', paddingTop: heightPercentageToDP(2) }}
        >
          <ButtonComponent
            value={STRINGS.billDetails.payNow}
            onPress={() => {}}
            type="primary"
          />
        </View>
      </View>
    </>
  );
};

export default BillDetailsScreen;
