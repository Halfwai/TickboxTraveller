import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { useRef } from 'react';

// Animated toggle button component. Takes 4 props, the position the toggle starts at, the title for the button, and
// two objects with options for the left and right side of the toggle.
export const ToggleButton = ({ startPosition, title, left, right }) => {
  const highlightBoxPosition = useRef(
    new Animated.Value(startPosition)
  ).current;
  //Moves the toggle to the right hand side
  const moveRight = () => {
    Animated.timing(highlightBoxPosition, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Moves the toggle to the left hand side
  const moveLeft = () => {
    Animated.timing(highlightBoxPosition, {
      toValue: 80,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  return (
    <View style={styles.settingContainer}>
      <Text>{title}</Text>
      <View style={styles.toggleContainer}>
        <Animated.View
          style={[
            styles.toggleHighlight,
            { right: highlightBoxPosition },
          ]}></Animated.View>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            moveLeft();
            left.action();
          }}>
          <Text>{left.option}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            moveRight();
            right.action();
          }}>
          <Text>{right.option}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleButton: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'rgba(80, 80, 80, 0.1)',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
  },
  toggleHighlight: {
    width: 80,
    height: 40,
    backgroundColor: '#51A6F5',
    position: 'absolute',
    borderRadius: 10,
  },
});
