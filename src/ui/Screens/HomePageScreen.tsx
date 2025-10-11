import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from '../Components/TextComponent';
import BalanceCard from '../Components/BalanceCard';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/responsive';
import { useExit } from '../../utils/hooks';
import commonStyles from '../../utils/commonStyles';
import TransactionComp from '../Components/TransactionComponent';

const styles = StyleSheet.create({
  subContainer: {
    height: widthPercentageToDP(14),
    width: widthPercentageToDP(14),
    borderColor: 'black',
    borderWidth: 0.167,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthPercentageToDP(4),
    backgroundColor: '#2A7C76',
  },
});

const HomePageScreen = () => {

  useExit();
  return (
    <>
      <View style={[commonStyles.mainContainer, commonStyles.radius]}>
        <View>
          <TextComponent value="Good Morning," size="Small" color="white" />
          <TextComponent
            value="Rajesh Chodavarapu"
            varient="bold"
            color="white"
          />
        </View>
        <View style={styles.subContainer}>
          <FontAwesome6
            name="bell"
            iconStyle="regular"
            size={25}
            color={'white'}
          />
          <FontAwesome6
            name="circle"
            iconStyle="solid"
            size={10}
            color={'#FFAB7B'}
            style={{ position: 'absolute', right: 12, top: 14 }}
          />
        </View>
      </View>
      <View style={{position: "absolute", top: heightPercentageToDP(20), left: widthPercentageToDP(10)}}>
        <BalanceCard />
      </View>
      <View style={{flex:0.8}}></View>
      <View style={{ flex: 2, paddingLeft: widthPercentageToDP(10), paddingHorizontal: widthPercentageToDP(4), backgroundColor: "#fff" }}>
        <View style={{flexDirection: "row", justifyContent:"space-between"}}>
          <TextComponent value='Transactions'  size='MMedium' varient='bold'/>
           <TextComponent value='See all'  size='Small' varient='thin'/>
        </View>
       <TransactionComp />
      </View>
    </>
  );
};

export default HomePageScreen;
