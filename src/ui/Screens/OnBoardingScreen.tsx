import { Image, View } from "react-native"
import { ImageAssets } from "../../assets";
import { TextComponent } from "../Components/TextComponent";
import ButtonComponent from "../Components/ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import { useExit } from "../../utils/hooks";



const OnBoardingScreen = () => {
    const navigation  = useNavigation();
    useExit();
    return(
        <View style={{flex:1, justifyContent: "space-between",backgroundColor: "#fff"}}>
            <View style={{backgroundColor: "#EEF8F7",flex:2, alignItems: "center", justifyContent: "center"}}>
                <Image  style={{height: "70%", width: "80%", marginTop: "25%"}} source={ImageAssets.manCoinDonut} />
            </View>
            <View style={{flex:1, alignItems: "center", justifyContent: "space-evenly"}}>
                <TextComponent value={`Spend Smarter \n \t\tSave More `} varient="bold" color="#438883" size="Large"/>
                <ButtonComponent value="Get Started" onPress={() => navigation.navigate("Home")} type="primary" />
                    <View style={{flexDirection: "row"}}>
                <TextComponent value={"Already have Account?"} varient="thin" size="ExtraSmall"/>
                <TextComponent value={" Login"} size="ExtraSmall" color="#438883"/>
                </View>
            </View>
        </View>
    )
};

export default OnBoardingScreen;