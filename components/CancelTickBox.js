import { StyleSheet, View, Alert, Image, Text, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef, useContext } from 'react'
import { supabase } from '../lib/supabase'
import * as Location from 'expo-location';
import { getDistance, orderByDistance } from 'geolib';
import Checkbox from 'expo-checkbox';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { UserContext } from '../context/Context';

import { CustomButton } from './GenericComponents';

import { Input } from '@rneui/themed'

import { uploadImage } from '../helperFunctions/uploadImage';

export const CancelTickBox = (props) => {
    return (
        <View 
            {...props}
            style={styles.container}
        >
            <View style={styles.headingContainer}>
                {/* <Text style={styles.congratText}>Congratulations</Text> */}
                <Text>{`Are you sure you want to cancel your tick for ${props.attraction.name}?`}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <CustomButton 
                    action={() => {
                        props.hide()
                    }}
                    text={"Back"}
                    style={{width: "45%"}}
                />
                <CustomButton 
                    action={() => {
                        props.removeTick()
                        props.hide()
                    }}
                    text={"Confirm Cancelation"}
                    style={{width: "45%"}}
                />
            </View>            
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "90%",
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#51A6F5",
        borderRadius: 10,
        paddingVertical: 10
    },
    headingContainer: {
        alignItems: "center",
        marginVertical: 20,
        textAlign: "center"

    },
    congratText: {
        fontSize: 30,
        marginVertical: 10
    }, 
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    image: {
        
    },
    buttonContainer: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between"
    }
})