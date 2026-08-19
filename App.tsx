import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import SplashScreen  from "./src/ui/Screens/SplashScreen";
import OnBoardingScreen from "./src/ui/Screens/OnBoardingScreen";
import Tabs from "./src/navigation/TabBarNav";
import AddTransactionScreen from "./src/ui/Screens/AddTransactionScreen";
import type { RootStackParamList } from './src/types/navigation';
import { RealmProvider } from "@realm/react";
import { Task } from "./src/db/schema/Task";
import { Expense } from "./src/db/schema/Expense";
import { Category } from "./src/db/schema/Categories";
import { useExpenseSync } from "./src/utils/apiHooks";
import { AuthProvider } from "./src/context/authContext";
import { LoginScreen } from "./src/ui/Screens/LoginScreen";
import { RegisterScreen } from "./src/ui/Screens/RegisterScreen";
import SecurityScreen from "./src/ui/Screens/SecurityScreen";
import PINScreen from "./src/ui/Screens/BIometricScreen";
import ChatScreen from "./src/ui/Screens/ChatScreen";
import AccountInfoScreen from "./src/ui/Screens/AccountInfoScreen";
import PersonalProfileScreen from "./src/ui/Screens/ProfileInfoScreen";
import MessageCenterScreen from "./src/ui/Screens/MessageCenterScreen";
import DataPrivacyScreen from "./src/ui/Screens/DataPrivacyScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

const SyncBootstrap = () => {
  useExpenseSync();
  return null;
};

const App = () => {

  return (
    <RealmProvider deleteRealmIfMigrationNeeded schema={[Task,Expense,Category]}>
    <SyncBootstrap />
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen}/>
      <Stack.Screen name="onBoarding" component={OnBoardingScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Home" component={Tabs} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Biometric" component={PINScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Account" component={AccountInfoScreen} />
      <Stack.Screen name="PersonalProfile" component={PersonalProfileScreen} />
      <Stack.Screen name="Message" component={MessageCenterScreen} />
      <Stack.Screen name="Privacy" component={DataPrivacyScreen} />
    </Stack.Navigator>
    </RealmProvider>
  );
};


export default function Main(){
  return(
    <SafeAreaProvider>
      <AuthProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  )
};
