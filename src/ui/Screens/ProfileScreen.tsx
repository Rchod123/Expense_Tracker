import { FlatList, Image, TouchableOpacity, View } from "react-native"
import ScreenHeader from "../Components/ScreenHeader"
import { heightPercentageToDP, widthPercentageToDP } from "../../utils/responsive";
import { ImageAssets } from "../../assets";
import { TextComponent } from "../Components/TextComponent";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";


const data = [
    {
        name: "Invite Friends",
        icon: "user-plus",
    },
    {
        name: "Account Info",
        icon: "user",
    },
    {
        name: "Personal profile",
        icon: "users",
    },
    {
        name: "message center",
        icon: "inbox",
    },
    {
        name: "login and security",
        icon: "shield-halved",
    },
    {
        name: "Data and privacy",
        icon: "file-shield",
    }
]

const ProfileScreen = () => {
    return(
        <View style={{backgroundColor:"white" }}>
            <ScreenHeader value={"Profile"} iconName={"ellipsis"} required={false} />
            <View style={{backgroundColor: "white", height: heightPercentageToDP(12), width: widthPercentageToDP(26), alignSelf: "center", borderRadius: heightPercentageToDP(6), top: -heightPercentageToDP(6),justifyContent: "center",borderWidth: 0.2}}>
                <Image source={ImageAssets.manCoinDonut} style={{height: heightPercentageToDP(10), width: widthPercentageToDP(18), alignSelf:"center"}} />
            </View>
            <View style={{alignItems: 'center',top: -heightPercentageToDP(4)}}>
                <TextComponent varient="bold" size="MMedium" value="Rajesh Chodavarapu" />
                <TextComponent value="@rajesh_nani" color="#438883" />
            </View>
            <FlatList 
            data={data}
            ItemSeparatorComponent={() => <View style={{height:heightPercentageToDP(0.3)}}/>}
            renderItem={({item}) => (
                <TouchableOpacity style={{height: heightPercentageToDP(8),paddingLeft: widthPercentageToDP(10),flexDirection: "row", gap: widthPercentageToDP(4), alignItems: "center"}}>
                    <View style={{height: heightPercentageToDP(4), width: widthPercentageToDP(10), backgroundColor: "#F0F6F5", alignItems: "center", justifyContent : "center", borderRadius: widthPercentageToDP(2)}}>
                        <FontAwesome6 
                        iconStyle="solid"
                        size={heightPercentageToDP(3)}
                        name={item.icon}
                        />
                    </View>
                    <TextComponent value={item.name} />
                </TouchableOpacity>
            )}
            />
        </View>
    )
};


export default ProfileScreen;