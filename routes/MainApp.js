import { useState, useEffect, useMemo } from 'react'
import { StyleSheet, View, BackHandler, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext } from '../context/Context'

import * as React from 'react';
import { LogScreen } from '../screens/MainAppScreens/LogScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../screens/MainAppScreens/Map';
import { GetLocationScreen } from '../components/GetLocationScreen';
import { Header } from '../components/Header';
import { Home } from '../screens/MainAppScreens/Home';
import { Profile } from '../screens/MainAppScreens/Profile';
import { Search } from '../screens/MainAppScreens/Search';
import { Settings } from '../screens/MainAppScreens/Settings';

import { getProfile, downloadAttractionsData, getFollowedUserTicks } from '../helperFunctions/supabaseFunctions';
import { sortAttractions, handleBackAction, getLocationData, checkTimeFormat, checkDistanceFormat, checkStorageAttractionData, storeAttractionsData, deleteAttractionsData, updateAppState  } from '../helperFunctions/generalFunctions';

export default function MainApp({ session }) {
    const [userData, setUserData] = useState(null);
    const [appState, setAppState] = useState('home');

    const [ attractions, setAttractions ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ askForLocation, setAskForLocation ] = useState(false);
    const [ ticks, setTicks] = useState(null);
    const [ attractionsSorted, setAttractionsSorted ] = useState(false);
    const [ navigationMap, setNavigationMap ] = useState([])
    const [ profileId, setProfileId] = useState(null);
    const [ ticksViewData, setTicksViewData ] = useState(null)

    const [ timeFormat, setTimeFormat ] = useState(null);
    const [ distanceFormat, setDistanceFormat ] = useState(null);

    const [gpsPermissionGranted, setGpsPermissionGranted] = useState(false);

    useEffect(() => {
        if (session) {
            try {
                getAsyncData();
            } catch(e){
                console.log(e);
            }            
        }
    }, [session])

    useEffect(() => {
        if(location && attractions){      
            const newSortedAttractionsList = sortAttractions(attractions, location, distanceFormat)
            setAttractions(newSortedAttractionsList);
        }
    }, [distanceFormat])

    useEffect(() => {
        getFollowedUserTicks(session?.user.id, setTicksViewData);
    }, [attractions])


    const getAsyncData = async () => {
        setTimeFormat(await checkTimeFormat())
        setDistanceFormat(await checkDistanceFormat())
        setUserData(await getProfile(session?.user.id));
        getFollowedUserTicks(session?.user.id, setTicksViewData);
        getLocationData(setLocation, setAskForLocation, setGpsPermissionGranted);
        setAttractions(await getAttractionData())
    }

    const resetAttractions = async () => {
        await deleteAttractionsData()
        const newAttractions = await getAttractionData()
        setAttractions(sortAttractions(newAttractions, location, distanceFormat))
    }

    const getAttractionData = async () => {
        let data = await checkStorageAttractionData()
        if(!data){
            data = await downloadAttractionsData(session.user.id)
            storeAttractionsData(data)
        }
        return data;
    }

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

            <GetLocationScreen 
                setLocation={(location) => {
                    setLocation(location)
                }}
                setAskForLocation={(bool) => {
                    setAskForLocation(bool)
                }}
            />

        )
    }
            
    if (!userData || !attractions || !location){
        return;
    }

    if(!attractionsSorted){
        setAttractions(sortAttractions(attractions, location, distanceFormat))
        setAttractionsSorted(true);
    }

    return (
        <UserContext.Provider value={
            { 
                session,
                currentNavigationMap: [navigationMap, setNavigationMap],
                currentAppState: [appState, setAppState],
                currentAttractions: [attractions, setAttractions],
                ticksList: [ticks, setTicks],
                currentLocation: [location, setLocation],
                currentUserData: [userData, setUserData],
                currentProfileId: [ profileId, setProfileId],
                currentTicksViewData: [ ticksViewData, setTicksViewData ],
                currentTimeFormat: [timeFormat, setTimeFormat],
                currentDistanceFormat: [distanceFormat, setDistanceFormat]
            }        
        }>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Header
                        user={userData} 
                        setScreen={async (newScreen) => {
                            await setProfileId(session.user.id);
                            updateAppState(newScreen, appState, setAppState, navigationMap, setNavigationMap)
                        }}
                        appState={appState}
                    />
                </View>
                <View style={styles.contentContainer}>
                     {appState == "log ticks" && 
                        <LogScreen 
                            session={session}
                            attractions={attractions}
                        />
                    }
                    {appState == "map" && 
                        <Map 
                            attractions={attractions}
                            location={location}
                            session={session}
                        />
                    }
                    {appState == "home" && 
                        <Home 
                            ticksData={ticksViewData}
                        />
                    }
                    {appState == "profile" &&
                        <Profile 
                            id={profileId}
                        />
                    }
                    {appState == "search" &&
                        <Search 
                            session={session}
                        />
                    } 
                    {appState == "settings" &&
                        <Settings 
                            resetAttractionsData = {() => {
                                resetAttractions()
                            }}
                            gpsPermissionGranted={gpsPermissionGranted}
                            showLocationScreen={() => {
                                setAskForLocation(true);
                                setAttractionsSorted(false);
                            }}
                        />                        
                    }
                </View>
                <View style={styles.footerContainer}>
                    <BottomMenu 
                        setScreen={(newScreen) => {
                            updateAppState(newScreen, appState, setAppState, navigationMap, setNavigationMap)
                        }}
                        appState={appState}
                    />
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
        flex: 1.2
    }
})