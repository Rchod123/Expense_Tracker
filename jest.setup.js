/* eslint-env jest */

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(async () => ({
      isConnected: true,
      isInternetReachable: true,
    })),
    addEventListener: jest.fn(() => jest.fn()),
  },
}));

jest.mock('react-native-encrypted-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  },
}));

jest.mock('@react-native-vector-icons/fontawesome6', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Icon = (props) => React.createElement(Text, props, props.name);
  return { __esModule: true, default: Icon, FontAwesome6: Icon };
});
