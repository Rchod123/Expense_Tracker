import React from 'react';
import { View, Text } from 'react-native';

type TextProps = {
  value: string;
  varient?: 'medium' | 'bold' | 'thin' | 'default';
  color?: string;
  size?: 'Large' | 'ExtraLarge' | 'Medium' | 'Small' | 'ExtraSmall' | 'MidSection' | 'GMedium' | 'MMedium';
};

const fontSize = (varient: TextProps['varient']) => {
  switch (varient) {
    case 'bold':
      return '800';
    case 'medium':
      return '500';
    case 'thin':
      return '300';
    default:
      return '400';
  }
};

const fontValue = (value: TextProps['size']) => {
  switch (value) {
    case 'ExtraLarge':
      return 42;
    case 'Large':
      return 36;
    case "MidSection":
        return 28;
    case "GMedium":
        return 20;
    case "MMedium":
        return 18;
    case 'Small':
      return 14;
    case 'ExtraSmall':
      return 12;
    default:
      return 16;
  }
};

export const TextComponent: React.FC<TextProps> = ({
  value,
  varient = 'default',
  color = 'black',
  size = "Medium",
}) => {
  return (
    <View>
      <Text style={{ fontWeight: fontSize(varient), color: color, fontSize: fontValue(size) }}>
        {value}
      </Text>
    </View>
  );
};
