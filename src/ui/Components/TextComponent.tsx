import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  type TextProps as RNTextProps,
} from 'react-native';

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
  showMore?: boolean;
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
  showMore = false,
  style,
  ...props
}) => {
  const resolvedVariant = variant ?? varient ?? 'default';
  const [showButton, setShowButton] = useState(false);

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text
        {...props}
        numberOfLines={showButton ? undefined: 1}
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
      {showMore && value?.length > 30 && (
        <TouchableOpacity   onPress={() => setShowButton((prev) => !prev)}>
          <Text style={{alignSelf: "flex-end",color: color}}>{showButton ? 'Show Less': 'Show More'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
