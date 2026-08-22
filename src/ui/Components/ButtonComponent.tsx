import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { TextComponent } from './TextComponent';
import { COLORS, RADIUS, SHADOWS } from '../Constants';
import { widthPercentageToDP } from '../../utils/responsive';
import { useTheme } from '../../context/themeContext';

type ButtonProps = {
  value: string;
  onPress: () => void;
  type: 'primary' | 'secondary';
  disabled?: boolean;
};

const styles = StyleSheet.create({
  mainContainer: {
    minHeight: 56,
    width: widthPercentageToDP(84),
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});

const colorSet = {
  primary: {
    background: COLORS.info,
    textColor: COLORS.surface,
    width: 0,
    lineColor: COLORS.info,
  },
  secondary: {
    background: COLORS.surface,
    textColor: COLORS.info,
    width: 1,
    lineColor: COLORS.info,
  },
} as const;

const ButtonComponent: React.FC<ButtonProps> = ({
  value,
  onPress,
  type,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const selectedColors = {
    ...colorSet[type],
    background: type === 'primary' ? colors.info : colors.surface,
    textColor: type === 'primary' ? colors.surface : colors.info,
    lineColor: colors.info,
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.mainContainer,
        {
          backgroundColor: selectedColors.background,
          borderWidth: selectedColors.width,
          borderColor: selectedColors.lineColor,
        },
        SHADOWS.card,
        disabled && { opacity: 0.6 },
      ]}
    >
      <View style={styles.innerGlow} />
      <TextComponent
        style={styles.content}
        value={value}
        variant="bold"
        color={selectedColors.textColor}
      />
    </TouchableOpacity>
  );
};


export default ButtonComponent;
