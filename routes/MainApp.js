import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, Text, BackHandler } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext, LocationContext } from '../context/Context'

import * as React from 'react';
import { LogScreen } from '../components/LogScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../components/Map';
import { GetLocationBox } from '../components/GetLocationBox';
import { Header } from '../components/Header';
import { Home } from '../components/Home';
import { Profile } from '../components/profile';
import { Search } from '../components/Search';

import { getProfile, getAttractionsData } from '../helperFunctions/supabaseFunctions';
import { sortAttractions, handleBackAction, getLocationData } from '../helperFunctions/generalFunctions';

import * as Location from 'expo-location';





export default function MainApp({ session }) {
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [userData, setUserData] = useState(null);

    const [appState, setAppState] = useState('home');

    const [ attractions, setAttractions ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ askForLocation, setAskForLocation ] = useState(false);
    const [ ticks, setTicks] = useState(null);
    const [ attractionsSorted, setAttractionsSorted ] = useState(false);
    const [ navigationMap, setNavigationMap ] = useState([])
    const [ profileId, setProfileId] = useState(null);

    useEffect(() => {
        if (session) {
            try {
                getProfile(setUserData, session?.user.id);
                getLocationData(setLocation, setAskForLocation);
                getAttractionsData(session.user.id, setAttractions);
            } catch(e){
                console.log(e);
            }            
        }
    }, [session])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                return handleBackAction(navigationMap, setAppState, setNavigationMap)
            },
        );    
        return () => backHandler.remove();
    }, [navigationMap]);

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
            
    if (!userData || !attractions || !location){
        return;
    }

    if(!attractionsSorted){
        setAttractions(sortAttractions(attractions, location))
        setAttractionsSorted(true);
    }

    return (
        <UserContext.Provider value={
            { 
                session,
                currentNavigationMap: [navigationMap, setNavigationMap],
                currentAppState: [appState, setAppState],
                attractionsList: [attractions, setAttractions],
                ticksList: [ticks, setTicks],
                currentLocation: [location, setLocation],
                userDataState: [userData, setUserData],
                avatarState: [avatarUrl, setAvatarUrl],
                currentProfileId: [ profileId, setProfileId]
            }        
        }>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Header 
                        profileImage={userData.avatar_url}
                    />
                </View>
                <View style={styles.contentContainer}>
                     {appState == "log ticks" && 
                        <LogScreen />
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
                    {appState == "search" &&
                        <Search />
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