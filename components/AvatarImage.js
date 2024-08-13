import { StyleSheet, View, Text, Image } from "react-native";

export const AvatarImage = (props) => {
    return (
        <View style={styles.avatarContainer}>
        { props.data.avatar_url ?
            <Image
                style={styles.tickProfileImage}
                source={{uri: props.data.avatar_url}}
            /> :
            <Text style={styles.imageReplacementText}>
                {props.data.full_name[0]}
            </Text>
        }  
        </View>
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 52,
        width: 52,
        marginRight: 10,
        backgroundColor: "black",
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#51A6F5"
    },
    tickProfileImage: {
        height: 50,
        width: 50,
        borderRadius: 25,                   
    },
    imageReplacementText: {
        color: "white",
        fontSize: 30
    },
})