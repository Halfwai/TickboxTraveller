import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { getDistance, orderByDistance } from 'geolib';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LocationContext } from '../context/Context';
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

export const updateAppState = (newAppState, appState, setAppState, navigationMap, setNavigationMap) => {
    const upDatedNavigationMap = [...navigationMap]
    upDatedNavigationMap.push(appState);
    setAppState(newAppState);
    setNavigationMap(upDatedNavigationMap);
}

export const sortAttractions = (attractionsList, location) => {
    let sortedAttractionsList = [...attractionsList];
    sortedAttractionsList = orderByDistance(location, sortedAttractionsList);
    for (let i = 0; i < sortedAttractionsList.length; i++){
        const attractionLocation = {
            latitude: sortedAttractionsList[i].latitude,
            longitude: sortedAttractionsList[i].longitude,
        }
        sortedAttractionsList[i].currentDistance = (getDistance(location, attractionLocation) / 1000).toFixed(2);
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