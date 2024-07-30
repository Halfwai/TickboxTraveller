import { StyleSheet, View, Alert, Image, Text, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import * as Location from 'expo-location';
import { getDistance, orderByDistance } from 'geolib';
import Checkbox from 'expo-checkbox';

import FontAwesome from '@expo/vector-icons/FontAwesome';

export function HomeScreen() {

    const [ attractions, setAttractions ] = useState(null);
    const [ location, setLocation ] = useState(null);

    useEffect(() => {
        (async () => {            
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }    
            let currentLocation = await Location.getCurrentPositionAsync({});

            setLocation({
                latitude: currentLocation.coords.latitude, 
                longitude: currentLocation.coords.longitude
            })
        })();
    }, []);

    async function getAttractions(){
        const { data, error } = await supabase
            .from('attractions')
            .select()
        if(data){
            try {
                let attractionsList = Object.values(data);
                if (location != null){
                    attractionsList = sortAttractions(attractionsList);
                    await AsyncStorage.setItem(
                        'Attractions',
                        JSON.stringify(attractionsList),
                    );
                    console.log("Saving Data")
                }

              } catch (error) {
                // Error saving data
                console.log(`Error getting data: ${error}`)
              }
        }
    }

    const checkData = async () => {
        if (attractions != null){
            return
        }
        try {
            const value = await AsyncStorage.getItem('Attractions');
            if (value == null) {
                getAttractions();
            } else {
                setAttractions(Object.values(JSON.parse(value)));
            }
          } catch (error) {
            // Error retrieving data
            console.log(error);
          }
    }

    const sortAttractions = (attractionsList) => {
        attractionsList = orderByDistance(location, attractionsList);
        for (let i = 0; i < attractionsList.length; i++){
            const attractionLocation = {
                latitude: attractionsList[i].latitude,
                longitude: attractionsList[i].longitude,
            }
            attractionsList[i].currentDistance = getDistance(location, attractionLocation);
        }
        return attractionsList
    }

    checkData();

    if (attractions == null || location == null){
        return;
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {attractions.map((attraction, i) => (
                    <TickBoxContainer 
                        attraction={attraction}
                        key={i}
                    />
                ))}
            </ScrollView>
        </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      padding: 12,
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
  })

const TickBoxContainer = (props) => {
    const [showDescription, setShowDescription] = useState(false);
    const [isChecked, setChecked] = useState(false);
    return (
        <View
            {...props}        
        >   
            <Text>{props.attraction.name}</Text>
            <Text>{props.attraction.currentDistance}</Text>
            <FontAwesome
                name={showDescription ? "caret-down" : "caret-right"}
                style={{ fontSize: 30 }} 
                onPress={ () => {
                    setShowDescription(!showDescription);
                }}
            />
            <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked}/>
        </View>
    )

}