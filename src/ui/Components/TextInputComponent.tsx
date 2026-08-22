import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import { TextComponent } from './TextComponent';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { COLORS, RADIUS, SHADOWS } from '../Constants';
import { useTheme } from '../../context/themeContext';

const styles = StyleSheet.create({
  labelContainer: {
    paddingTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(2),
    marginBottom: heightPercentageToDP(0.8),
  },
  inputContainer: {
    minHeight: heightPercentageToDP(6.5),
    width: widthPercentageToDP(84),
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    marginVertical: heightPercentageToDP(0.8),
    borderRadius: RADIUS.lg,
    paddingHorizontal: widthPercentageToDP(4),
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  right: {
    minWidth: 32,
    minHeight: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export const BasicSkeleton: React.FC<{
  children: React.ReactNode;
  name: string;
  type?: 'dotted' | 'dashed';
}> = ({ children, name, type = 'dotted' }) => {
  const { colors } = useTheme();
  return (
    <>
      <View style={styles.labelContainer}>
        <TextComponent value={name} variant="medium" />
      </View>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.surface, borderColor: colors.border, borderStyle: type },
        ]}
      >
        {children}
      </View>
    </>
  );
};

type InputProps = {
  name: string;
  rightType?: 'icon' | 'text';
  rightValue?: string;
  onRightPress?: () => void;
};

export const CustomInput: React.FC<InputProps & React.ComponentProps<typeof TextInput>> = ({
  name,
  rightType = 'text',
  rightValue,
  onRightPress,
  ...props
}) => {
  const { colors } = useTheme();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingHorizontal: widthPercentageToDP(4) }}
    >
      <BasicSkeleton name={name}>
        <View style={styles.row}>
          <TextInput
            {...props}
            returnKeyType="done"
            placeholderTextColor={colors.textMuted}
            style={[styles.textInput, { color: colors.textPrimary }]}
          />
          {rightValue && (
            <TouchableOpacity onPress={onRightPress} style={styles.right}>
              {rightType === 'icon' ? (
                <FontAwesome6
                  name={rightValue as any}
                  iconStyle="solid"
                  size={heightPercentageToDP(2)}
                  color={colors.textMuted}
                />
              ) : (
                <TextComponent value={rightValue} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </BasicSkeleton>
    </KeyboardAvoidingView>
  );
};



export default CustomInput;
