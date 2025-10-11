import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, SafeAreaView, View, Pressable } from 'react-native';
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

type FloatingButtonProps = {
  isExpanded: SharedValue<boolean>;
  index: number;
  buttonLetter: string;
  onPress: () => void;
};

const FloatingActionButton: React.FC<FloatingButtonProps> = ({
  isExpanded,
  index,
  buttonLetter,
  onPress,
}) => {
  const animatedStyles = useAnimatedStyle(() => {
    // highlight-next-line
    const moveValue = isExpanded.value ? OFFSET * index + 1 : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    //highlight-next-line
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[animatedStyles, styles.shadow, styles.button]}
    >
      <Animated.Text style={styles.content}>{buttonLetter}</Animated.Text>
    </AnimatedPressable>
  );
};

export default function MainFloatingButton() {
  const isExpanded = useSharedValue(false);
  const navigation = useNavigation();
  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    // highlight-next-line
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 4]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? '45deg' : '0deg';

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  const handlenav = ({ type }: { type: 'Expenses' | 'Income' }) => {
    navigation.navigate('AddTransaction', {
      params: type,
    });
    handlePress();
  };
  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
          <AnimatedPressable
            onPress={handlePress}
            style={[styles.shadow, mainButtonStyles.button]}
          >
            <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
              +
            </Animated.Text>
          </AnimatedPressable>
          <FloatingActionButton
            isExpanded={isExpanded}
            index={1}
            onPress={() => {
              handlenav({ type: 'Expenses' });
            }}
            buttonLetter={'Add Expenses'}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={2}
            onPress={() => {
              handlenav({ type: 'Income' });
            }}
            buttonLetter={'Add Income'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: '#b58df1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 24,
    color: '#f8f9ff',
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    height: 60,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    width: 140,
    height: 40,
    backgroundColor: '#82cab2',
    position: 'absolute',

    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    color: '#f8f9ff',
    fontWeight: 500,
  },
});
