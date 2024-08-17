import { StyleSheet, View, Alert, Text } from 'react-native'
import { useState } from 'react'

import { CustomButton } from './GenericComponents'
import { storeLocation } from '../helperFunctions/generalFunctions';

// uses the country-city-location library to get a list of countries and cities https://www.jsdelivr.com/package/npm/country-city-location
import {
    countries,
    getCitiesByCountryCode,
  } from "country-city-location";

import { Dropdown } from 'react-native-element-dropdown';

// Updates the name of Taiwan
const updatedCountries = countries.map((country) => {
    if(country.Name == "Taiwan, Province of China"){
        return {
            ...country,
            Name: "Taiwan"
        };
    }
    return country;
})

// This component displays a screen to get the location of the user if they deny location permissions. Takes two props, one that sets the location of the user, and one that controls the display of this screen
export const GetLocationScreen = ({setLocation, setAskForLocation}) => {
    const [ pickedLocation, setPickedLocation ] = useState(null);

    const [cityList, setCityList] = useState([]);

    // async function that sets the location to the one picked by the user and returns the user to the main app
    const setValues = async () => {
        await setLocation(pickedLocation);
        await setAskForLocation(false);
        storeLocation(pickedLocation);
        Alert.alert("Location set", "If you wish to change this, you can do so in settings. Better yet, enable location permissions.")
        return
    }

    return (
        <View style={styles.container}>
            <View style={styles.menuBox}>
                <Text>
                    Location permission denied, please manually set your location, or update permission settings
                </Text>
                <Dropdown 
                    style={[styles.dropdown]}
                    data={updatedCountries}
                    labelField="Name"
                    valueField="Alpha2Code"
                    placeholder="Select Country"
                    onChange={item => {
                        setPickedLocation({
                            latitude: parseFloat(item.Latitude),
                            longitude: parseFloat(item.Longitude)
                        })
                        // displays cities list for more accuracy once a country has been picked
                        setCityList(getCitiesByCountryCode(item.Alpha2Code));
                    }}
                />
                <Dropdown 
                    style={[styles.dropdown]}
                    data={cityList}
                    labelField="name"
                    valueField="lat"
                    placeholder="Select City"
                    onChange={item => {
                        setPickedLocation({
                            latitude: parseFloat(item.lat),
                            longitude: parseFloat(item.lng)
                        })
                    }}
                />
                <CustomButton 
                    action={() => {
                        setValues();
                    }}
                    text={"Set Location"}
                    disabled={pickedLocation == null}
                />
            </View>        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1D4A7A"
    },    
    menuBox: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: "white"
    },
    dropdown: {
        height: 50,
        width: "80%",
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 10
    },    
    icon: {
        marginRight: 5,
    },
})