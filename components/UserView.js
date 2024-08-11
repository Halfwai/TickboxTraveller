import { StyleSheet, View, Text, TouchableOpacity, Button, Image, ScrollView, FlatList } from "react-native";
import { useState, useEffect, useContext, useMemo } from 'react'
import { getImageUrl } from "../helperFunctions/getImageUrl";
import { CustomButton } from "./GenericComponents";
import { removeFollow } from "../helperFunctions/removeFollow";
import { insertFollow } from "../helperFunctions/insertFollow";

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
            { 
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.userImage}
                    resizeMode="contain"
                />

            }

            <Text>{user.full_name}</Text>
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
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "#51A6F5"
    },
    button: {
        width: 100,
    }

})
         