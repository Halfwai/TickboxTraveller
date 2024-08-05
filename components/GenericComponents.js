import { TouchableOpacity, Text, StyleSheet } from 'react-native'

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

const styles = StyleSheet.create({
    customButton: {
        backgroundColor: "#51A6F5",
        width: "100%",
        height: 55,
        color: "black",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5
    },
    customButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    }
})