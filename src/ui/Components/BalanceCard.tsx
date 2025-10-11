import { View } from "react-native"
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { heightPercentageToDP, widthPercentageToDP } from "../../utils/responsive";
import { TextComponent } from "./TextComponent";
import CardSectionComponent from "./CardSectionComponent";

const BalanceCard = () => {
    return(
        <View style={{height: heightPercentageToDP(24), width: widthPercentageToDP(80), backgroundColor: "#1B5C58", borderRadius: widthPercentageToDP(4)}}>
            <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: widthPercentageToDP(2), paddingVertical: heightPercentageToDP(2)}}>
                <View>
                    <TextComponent value="Total Balance ^" size="Small" color="#fff" />
                    <TextComponent value="₹ 2,548.00" size="MidSection" varient="bold" color="#fff" />
                </View>
                <FontAwesome6 name="ellipsis" iconStyle="solid" color={"white"} size={heightPercentageToDP(3)}/>
            </View>
            <View style={{paddingHorizontal: widthPercentageToDP(2), flexDirection: "row", justifyContent: "space-between", paddingVertical: heightPercentageToDP(4)}}>
                <CardSectionComponent type="up" value="Income"/>
                <CardSectionComponent type="down" value="Expenses"/>
            </View>
        </View>
    )
};

export default BalanceCard;