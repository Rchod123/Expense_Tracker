import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";


export function useExit(){
    useEffect(() => {
        const onBackPress = () => {
            Alert.alert(
                'Exit App',
                'Do you want to exit?',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Yes', onPress: () => BackHandler.exitApp()},
                ],
                {cancelable: false}
            );
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => backHandler.remove();
    },[]);
}