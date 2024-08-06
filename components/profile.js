import { StyleSheet, View, Text, TouchableOpacity, Button, Image } from "react-native";
import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'

import { getProfile } from '../helperFunctions/getProfile';
import { downloadImage } from "../helperFunctions/downLoadImage";
import { getTicksData } from "../helperFunctions/getTicksData";


import { UserContext } from '../context/Context'

export const Profile = (props) => {
    const { userDataState, currentAppState, avatarState } = useContext(UserContext);
    const [userData] = userDataState;
    const [appState, setAppState] = currentAppState;
    const [ticksData, setTicksData] = useState(null);

    const [avatarUrl, setAvatarUrl] = useState(null);

    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if(profileData == null){
            getProfile(setProfileData, props.id)
            getTicksData(setTicksData, props.id);
        } else {
            downloadImage(setAvatarUrl, profileData.avatar_url) 
            
        }           
    }, [profileData])

    if(!profileData){
        return;
    }


    return(
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.profileImage}
                    resizeMode={"contain"}
                /> 
                <View style={styles.usernameContainer}>
                    <Text style={styles.usernameText}>
                        {profileData.username}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20
    },
    profileImage: {
        height: 200,
        width: "50%",
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    usernameContainer: {
        width: "50%",
        alignItems: "center"
    },
    usernameText: {
        fontSize: 20
    }
})