import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SplashScreen  from "./src/ui/Screens/SplashScreen";
import OnBoardingScreen from "./src/ui/Screens/OnBoardingScreen";
import Tabs from "./src/navigation/TabBarNav";
import AddTransactionScreen from "./src/ui/Screens/AddTransactionScreen";


const Stack = createNativeStackNavigator();


const App = () => {

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen}/>
      <Stack.Screen name="Login" component={OnBoardingScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Home" component={Tabs} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  );
};


export default function Main(){
  return(
    <NavigationContainer>
      <App />
    </NavigationContainer>
  )
};
