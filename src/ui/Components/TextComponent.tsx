import React from 'react';
import { Text, type TextProps as RNTextProps } from 'react-native';

type Variant = 'medium' | 'bold' | 'thin' | 'default';
type Size =
  | 'Large'
  | 'ExtraLarge'
  | 'Medium'
  | 'Small'
  | 'ExtraSmall'
  | 'MidSection'
  | 'GMedium'
  | 'MMedium';

type Props = {
  value: string;
  variant?: Variant;
  varient?: Variant;
  color?: string;
  size?: Size;
  style?: RNTextProps['style'];
} & Omit<RNTextProps, 'children' | 'style'>;

const fontWeightMap: Record<Variant, '300' | '400' | '500' | '800'> = {
  bold: '800',
  medium: '500',
  thin: '300',
  default: '400',
};

const fontSizeMap: Record<Size, number> = {
  ExtraLarge: 42,
  Large: 36,
  MidSection: 28,
  GMedium: 20,
  MMedium: 18,
  Medium: 16,
  Small: 14,
  ExtraSmall: 12,
};

export const TextComponent: React.FC<Props> = ({
  value,
  variant,
  varient,
  color = '#000',
  size = 'Medium',
  style,
  ...props
}) => {
  const resolvedVariant = variant ?? varient ?? 'default';

  return (
    <Text
      {...props}
      style={[
        {
          color,
          fontSize: fontSizeMap[size],
          fontWeight: fontWeightMap[resolvedVariant],
        },
        style,
      ]}
    >
      {value}
    </Text>
  );
};
