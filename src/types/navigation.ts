import type { NavigatorScreenParams } from '@react-navigation/native';
import type { TransactionType } from './domain';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  onBoarding: undefined;
  Register: undefined;
  Home: NavigatorScreenParams<TabParamList> | undefined;
  AddTransaction: { type: TransactionType };
  Security: undefined;
  Biometric: undefined;
  Chat: undefined;
  Account: undefined;
  PersonalProfile: undefined;
  Message: undefined;
  Privacy: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Analytics: undefined;
  QuickAdd: undefined;
  Wallet: undefined;
  Profile: undefined;
};
