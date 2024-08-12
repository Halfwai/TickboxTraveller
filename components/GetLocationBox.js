import { StyleSheet, View, Alert, Text } from 'react-native'
import { useState, useContext } from 'react'

import { LocationContext } from '../context/Context'

import { CustomButton } from './GenericComponents'

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    countries,
    getCitiesByCountryCode,
  } from "country-city-location";

import { Dropdown } from 'react-native-element-dropdown';

updatedCountries = countries.map((country) => {
    if(country.Name == "Taiwan, Province of China"){
        return {
            ...country,
            Name: "Taiwan"
        };
    }
    return country;
})


export const GetLocationBox = () => {
    const {setLocation, setAskForLocation } = useContext(LocationContext)
    const [ pickedLocation, setPickedLocation ] = useState(null);

    const [cityList, setCityList] = useState([]);

    const setValues = async () => {
        await setLocation(pickedLocation);
        await setAskForLocation(false);
        storeLocation(pickedLocation);
        return
    }

    const storeLocation = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem('setLocation', jsonValue);
        } catch (e) {
          Alert.alert("Error saving location")
        }
      };

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
                        // console.log(setLocation)
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