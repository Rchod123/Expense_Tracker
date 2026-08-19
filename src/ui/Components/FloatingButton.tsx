import { useNavigation, type NavigationProp } from '@react-navigation/native';
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
import type { RootStackParamList } from '../../types/navigation';
import type { TransactionType } from '../../types/domain';
import { COLORS, STRINGS } from '../Constants';

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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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

  const handlenav = (type: TransactionType) => {
    if (type === 'chat') {
      navigation.navigate('Chat');
    } else {
      navigation.navigate('AddTransaction', { type });
    }

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
              handlenav('expense');
            }}
            buttonLetter={STRINGS.floating.addExpenses}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={2}
            onPress={() => {
              handlenav('income');
            }}
            buttonLetter={STRINGS.floating.addIncome}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={3}
            onPress={() => {
              handlenav('chat');
            }}
            buttonLetter={STRINGS.floating.chatWithAI}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 64,
    width: 64,
    borderRadius: 100,
    backgroundColor: COLORS.purple,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  content: {
    fontSize: 26,
    color: COLORS.surface,
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    height: 84,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    minWidth: 150,
    height: 44,
    backgroundColor: COLORS.surface,
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  buttonContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5,
  },
  content: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
});
