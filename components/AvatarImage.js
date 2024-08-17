import { StyleSheet, View, Text, Image } from "react-native";

// This component will display a circular image for the users avatar if they have uploaded one. If not, it will display a black circle with the first letter
// of their full name. It takes a full_name and avatar_signedUrl as props.
export const AvatarImage = ({full_name, signedUrl, size}) => {
    return (
        <View style={[styles.avatarContainer, {height: size, width: size}] }>
        {/* if the user object avatar_url value is not null it will display the image */}
        { signedUrl ?
            <Image
                style={styles.avatarImage}
                source={{uri: signedUrl}}
            /> :
            // otherwise it will dispay a black circle with the first letter of the users name in it.
            <Text style={styles.avatarReplacementText}>
                {full_name[0]}
            </Text>
        }  
        </View>
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        backgroundColor: "black",
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#51A6F5"
    },
    avatarImage: {
        height: "99%",
        width: "99%",
        borderRadius: 40,                   
    },
    imageReplacementText: {
        color: "white",
        fontSize: 30
    },
})