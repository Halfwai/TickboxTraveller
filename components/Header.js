import { useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, Text, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext, LocationContext } from '../context/Context'

import * as React from 'react';
import { HomeScreen } from './LogScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../components/Map';
import { GetLocationBox } from '../components/GetLocationBox';

import * as Location from 'expo-location';
import { getDistance, orderByDistance } from 'geolib';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { downloadImage } from '../helperFunctions/downLoadImage';

export const Header = () => {
    const { userDataState, currentAppState, avatarState, profileIdState, session } = useContext(UserContext);
    const [userData] = userDataState;
    const [appState, setAppState] = currentAppState;

    const [avatarUrl, setAvatarUrl] = avatarState;
    const [profileId, setProfileId] = profileIdState;

    useEffect(() => {
        if (userData.avatar_url) downloadImage(setAvatarUrl, userData.avatar_url)
    }, [userData.avatar_url])
    
    updateProfileId = async () => {
        setProfileId(session?.user.id);
        setAppState("profile")
    }


    return (
        <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
                <Image 
                        source={require("../assets/images/icon.png")}
                        style={styles.logo}
                        resizeMode='contain'
                />
                <Text style={styles.stateText}>{appState}</Text>
            </View>

            <TouchableOpacity
                onPress={() => {
                    updateProfileId() 
                }}
            >
                <Image 
                    source={{ uri: avatarUrl }}
                    style={styles.userImage}
                    resizeMode='contain'
                />
            </TouchableOpacity>



            {/* <Text style={styles.headingText}>Tickbox Traveller</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#1D4A7A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        paddingHorizontal: 20
    },
    logo: {
        width: 80,
        height: 80,
        overflow: "hidden",
        left: -10
    },
    logoContainer:{
        flexDirection: "row",
        alignItems: "center"
    },
    stateText: {
        textTransform: "capitalize",
        fontSize: 25,
        fontWeight: "bold"
    },
    headingText: {
        fontSize: 30,
    },
    userImage: {
        width: 70,
        height: 70,
        borderRadius: 40,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#51A6F5",
        backgroundColor: "black"
    }
})