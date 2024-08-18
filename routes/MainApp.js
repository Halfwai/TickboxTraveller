import { useState, useEffect } from 'react'
import { StyleSheet, View, BackHandler, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext } from '../context/Context'

import { LogScreen } from '../screens/MainAppScreens/LogScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../screens/MainAppScreens/Map';
import { GetLocationScreen } from '../components/GetLocationScreen';
import { Header } from '../components/Header';
import { Home } from '../screens/MainAppScreens/Home';
import { Profile } from '../screens/MainAppScreens/Profile';
import { Search } from '../screens/MainAppScreens/Search';
import { Settings } from '../screens/MainAppScreens/Settings';

import { getProfile, getFollowedUserTicks } from '../helperFunctions/supabaseFunctions';
import { sortAttractions, handleBackAction, getLocationData, checkTimeFormat, checkDistanceFormat, deleteAttractionsData, getAttractionData, updateAppState, storeLocation  } from '../helperFunctions/generalFunctions';

export default function MainApp({ session }) {
    const [userData, setUserData] = useState(null);
    const [appState, setAppState] = useState('home');

    const [ attractions, setAttractions ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ askForLocation, setAskForLocation ] = useState(false);
    const [ ticks, setTicks] = useState(null);
    const [ navigationMap, setNavigationMap ] = useState([])
    const [ profileId, setProfileId] = useState(null);
    const [ ticksViewData, setTicksViewData ] = useState(null)

    const [ timeFormat, setTimeFormat ] = useState(null);
    const [ distanceFormat, setDistanceFormat ] = useState(null);

    const [gpsPermissionGranted, setGpsPermissionGranted] = useState(false);

    useEffect(() => {
        if (session) {
            try {
                (async () => {
                    setTimeFormat(await checkTimeFormat())
                    setDistanceFormat(await checkDistanceFormat())
                    setUserData(await getProfile(session?.user.id));
                    setTicksViewData(await getFollowedUserTicks(session?.user.id));
                    const attractionsData = await getAttractionData(session?.user.id)
                    setAttractions(attractionsData);
                    const locationData = await getLocationData(setAskForLocation, setGpsPermissionGranted)
                    if (locationData){
                        setLocation(locationData)
                        setAttractions(sortAttractions(attractionsData, locationData, distanceFormat))
                    }                    
                })()
            } catch(error){
                Alert.alert("Error Fetching App Data", error.message)
            }            
        }
    }, [session])

    useEffect(() => {
        if(location && attractions){      
            const newSortedAttractionsList = sortAttractions(attractions, location, distanceFormat)
            setAttractions(newSortedAttractionsList);
        }
    }, [distanceFormat, location])

    useEffect(() => {
        getFollowedUserTicks(session?.user.id, setTicksViewData);
    }, [attractions])

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
                setLocation = {async (pickedLocation) => {
                    setLocation(pickedLocation);
                    setAskForLocation(false);
                    storeLocation(pickedLocation);
                    Alert.alert("Location set", "If you wish to change this, you can do so in settings. Better yet, enable location permissions.")
                }}
            />
        )
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
            { userData && attractions && location &&
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
                                setProfile={(id) => {
                                    setProfileId(id);
                                }}
                                setScreen={async (newScreen) => {
                                    await setProfileId(session.user.id);
                                    updateAppState(newScreen, appState, setAppState, navigationMap, setNavigationMap)
                                }}
                            />
                        } 
                        {appState == "settings" &&
                            <Settings 
                                resetAttractionsData = {async () => {
                                    await deleteAttractionsData()
                                    const newAttractions = await getAttractionData(session.user.id);
                                    setAttractions(sortAttractions(newAttractions, location, distanceFormat))    
                                }}
                                gpsPermissionGranted={gpsPermissionGranted}
                                showLocationScreen={() => {
                                    setAskForLocation(true);
                                }}
                                session={session}
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
                    

            }

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