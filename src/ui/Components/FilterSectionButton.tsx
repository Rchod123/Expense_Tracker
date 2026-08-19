import { StyleSheet, TouchableOpacity } from 'react-native';
import { TextComponent } from './TextComponent';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../Constants';


type Props = {
  value: string;
  selectedValue: string;
  onPress: (value: string) => void;
};

const styles = StyleSheet.create({
  selected: {
    backgroundColor: COLORS.info,
    borderColor: COLORS.info,
  },
  container: {
    minHeight: 40,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
});

export const FilterSectionButton: React.FC<Props> = ({
  value,
  onPress,
  selectedValue,
}) => {
  const isSelected = selectedValue === value;
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={() => onPress(value)}
    >
      <TextComponent
        value={value}
        color={isSelected ? COLORS.surface : COLORS.textPrimary}
        variant="medium"
        size="ExtraSmall"
      />
    </TouchableOpacity>
  );
};
