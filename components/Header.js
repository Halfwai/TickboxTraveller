import { useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext, LocationContext } from '../context/Context'

import * as React from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../components/Map';
import { GetLocationBox } from '../components/GetLocationBox';

import * as Location from 'expo-location';
import { getDistance, orderByDistance } from 'geolib';

import AsyncStorage from '@react-native-async-storage/async-storage';


export const Header = () => {
    const { userDataState } = useContext(UserContext);
    const [userData, setUserData] = userDataState;

    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (userData.avatar_url) downloadImage(userData.avatar_url)
    }, [userData.avatar_url])
    
    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download("https://vcfkoseroqnlaopeldln.supabase.co/storage/v1/object/sign/avatars/1722870119372.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzLzE3MjI4NzAxMTkzNzIuanBlZyIsImlhdCI6MTcyMjg3MjAxNSwiZXhwIjoxNzIzNDc2ODE1fQ.xsNGOKWLQ0IjV2jAlD_-nKMpF41UEg-_2PKOtxYMba8&t=2024-08-05T15%3A33%3A35.418Z")    
        if (error) {
            throw error
        }
    
        const fr = new FileReader()
        fr.readAsDataURL(data)
        fr.onload = () => {
            setAvatarUrl(fr.result)
        }
        } catch (error) {
        if (error instanceof Error) {
            console.log('Error downloading image: ', error.message)
        }
        }
    }



    return (
        <View style={styles.headerContainer}>
            <Image 
                    source={require("../assets/images/icon.png")}
                    style={styles.logo}
                    resizeMode='contain'
            />
            {
                avatarUrl && 
                <Image 
                    src={{ uri: avatarUrl }}
                    style={styles.userImage}
                    resizeMode='contain'
                />
            }

            {/* <Text style={styles.headingText}>Tickbox Traveller</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#1D4A7A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%"
    },
    logo: {
        width: 100,
        height: "100%",
        margin: 0
    },
    headingText: {
        fontSize: 30,
    },
    userImage: {
        width: 100,
        height: "100%",
    }
})