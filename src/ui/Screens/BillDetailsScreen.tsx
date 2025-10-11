import { View, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import commonStyles from '../../utils/commonStyles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import ScreenHeader from '../Components/ScreenHeader';
import { ImageAssets } from '../../assets';
import { TextComponent } from '../Components/TextComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { useState } from 'react';

const styles = StyleSheet.create({
  paymentImageContainer: {
    backgroundColor: 'white',
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
    backgroundColor: '#fafafa',
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
    backgroundColor: 'white',
    borderWidth: 0.4,
    borderRadius: heightPercentageToDP(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentHighContainer: {
    backgroundColor: '#438883',
    height: heightPercentageToDP(1.5),
    width: widthPercentageToDP(3),
    borderRadius: heightPercentageToDP(1),
  },
});

const BillDetailsScreen = () => {
    const [payment,setPayment] = useState("credit");
  const HeaderRender = () => {
    return (
      <View style={styles.headerMainContainer}>
        <View style={styles.headerSubContainer}>
          <Image source={ImageAssets.youtube} />
        </View>
        <View style={{ gap: heightPercentageToDP(1) }}>
          <TextComponent
            value="Youtube Premium"
            size="MMedium"
            varient="medium"
          />
          <TextComponent value="Feb 28, 2022" />
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
    <View style={[styles.paymentMainContainer,
    selected ? {backgroundColor: "#438883",    borderWidth: 0,}:
    {    backgroundColor : '#fafafa',borderWidth: 0.4}]}>
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
      <ScreenHeader value={'Bill Details'} iconName="ellipsis" required={true} />
      <View
        style={{
          flex: 3,
          backgroundColor: 'white',
          paddingHorizontal: widthPercentageToDP(10),
        }}
      >
        <HeaderRender />
        <PriceTag name="Price" amount="11.99" />
        <PriceTag name="Fee" amount="1.99" />
        <View style={{ borderWidth: 0.5, borderBottomColor: '#fafafa' }} />
        <PriceTag name="Total" amount="13.98" />
        <View style={{ height: heightPercentageToDP(2) }} />
        <TextComponent
          value="Select Payment method"
          size="GMedium"
          varient="medium"
        />
        <View style={{ height: heightPercentageToDP(1) }} />
        <View style={{ gap: heightPercentageToDP(2) }}>
          <PaymentSelection name="Debit Card" selected={payment === "Debit Card"} image={ImageAssets.creditCard}/>
          <PaymentSelection name="Paypal" selected={payment === "Paypal"} image={ImageAssets.payPal}/>
        </View>
        <View
          style={{ alignItems: 'center', paddingTop: heightPercentageToDP(2) }}
        >
          <ButtonComponent
            value={'Pay Now'}
            onPress={() => {}}
            type={'primary'}
          />
        </View>
      </View>
    </>
  );
};

export default BillDetailsScreen;
