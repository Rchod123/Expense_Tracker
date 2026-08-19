import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';

const CustomInputBox = forwardRef<TextInput, TextInputProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        {...props}
      />
    );
  },
);

export default CustomInputBox;

const styles = StyleSheet.create({
  input: {
    padding: 0,
  },
});
