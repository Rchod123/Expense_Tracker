import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, NativeSyntheticEvent, TextInputKeyPressEventData, TextInput } from 'react-native';
import CustomInputBox from './CustomInputBox';
import { widthPercentageToDP } from '../../utils/responsive';

const PIN_LENGTH = 4;

interface PinInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  onComplete?: (pin: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({
  values,
  onChange,
  onComplete,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (values.every(item => item !== '')) {
      onComplete?.(values.join(''));
    }
  }, [values, onComplete]);

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/\D/g, '').slice(0, 1);

    const newValues = [...values];
    newValues[index] = value;

    onChange(newValues);

    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key !== 'Backspace') {
      return;
    }

    const newValues = [...values];

    // If current box has a value, clear it.
    if (newValues[index] !== '') {
      newValues[index] = '';
      onChange(newValues);
      return;
    }

    // Current box is already empty -> move to previous box.
    if (index > 0) {
      newValues[index - 1] = '';
      onChange(newValues);

      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: PIN_LENGTH }).map((_, index) => (
        <CustomInputBox
          key={index}
          ref={(ref: TextInput | null) => {
            inputRefs.current[index] = ref;
          }}
          value={values[index]}
          maxLength={1}
          keyboardType="number-pad"
          returnKeyType="done"
          style={styles.input}
          onChangeText={(text: string) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

export default PinInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: widthPercentageToDP(4),
    paddingHorizontal: 20,
  },

  input: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFF',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
});
