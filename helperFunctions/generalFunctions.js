import {  Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { getDistance, orderByDistance } from 'geolib';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { downloadAttractionsData } from './supabaseFunctions';

import { manipulateAsync,  SaveFormat } from 'expo-image-manipulator';

// Allows the user to upload an image from their device. 
// Code adapted from here- https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
export async function uploadImage() {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
            allowsMultipleSelection: false, // Can only select one image
            allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
            quality: 1,
            exif: false, // We don't want nor need that data.
        })

        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log('User cancelled image picker.')
            return
        }

        // This code reduces the size of the image, compresses it and returns it as a webp. I am using Supabase as the backend,
        // and downloads are very limited so by compressing the image this severly I am saving data charges.
        const compressedImage = await manipulateAsync(
            result.assets[0].uri,
            [{ resize: { height: 200} }],
            { compress: 0.2, format: SaveFormat.WEBP }
        );

        return compressedImage;

    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        } else {
            throw error
        }
    } 
}


// Sorts the attractions by distance from the users location. Uses the geolib library to do distance calculations using
// latitude and longitude. Also formats the distance into km or miles based on user settings.
export const sortAttractions = (attractionsList, location, distanceFormat) => {
    let sortedAttractionsList = [...attractionsList];
    sortedAttractionsList = orderByDistance(location, sortedAttractionsList);
    for (let i = 0; i < sortedAttractionsList.length; i++){
        const attractionLocation = {
            latitude: sortedAttractionsList[i].latitude,
            longitude: sortedAttractionsList[i].longitude,
        }
        const distance = (getDistance(location, attractionLocation) / 1000).toFixed(2)
        let distanceString = `${distance} Km away`
        if(distanceFormat == "miles"){
            distanceString = `${(distance * 0.621371).toFixed(2)} miles away`;
        }
        sortedAttractionsList[i] = {
            ...sortedAttractionsList[i],
            currentDistance: distanceString
        };
    }
    return sortedAttractionsList
}

// Handles what happns when the user presses the back button. Takes an array of pervious screens that the user
// has been to, and cycles back through them. If this array is empty prompts the user on closing the app
export const handleBackAction = (navigationMap, setAppState, setNavigationMap) => {
    if(navigationMap.length <= 0){
        Alert.alert('Would you like to exit Tickbox Traveller?', null, [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
    } else {
        const upDatedNavigationMap = [...navigationMap]
        setAppState(upDatedNavigationMap.pop());
        setNavigationMap(upDatedNavigationMap);
    }
    return true;
};

// Changes the appState - the screen that the app is showing and adds the previous screen to the navigation map for
// back button functionality
export const updateAppState = (newAppState, appState, setAppState, navigationMap, setNavigationMap) => {
    const upDatedNavigationMap = [...navigationMap]
    upDatedNavigationMap.push(appState);
    setAppState(newAppState);
    setNavigationMap(upDatedNavigationMap);
}

// Gets the location data from the user using gps. If the user has denied location permissions, on the first attempt will
// display a screen to allow the user to set their location. 
export const getLocationData = async (setAskForLocation, setGpsPermissionGranted) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        const storedLocationData = await checkLocationData()
        if(storedLocationData == null){
            setAskForLocation(true);
            return false;
        }
        else {
            const locationData = JSON.parse(storedLocationData)
            return {
                latitude: locationData.latitude, 
                longitude: locationData.longitude
            };
        }            
    }
    setGpsPermissionGranted(true);
    let currentLocation = await Location.getCurrentPositionAsync({});
    return {
        latitude: currentLocation.coords.latitude, 
        longitude: currentLocation.coords.longitude
    }
}


// Checks async storage for location data.
const checkLocationData = async() => {
    try {
        const value = await AsyncStorage.getItem('setLocation');
        return value;
    } catch (e) {
        return false;
    }
}

// stores the users set location value in AsyncStorage if they have manually set their location
export const storeLocation = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('setLocation', jsonValue);
    } catch (e) {
        Alert.alert("Error saving location")
    }
};

// Checks the time format that the user can set in settings. On first loading the app the default 
// is using 12h time format, this is stored in AsyncStorage
export const checkTimeFormat = async() => {
    const timeFormat = await AsyncStorage.getItem('timeFormat');
    if(timeFormat == null){
        await AsyncStorage.setItem(
            'timeFormat',
            '12h',
        );
        return '12h';
    }
    return timeFormat;
}

// Sets the stored time format in AsyncStorage, argumant should be a string, either '12h' or '24h'
export const saveTimeFormat = async(newFormat) => {
    try {
        await AsyncStorage.setItem(
            'timeFormat',
            newFormat,
        );
    }
    catch (error){
        console.log(`Error setting time format: ${error}`)
    }
}

// Checks the distance format that the user can set in Settings. Default value is km, and this is tored in AsyncStorage
export const checkDistanceFormat = async() => {
    const distanceFormat = await AsyncStorage.getItem('distanceFormat');
    if(distanceFormat == null){
        await AsyncStorage.setItem(
            'distanceFormat',
            'km',
        );
        return 'km';
    }
    return distanceFormat;
}

// Sets the distance format in AsyncStorage. Argument is a string value, either 'km' or 'miles'
export const saveDistanceFormat = async(newFormat) => {
    try {
        await AsyncStorage.setItem(
            'distanceFormat',
            newFormat,
        );
    }
    catch (error){
        console.log(`Error setting distance format: ${error}`)
    }
}

// App will store Attraction data in AsyncStorage to prevent unnecessary calls to the database API. This function will check
// if the user has done this yet and return the data if so.
export const checkStorageAttractionData = async () => {
    try {
        const value = await AsyncStorage.getItem('attractionData');
        if (value !== null) {
            return JSON.parse(value)
        }
        return false
    } catch (e) {
        return false
    }
}

// Stores the attraction data in AsyncStorage
export const storeAttractionsData = async (data) => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('attractionData', jsonValue);
    } catch (error) {
        Alert.alert(error)
    }
}

// Deletes the attraction Data from AsyncStorage. 
export const deleteAttractionsData = async() => {
    await AsyncStorage.removeItem('attractionData')
    return;
}

// gets and returns the attractions data, either from AsyncStorage, or from the database
export const getAttractionData = async (id) => {
    let data = await checkStorageAttractionData()
    if(!data){
        data = await downloadAttractionsData(id)
    }
    return data;
}


// Updated attractions when a tick is inserted or removed. bool argument set to true if box is being ticked, and false if the tick
// is being removed
export function updateAttractions(attractions, updatedAttractionId, bool){
    const updatedAttractions = attractions.map((attraction, i) => {
        if(attraction.id == updatedAttractionId){
            return {
                ...attraction,
                ticked: bool
            }
        } else {
            return attraction
        }
    })
    storeAttractionsData(updatedAttractions)
    return updatedAttractions;
}

// Formats a time stamp based on the user setting, either 12h or 24h
export const formatTime = (timeStamp, timeFormat) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date(timeStamp)
    const timeFormatStyle = timeFormat == "12h" ? "en-US" : "en-UK"
    const currentDate = new Intl.DateTimeFormat(timeFormatStyle, {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: timezone,
    }).format(date)
    return currentDate
}

