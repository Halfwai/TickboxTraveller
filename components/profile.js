import { StyleSheet, View, Text, TouchableOpacity, Button, Image, ScrollView, FlatList } from "react-native";
import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'
import { TickView } from "./TickView";

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

    if(!profileData || !ticksData){
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
                        {profileData.full_name}
                    </Text>
                    <Text>
                        {`${ticksData.length} boxes ticked`}
                    </Text>
                </View>
            </View>
            {/* <ScrollView>
                {ticksData.map((tick) => {
                    return (
                        <Text>{tick.full_name}</Text>
                    )                    
                })}
            </ScrollView> */}

        { ticksData &&
            <FlatList
                data={ticksData}
                renderItem={tickView}
                keyExtractor={(item) => item.id}
            />

        }




        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 20
    },
    profileImage: {
        height: 200,
        width: "50%",
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#51A6F5",
        paddingVertical: 10
    },
    usernameContainer: {
        width: "45%",
        alignItems: "center",
    },
    usernameText: {
        fontSize: 20,
        textAlign: "center"
    }, 
    tickInfoContainer: {

    },
    tickProfileImage: {
        height: 50,
        width: 50,
        backgroundColor: "black"
    }
})