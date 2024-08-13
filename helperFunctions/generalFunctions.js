import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { getDistance, orderByDistance } from 'geolib';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react'


import { GetLocationBox } from '../components/GetLocationBox';


export async function uploadImage(setImage, setUploading) {
    try {
        setUploading(true)

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

        setImage(result.assets[0]);

    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        } else {
            throw error
    }
    } finally {
        setUploading(false)
    }
}



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
        sortedAttractionsList[i].currentDistance = distanceString;
    }
    return sortedAttractionsList
}

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

export const updateAppState = (newAppState, appState, setAppState, navigationMap, setNavigationMap) => {
    const upDatedNavigationMap = [...navigationMap]
    upDatedNavigationMap.push(appState);
    setAppState(newAppState);
    setNavigationMap(upDatedNavigationMap);
}

export const getLocationData = async (setLocation, setAskForLocation) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        const storedLocationData = await checkLocationData()
        if(storedLocationData == null){
            setAskForLocation(true);
            return
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

const checkLocationData = async() => {
    try {
        const value = await AsyncStorage.getItem('setLocation');
        return value;
    } catch (e) {
        return false;
    }
}

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