import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext } from '../context/Context'

import * as React from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../components/Map';

import * as Location from 'expo-location';
import { getDistance, orderByDistance } from 'geolib';


export default function MainApp({ session }) {
    const [loading, setLoading] = useState(true)
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')

    const [appState, setAppState] = useState('home');

    const [ attractions, setAttractions ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ ticks, setTicks] = useState(null);
    const [ attractionsSorted, setAttractionsSorted ] = useState(false);

    useEffect(() => {
        if (session) {
            getProfile()
        }
        getLocationData();
        getAttractionsData();
        getTicksData();
    }, [session])

    async function getProfile() {
        try {
        setLoading(true)
        if (!session?.user) throw new Error('No user on the session!')

        const { data, error, status } = await supabase
            .from('profiles')
            .select(`username, avatar_url`)
            .eq('id', session?.user.id)
            .single()
        if (error && status !== 406) {
            throw error
        }

        if (data) {
            console.log(data);
            setFullName(data.full_name)
            setAvatarUrl(data.avatar_url)
        }
        } catch (error) {
            console.log(error)
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
        } finally {
        setLoading(false)
        }
    }



    const getLocationData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }    
        let currentLocation = await Location.getCurrentPositionAsync({});

        setLocation({
            latitude: currentLocation.coords.latitude, 
            longitude: currentLocation.coords.longitude
        })
    }

    const getAttractionsData = async () => {
        const { data, error } = await supabase
            .from('attractions')
            .select()
            .order('id')
        if(data){
            try {
                let attractionsList = Object.values(data);
                setAttractions(attractionsList);
            } catch (error) {
                // Error saving data
                console.log(`Error getting data: ${error}`)
            }
        }
        if(error){
            console.log(error);
        }
    }

    const getTicksData = async () => {
        const { data, error } = await supabase
            .from('ticks')
            .select()
            .eq("user_id", session.user.id)

        if(data){
            try {
                let ticksList = Object.values(data);
                setTicks(ticksList)
            } catch (error) {
                // Error saving data
                console.log(`Error getting data: ${error}`)
            }
        }
        if (error){
            console.log(error);
        }
    }

    const sortAttractions = (attractionsList) => {
        for(let i = 0; i < ticks.length; i++){
            attractionsList[ticks[i].attractionid - 1].ticked = true
        }

        attractionsList = orderByDistance(location, attractionsList);
        for (let i = 0; i < attractionsList.length; i++){
            const attractionLocation = {
                latitude: attractionsList[i].latitude,
                longitude: attractionsList[i].longitude,
            }
            attractionsList[i].currentDistance = getDistance(location, attractionLocation);
        }
        return attractionsList
    }

    if (attractions == null || location == null || ticks == null){
        return;
    }

    if(!attractionsSorted){
        setAttractions(sortAttractions(attractions));
        setAttractionsSorted(true);
    }


    // const [ attractions, setAttractions ] = useState(null);
    // const [ location, setLocation ] = useState(null);
    // const [ ticks, setTicks] = useState(null);
    return (
        <UserContext.Provider value={
            { 
                session,
                currentAppState: [appState, setAppState],
                attractionsList: [attractions, setAttractions],
                ticksList: [ticks, setTicks],
                location
            }        
        }>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image 
                            source={require("../assets/images/icon.png")}
                            style={styles.logo}
                            resizeMode='contain'
                        />
                    <Text style={styles.headingText}>Tickbox Traveller</Text>
                </View>
                <View style={styles.contentContainer}>
                    {appState == "record" ? 
                        <HomeScreen session={session}/> :
                        <Map />
                    }
                    
                </View>
                <View style={styles.footerContainer}>
                    <BottomMenu />
                </View>
                <StatusBar style="auto" />
            </View>
        </UserContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: 0
    },
    headerContainer: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: "#1D4A7A",
        flexDirection: "row",
        alignItems: "center",
        // width: "100%",
        // justifyContent: "space-between"
    },
    logo: {
        width: 100,
        height: "100%",
        margin: 0
    },
    headingText: {
        fontSize: 30,
    },
    contentContainer: {
        flex: 6
    },
    footerContainer: {
        flex: 1
    }
})