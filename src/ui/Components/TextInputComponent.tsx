import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardType,
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

const styles = StyleSheet.create({
  labelContainer: {
    paddingTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(2),
  },
  inputContainer: {
    height: heightPercentageToDP(6),
    width: widthPercentageToDP(80),
    backgroundColor: 'white',
    marginVertical: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(1),
    paddingHorizontal: widthPercentageToDP(4),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    fontSize: 16,
  },
  right: {
    marginLeft: 8,
  },
});

export const BasicSkeleton: React.FC<{
  children: React.ReactNode;
  name: string;
  type?: "dotted" | "dashed";
}> = ({ children, name, type = "dotted" }) => (
  <>
    <View style={styles.labelContainer}>
      <TextComponent value={name} varient="medium" />
    </View>
    <View style={[styles.inputContainer,{borderStyle: type}]}>{children}</View>
  </>
);

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
            style={styles.textInput}
          />
          {rightValue && (
            <TouchableOpacity onPress={onRightPress} style={styles.right}>
              {rightType === 'icon' ? (
                <FontAwesome6
                  name={rightValue}
                  iconStyle="solid"
                  size={heightPercentageToDP(2)}
                  color={'gray'}
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
