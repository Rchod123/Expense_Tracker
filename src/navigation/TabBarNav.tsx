import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import HomePageScreen from '../ui/Screens/HomePageScreen';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { heightPercentageToDP } from '../utils/responsive';
import MainFloatingButton from '../ui/Components/FloatingButton';
import WalletScreen from '../ui/Screens/WalletScreen';
import ProfileScreen from '../ui/Screens/ProfileScreen';
import type { TabParamList } from '../types/navigation';
import { StatisticsScreen } from '../ui/Screens/StatisticsScreen';
import { COLORS } from '../ui/Constants';
import { useTheme } from '../context/themeContext';

const Tab = createBottomTabNavigator<TabParamList>();

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});

type TabIconProps = {
  name: 'house' | 'signal' | 'wallet' | 'user';
  focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({ name, focused }) => {
  const { colors } = useTheme();
  return (
    <FontAwesome6
      name={name}
      iconStyle="solid"
      color={focused ? colors.info : colors.textPrimary}
      size={focused ? heightPercentageToDP(3) : heightPercentageToDP(2)}
    />
  );
};

const Tabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { ...styles.tabContainer, backgroundColor: colors.surface },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
    <Tab.Screen
      name="Dashboard"
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
      name="Analytics"
      component={StatisticsScreen}
    />

    <Tab.Screen
      options={{
        tabBarIcon: () => (
          <View
            style={{
              paddingBottom: heightPercentageToDP(8),
            }}
          >
            <MainFloatingButton />
          </View>
        ),
      }}
      name="QuickAdd"
      component={HomePageScreen}
    />
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon name="wallet" focused={focused} />
        ),
      }}
      name="Wallet"
      component={WalletScreen}
    />
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
      }}
      name="Profile"
      component={ProfileScreen}
    />
    </Tab.Navigator>
  );
};

export default Tabs;
