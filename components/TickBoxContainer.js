import { StyleSheet, View, Alert, Image, Text, ScrollView, Pressable, Animated, LayoutAnimation, Platform, UIManager } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef, useContext } from 'react'
import { supabase } from '../lib/supabase'
import * as Location from 'expo-location';
import { getDistance, orderByDistance } from 'geolib';
import Checkbox from 'expo-checkbox';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { UserContext } from '../context/Context';



export const TickBoxContainer = (props) => {
    const [showDescription, setShowDescription] = useState(false);
    const [isChecked, setChecked] = useState(props.attraction.ticked);
    const [tickBoxDisabled, setTickBoxDisabled] = useState(false);

    const splashOpacity = useRef(new Animated.Value(0)).current;
    const animateSplash = () => {
        setTickBoxDisabled(true);
        Animated.sequence([
            Animated.timing(splashOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(splashOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(splashOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            ]
        ).start(() => {
            setTickBoxDisabled(false);
        });
    }

    async function insertTick(){
        const { data, error } = await supabase
            .from('ticks')
            .insert({ user_id: props.session.user.id, attractionid: props.attraction.id })
            .select()
        if(data){
            console.log("tick inserted")
        }
        if(error){
            console.log(error)
        }
        props.attraction.ticked = true;

    }

    async function removeTick(){
        const { data, error } = await supabase
            .from('ticks')
            .delete()
            .eq("user_id", props.session.user.id)
            .eq("attractionid", props.attraction.id)
            .select()        
        if (data){
            console.log(data);
        }
        if (error){
            console.log(error);
        }
        props.attraction.ticked = false;
    }


    return (
        <View
            {...props}
            style={styles.tickBoxContainer}
        >   
            <View style={styles.tickBoxTextContainer}>
                <View style={styles.tickBoxWrap}>
                <FontAwesome
                        name={showDescription ? "caret-down" : "caret-right"}
                        style={styles.toggleIcon} 
                        onPress={ () => {
                            if(!showDescription){
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                            } else {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            }
                            
                            setShowDescription(!showDescription);
                        }}
                    />
                    <Text style={styles.tickBoxMainText}>{props.attraction.name}</Text>
                </View>
                <View style={styles.tickBoxWrap}>
                    <Text>{`${props.attraction.currentDistance} meters away`}</Text>
                </View>                
            </View>
            {showDescription && (
                <View style={[styles.descriptionContainer]} >
                    <Text>{props.attraction.description}</Text>    
                </View>
            )}

            <View style={styles.tickBoxElementContainer}>
                <Image
                    source={{ uri: props.attraction.url }}
                    style={styles.attractionImage}
                />
                <Animated.Image 
                    source={require("../assets/images/tickSplash.png")}
                    style={[styles.tickBoxAnimation, {opacity: splashOpacity}]}
                />  
                <Pressable
                    onPress={() => {
                        if(!isChecked){
                            insertTick();
                            animateSplash();
                        } else {
                            removeTick();
                        }
                        setChecked(!isChecked);
                    }}
                    disabled={tickBoxDisabled}
                >
                    <Image 
                        source={isChecked ? require("../assets/images/tickedBox.png") : require("../assets/images/unTickedBox.png")} 
                        style={styles.tickBox}

                    />
                </Pressable>
            </View>
            
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 12,
    },
    attractionsContainer: {
        // paddingVertical: 20
    },
    tickBoxTextContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        borderBottomColor: "#51A6F5",
        borderBottomWidth: 1
    },
    tickBoxWrap: {
        width: "45%",
        alignItems: "center",
        flexDirection: "row"
    },
    tickBoxMainText: {
        fontSize: 18,
        fontWeight: 'bold',
        flexWrap: "wrap"
    },
    tickBoxElementContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-end",
        paddingVertical: 15,
        borderBottomColor: "#51A6F5",
        borderBottomWidth: 1
    }, 
    toggleIcon: {
        fontSize: 30,
        paddingRight: 10
    },
    attractionImage: {
        width: "100%",
        height: 80,
        position: "absolute"
    },
    tickBox: {
        height: 50,
        width: 50,
        color: "#51A6F5",
        marginRight: 30
        
    },
    tickBoxAnimation: {
        height: 100,
        width: 100,
        top: -10,
        right: 5,
        position: "absolute",
    },
    descriptionContainer: {
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "lightgray"
    }
})