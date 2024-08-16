import { StyleSheet, View, Text, Image, TextInput, ScrollView, Modal, TouchableOpacity } from "react-native";

export const Input = ( props ) => (
    <View style={[styles.inputContainer, {backgroundColor: props.color}]} >
        <Text>{props.title}</Text>
        <TextInput
            onChangeText={(text) => {
                props.onChange(text)
            }}
            value={props.value}
            style={styles.input}
            selectionColor={"black"}
            placeholder={props.placeholder && props.placeholder}
        />
    </View>
)

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: 'lightgray',
        height: 50,
        paddingHorizontal: 10
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 10,
        fontSize: 15,
        width: "70%",
        borderRadius: 10
    },
})