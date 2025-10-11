import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2A7C76",
    },
    textStyle: {
        color: "#fff",
        fontSize: 50,
        fontWeight: "bold"
    }
})

const SplashScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("Login");
        },2000)
    },[])

    return(
        <View style={styles.mainContainer}>
            <Text style={styles.textStyle}>mono</Text>
        </View>
    )
};

export default SplashScreen;