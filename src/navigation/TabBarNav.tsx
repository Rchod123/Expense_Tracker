import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import HomePageScreen from '../ui/Screens/HomePageScreen';
import SplashScreen from '../ui/Screens/SplashScreen';
import OnBoardingScreen from '../ui/Screens/OnBoardingScreen';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { heightPercentageToDP } from '../utils/responsive';
import MainFloatingButton from '../ui/Components/FloatingButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import BillDetailsScreen from '../ui/Screens/BillDetailsScreen';
import WalletScreen from '../ui/Screens/WalletScreen';
import ProfileScreen from '../ui/Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#F8F7FB',
    borderRadius: 30,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
});

type TabIconProps = {
  name: 'house' | 'signal' | 'wallet' | 'user';
  focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({ name, focused }) => {

  return (
   
      <FontAwesome6
        name={name}
        iconStyle="solid"
        color={focused ? "blue" :'black'}
        size={focused ? heightPercentageToDP(3) : heightPercentageToDP(2)}
      />

  );
};

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { ...styles.tabContainer },
      tabBarShowLabel: false,
      headerShown: false,
    }}
  >
    <Tab.Screen
      name={'Tab1'}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon name="house" focused={focused} />,
      }}
      component={HomePageScreen}
    />
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon name="signal" focused={focused} />
        ),
      }}
      name={'Tab2'}
      component={SplashScreen}
    />

    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => (
          <View
            style={{
              paddingBottom: heightPercentageToDP(8),
            }}
          >
            <MainFloatingButton />
          </View>
        ),
      }}
      name={'Tab6'}
      component={HomePageScreen}
    />
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon name="wallet" focused={focused} />
        ),
      }}
      name={'Tab4'}
      component={WalletScreen}
    />
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
      }}
      name={'Tab3'}
      component={ProfileScreen}
    />
  </Tab.Navigator>
);

export default Tabs;
