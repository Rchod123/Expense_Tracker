import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { ImageAssets } from "../../assets"
import { heightPercentageToDP, widthPercentageToDP } from "../../utils/responsive";
import { TextComponent } from "./TextComponent";


const data = [
    {
        name: "Youtube",
        time: "Feb 28 2022",
        icon: "youtube",
    },
    {
        name: "Electricity",
        time : "Mar 28 2022",
        icon: "electricity",
    },
    {
        name: "House Rent",
        time: "Mar 31 2022",
        icon: "house",
    },
    {
        name: "Spotify",
        time: "Feb 28 2022",
        icon: "spotify"
    }
]

const UpcomingBillsComp = () => {

    return(
        <FlatList 
         data={data}
         renderItem={({item}) => (
            <View style={{height: heightPercentageToDP(6), marginVertical: heightPercentageToDP(1), width: widthPercentageToDP(78), alignItems: "center", flexDirection: "row",justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", gap: heightPercentageToDP(1)}}>
                <Image resizeMode="stretch" style={{height: heightPercentageToDP(5), width: widthPercentageToDP(10)}} source={ImageAssets[item.icon]} />
                <View style={{paddingLeft: widthPercentageToDP(1)}}>
                    <TextComponent value={item.name} />
                    <TextComponent value={item.time} color={"#666666"}/>
                </View>
                </View>
                <TouchableOpacity style={{height: heightPercentageToDP(4), width: widthPercentageToDP(16), backgroundColor: "#ECF9F8", alignItems:"center", justifyContent: "center", borderRadius: heightPercentageToDP(2)}}>
                    <TextComponent value="Pay" />
                </TouchableOpacity>
            </View>
         )}
        />
    )
};

export default UpcomingBillsComp;