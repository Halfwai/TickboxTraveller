import { StyleSheet, View, Text, TouchableOpacity, Button, Image } from "react-native";
import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'

import { getProfile } from '../helperFunctions/getProfile';
import { downloadImage } from "../helperFunctions/downLoadImage";


import { UserContext } from '../context/Context'

export const Profile = (props) => {
    const { userDataState, currentAppState, avatarState } = useContext(UserContext);
    const [userData] = userDataState;
    const [appState, setAppState] = currentAppState;

    const [avatarUrl, setAvatarUrl] = useState(null);

    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if(profileData == null){
            getProfile(setProfileData, props.id)
        } else {
            downloadImage(setAvatarUrl, profileData.avatar_url)  
        }           
    }, [profileData])

    return(
        <View>
            <Image
                source={{ uri: avatarUrl }}
                style={{height: 100,
                    width: 100
                }}

            />
        </View>
    )
}