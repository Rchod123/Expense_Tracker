import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { TextComponent } from "./TextComponent";

type ButtonProps = {
    value : string,
    onPress : () => void,
    type: "primary" | "secondary"
}

const styles = StyleSheet.create({
    mainContainer: {
        height: 60,
        width: 350,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30
    }
})

const ButtonComponent : React.FC<ButtonProps> = ({value,onPress,type}) => {

    const colorSet = {
        "primary": {
            background : "#438883",
            textColor : "#fff",
            width: 0,
            lineColor: "#408782",
        },
        "secondary": {
            background : "#fff",
            textColor : "#438883",
            width: 1,
            lineColor: "#408782",
        }
    }
    return(
        <TouchableOpacity onPress={onPress} style={[styles.mainContainer,{backgroundColor: colorSet[type].background, borderWidth: colorSet[type].width, borderColor: colorSet[type].lineColor}]}>
            <TextComponent value={value} varient="bold" color={colorSet[type].textColor}/>
            
        </TouchableOpacity>
    )
};


export default ButtonComponent;