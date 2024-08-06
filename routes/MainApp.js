import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext, LocationContext } from '../context/Context'

import * as React from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../components/Map';
import { GetLocationBox } from '../components/GetLocationBox';
import { Header } from '../components/Header';
import { Home } from '../components/Home';
import { Profile } from '../components/profile';

import { getProfile } from '../helperFunctions/getProfile';

import * as Location from 'expo-location';
import { getDistance, orderByDistance } from 'geolib';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function MainApp({ session }) {
    const [loading, setLoading] = useState(true)
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [userData, setUserData] = useState(null);

    const [appState, setAppState] = useState('home');

    const [ attractions, setAttractions ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ askForLocation, setAskForLocation ] = useState(false);
    const [ ticks, setTicks] = useState(null);
    const [ attractionsSorted, setAttractionsSorted ] = useState(false);

    const [ profileId, setProfileId] = useState(null);

    useEffect(() => {
        if (session) {
            try {
                getProfile(setUserData, session?.user.id)
            } catch(e){
                console.log(e);
            }
            
        }
        getLocationData();
        getAttractionsData();
        getTicksData();
    }, [session])



    // async function getProfile() {
    //     try {
    //     setLoading(true)
    //     if (!session?.user) throw new Error('No user on the session!')

    //     const { data, error, status } = await supabase
    //         .from('profiles')
    //         .select()
    //         .eq('id', session?.user.id)
    //         .single()
    //     if (error && status !== 406) {
    //         throw error
    //     }

    //     if (data) {
    //         setUserData(data)
    //     }
    //     } catch (error) {
    //         console.log(error)
    //     if (error instanceof Error) {
    //         Alert.alert(error.message)
    //     }
    //     } finally {
    //     setLoading(false)
    //     }
    // }



    const getLocationData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            const storedLocationData = await checkLocationData()
            if(storedLocationData == null){
                setAskForLocation(true);
                return (
                    <LocationContext.Provider value={
                        {
                            setLocation,
                            setAskForLocation
                        }
                    }>
                        <GetLocationBox />
                    </LocationContext.Provider>
                )
            }
            else {
                const locationData = JSON.parse(storedLocationData)
                setLocation({
                    latitude: locationData.latitude, 
                    longitude: locationData.longitude
                })
                return;
            }
            
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
            attractionsList[i].currentDistance = (getDistance(location, attractionLocation) / 1000).toFixed(2);
        }
        return attractionsList
    }

    const checkLocationData = async() => {
        try {
            const value = await AsyncStorage.getItem('setLocation');
            return value;
        } catch (e) {
        // error reading value
            return false;
        }
    }


    if(askForLocation){
        return (
            <LocationContext.Provider value={
                {
                    setLocation,
                    setAskForLocation
                }
            }>
                <GetLocationBox />
            </LocationContext.Provider>
        )
    }

        
    if (!userData || !attractions || !ticks || !location){
        return;
    }

    if(!attractionsSorted){
        if(location == null){
            return
        }
        setAttractions(sortAttractions(attractions));
        setAttractionsSorted(true);
    }

    return (
        <UserContext.Provider value={
            { 
                session,
                currentAppState: [appState, setAppState],
                attractionsList: [attractions, setAttractions],
                ticksList: [ticks, setTicks],
                currentLocation: [location, setLocation],
                userDataState: [userData, setUserData],
                avatarState: [avatarUrl, setAvatarUrl],
                profileIdState: [ profileId, setProfileId]
            }        
        }>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Header />
                </View>
                <View style={styles.contentContainer}>
                    {appState == "record" && 
                        <HomeScreen />
                    }
                    {appState == "map" && 
                        <Map />
                    }
                    {appState == "home" &&
                        <Home />
                    }
                    {appState == "profile" &&
                        <Profile 
                            id={profileId}
                        />
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
        alignItems: "center",
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