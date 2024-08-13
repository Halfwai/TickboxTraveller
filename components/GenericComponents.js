import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native'
import { useRef } from 'react';

export const CustomButton = (props) => (
    <TouchableOpacity
        {...props}
        style={[styles.customButton, props.style]}
        {...props.attributes}
        onPress={props.action}
        disabled={props.disabled}
    >
        <Text style={styles.customButtonText}>{props.text}</Text>
    </TouchableOpacity>
)

export const ToggleButton = (props) => {
    const highlightBoxPosition = useRef(new Animated.Value(props.startPosition)).current;
    const moveRight = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(highlightBoxPosition, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
    };

    const moveLeft = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(highlightBoxPosition, {
          toValue: 80,
          duration: 200,
          useNativeDriver: false,
        }).start();
    };
    return (
        <View style={styles.settingContainer}>
            <Text>{props.title}</Text>
            <View style={styles.toggleContainer}>
                <Animated.View style={[styles.toggleHighlight, {right: highlightBoxPosition}]}></Animated.View>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => {
                        moveLeft();
                        props.left.action();
                    }}
                >
                    <Text>{props.left.option}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => {
                        moveRight();
                        props.right.action();
                    }}
                >
                    <Text>{props.right.option}</Text>
                </TouchableOpacity>   
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    customButton: {
        backgroundColor: "#51A6F5",
        width: "100%",
        height: 55,
        color: "black",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
    customButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
        textAlign: "center"
    },    
    settingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: 10,
        alignItems: "center"
    },
    toggleContainer:{
        flexDirection: "row",
    },
    toggleButton:{
        width: 80,
        height: 40,
        justifyContent: 'center',
        backgroundColor: "rgba(80, 80, 80, 0.1)",
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10,
    }, 
    toggleHighlight: {
        width: 80,
        height: 40,
        backgroundColor: "#51A6F5",
        position: "absolute",
        borderRadius: 10,
    }
})