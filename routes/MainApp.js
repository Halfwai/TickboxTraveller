import { useState, useEffect } from 'react';
import { StyleSheet, View, BackHandler, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

// Uses UserContext to pass some values around to different screens without prop drilling
import { UserContext } from '../context/Context';

// Import custom components
import { LogScreen } from '../screens/MainAppScreens/LogScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../screens/MainAppScreens/Map';
import { GetLocationScreen } from '../components/GetLocationScreen';
import { Header } from '../components/Header';
import { Home } from '../screens/MainAppScreens/Home';
import { Profile } from '../screens/MainAppScreens/Profile';
import { Search } from '../screens/MainAppScreens/Search';
import { Settings } from '../screens/MainAppScreens/Settings';

// Functions that make calls to the supabase database
import {
  getProfile,
  getFollowedUserTicks,
} from '../helperFunctions/supabaseFunctions';
// General helper functions
import {
  sortAttractions,
  handleBackAction,
  getLocationData,
  checkTimeFormat,
  checkDistanceFormat,
  deleteAttractionsData,
  getAttractionData,
  updateAppState,
  storeLocation,
} from '../helperFunctions/generalFunctions';

// Global variables, used to set hard string values for some state properties
import '../global'

// This is the main app component. Once the user has registered and logged in this is the main component that they 
// will be interacting with. I creted my own custom naviation method that opens each page in the main space between 
// the app header, and a footer menu. By controlling everything form this main component I can keep rerenders to a
// minimun to avoid making unecessary calls to the api
export default function MainApp({ session }) {
  // Various states that are used throughout the app
  const [userData, setUserData] = useState(null);
  const [appState, setAppState] = useState(APPSTATE.HOME);
  const [attractions, setAttractions] = useState(null);
  const [location, setLocation] = useState(null);
  const [askForLocation, setAskForLocation] = useState(false);
  const [navigationMap, setNavigationMap] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [ticksViewData, setTicksViewData] = useState(null);
  const [timeFormat, setTimeFormat] = useState(null);
  const [distanceFormat, setDistanceFormat] = useState(null);
  const [gpsPermissionGranted, setGpsPermissionGranted] = useState(false);

  // This useEffect runs once the user has logged in and a session token has been returned. It makes the majority
  // of the necessary calls to the api and AsyncStorage. 
  useEffect(() => {
    if (session) {
      try {
        (async () => {
          setTimeFormat(await checkTimeFormat());
          setDistanceFormat(await checkDistanceFormat());
          setUserData(await getProfile(session?.user.id));
          setTicksViewData(await getFollowedUserTicks(session?.user.id));
          const locationData = await getLocationData(
            setAskForLocation,
            setGpsPermissionGranted
          );
          // getLocationData returns false if the user has rejected location permission and not yet picked a location
          // to store in Async storage.
          if (locationData) {
            setLocation(locationData);
          }
        })();
      } catch (error) {
        Alert.alert('Error Fetching App Data', error.message);
      }
    }
  }, [session]);

  // This useEffect gets and sorts the data for attractions from the api or from AsyncStorage. It runs once 
  // the user has chosen a location, or once location has been determined via gps. It will then update as location
  // changes to give the user updated information on the distance that attractions are away
  useEffect(() => {
    if (location) {
      (async () => {
        const attractionsData = await getAttractionData(session?.user.id);
        const newSortedAttractionsList = sortAttractions(
          attractionsData,
          location,
          distanceFormat
        );
        setAttractions(newSortedAttractionsList);
      })();
    }
  }, [distanceFormat, location, session]);

  // This useEffect uses the BackHandler component to control what happens when the back button is pressed
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return handleBackAction(navigationMap, setAppState, setNavigationMap);
      }
    );
    return () => backHandler.remove();
  }, [navigationMap]);

  // If the user does not accept location permissions, they have to manually select a location. Based on the askForLocation
  // state this will render the GetLocationScreen where they can do this. It will also be rendered if a user wants to set their
  // location again in the setting screen
  if (askForLocation) {
    return (
      <GetLocationScreen
        setLocation={async (pickedLocation) => {
          setLocation(pickedLocation);
          setAskForLocation(false);
          storeLocation(pickedLocation);
          Alert.alert(
            'Location set',
            'If you wish to change this, you can do so in settings. Better yet, enable location permissions.'
          );
        }}
      />
    );
  }

  return (
    // UserContext provies context values through the app. I have used a mixture of Context and Props for where I 
    // feel it's appropriate.
    <UserContext.Provider
      value={{
        currentAttractions: [attractions, setAttractions],
        currentUserData: [userData, setUserData],
        currentProfileId: [profileId, setProfileId],
        currentTimeFormat: [timeFormat, setTimeFormat],
        currentDistanceFormat: [distanceFormat, setDistanceFormat],
        setTicksView: async () => {
            setTicksViewData(await getFollowedUserTicks(session?.user.id));
        },
        updateAppState: (newScreen) => {
            Haptics.selectionAsync()
            updateAppState(
                newScreen,
                appState,
                setAppState,
                navigationMap,
                setNavigationMap
              );
        }
      }}>
      {/* The main display will not render until the necessary data has loaded */}
      {userData && attractions && location && (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Header
              user={userData}
              setProfileId={async (newScreen) => {
                setProfileId(session.user.id);
              }}
              appState={appState}
            />
          </View>
          <View style={styles.contentContainer}>
            {/* Based on the value of the appState state different pages will render. I use global variable
            here to ensure that the string remains within a set bounds and reduce errors */}
            {appState == APPSTATE.LOG && (
              <LogScreen session={session} attractions={attractions} />
            )}
            {appState == APPSTATE.MAP && (
              <Map
                attractions={attractions}
                location={location}
                session={session}
              />
            )}
            {appState == APPSTATE.HOME && <Home ticksData={ticksViewData} />}
            {appState == APPSTATE.PROFILE && <Profile id={profileId} />}
            {appState == APPSTATE.SEARCH && (
              <Search
                session={session}
                setProfile={(id) => {
                  setProfileId(id);
                }}
              />
            )}
            {appState == APPSTATE.SETTINGS && (
              <Settings
                resetAttractionsData={async () => {
                  await deleteAttractionsData();
                  const newAttractions = await getAttractionData(
                    session.user.id
                  );
                  setAttractions(
                    sortAttractions(newAttractions, location, distanceFormat)
                  );
                }}
                gpsPermissionGranted={gpsPermissionGranted}
                showLocationScreen={() => {
                  setAskForLocation(true);
                }}
              />
            )}
          </View>
          <View style={styles.footerContainer}>
            <BottomMenu
              appState={appState}
            />
          </View>
          <StatusBar style="auto" />
        </View>
      )}
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 0,
  },
  headerContainer: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#1D4A7A',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 6,
  },
  footerContainer: {
    flex: 1.2,
  },
});
