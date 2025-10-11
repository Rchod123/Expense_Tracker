import { View } from "react-native"
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from "./TextComponent";
import { heightPercentageToDP, widthPercentageToDP } from "../../utils/responsive";

type CardSectionProp = {
    type: "up" | "down",
    value: string,
}

const CardSectionComponent : React.FC<CardSectionProp> = ({type, value}) => {
    return(
        <View style={{gap: heightPercentageToDP(1)}}>
        <View style={{flexDirection: "row", gap: widthPercentageToDP(1)}}>
            <View style={[{ height: heightPercentageToDP(2), width: widthPercentageToDP(5), justifyContent: "center", alignItems: "center", borderRadius: heightPercentageToDP(1)},{backgroundColor: type === "up" ? "green": "red"}]}>
                <FontAwesome6 name={ type === "up" ? "arrow-down" : "arrow-up"} iconStyle="solid" color={"white"}/>
            </View>
            <TextComponent value={value} color="white" />
        </View>
        <TextComponent varient="bold" value={"₹ 1800.00"} color="white" />
        </View>
    )
};


export default CardSectionComponent;