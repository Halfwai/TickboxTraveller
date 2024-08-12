import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useState, useMemo } from 'react'
import { getImageUrl, removeFollow, insertFollow } from "../helperFunctions/supabaseFunctions";
import { CustomButton } from "./GenericComponents";

export const UserView = (props) => {
    const user = props.user.item;

    if (props.sessionId == user.id){
        return
    }

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isFollowing, setIsFollowing] = useState(user.is_following)

    useMemo(() => {
        if(user.avatar_url){
            getImageUrl(setAvatarUrl, user.avatar_url, "avatars");
        }        
    })
    

    return(
        <View style={styles.userContainer}>
            <TouchableOpacity style={styles.touchableContainer}
                onPress={() => {
                    props.action();
                }}
            >
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.userImage}
                    resizeMode="contain"
                />
                <Text style={styles.nameText}>{user.full_name}</Text>
            </TouchableOpacity>

            <CustomButton 
                style={[styles.button, isFollowing && {backgroundColor: "gray"}]}
                text={isFollowing ? "Following" : "Follow"}
                action={() => {
                    if(isFollowing){
                        removeFollow(props.sessionId, user.id);
                    } else {
                        insertFollow(props.sessionId, user.id);
                    }
                    setIsFollowing(!isFollowing);
                }}
            />

        </View>

        
    ) 
}

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#51A6F5",
        justifyContent: "space-between"
    },
    touchableContainer: {
        flexDirection: 'row',
        alignItems: "center",
        width: "60%"
    },
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "#51A6F5",
        marginRight: 20
    },
    nameText: {

    },  
    button: {
        width: "40%",
    }

})
         