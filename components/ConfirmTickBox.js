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


export const ConfirmTickBox = (props) => {
    const [showFireWorks, setShowFireWorks] = useState(true);
    setTimeout(() => {
        setShowFireWorks(false)
    }, 4100);

    const [commentText, setCommentText] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    return (
        <View 
            {...props}
            style={styles.container}
        >
            { showFireWorks &&
                <View style={styles.gifContainer}>
                    <Image 
                        source={require("../assets/images/fireworks.gif")}
                        style={styles.gif}
                    />
                </View>
            }
            <View style={styles.headingContainer}>
                <Text style={styles.congratText}>Congratulations</Text>
                <Text>{`for ticking off ${props.attraction.name}`}</Text>
            </View>
            <Input
                leftIcon={ commentText == "" && { type: 'font-awesome', name: 'comment', color: 'white' }}
                onChangeText={(text) => setCommentText(text)}
                value={commentText}
                placeholder="Leave a comment"
                style={styles.input}
                selectionColor={"black"}
                containerStyle={{
                    marginBottom: 0
                }}
                inputContainerStyle={{
                    paddingHorizontal: 10,
                    margin: 0,
                    borderBottomWidth: 0,
                    backgroundColor: "lightgray",
                    borderRadius: 10
                }}
                multiline
            />
            <View style={styles.imageContainer}>
                { imageUrl &&             
                    <Image 
                        source= { imageUrl && {uri: imageUrl.uri}}
                        style={{width: "100%", height: 200, marginBottom: 20}}
                        resizeMode={"contain"}
                    />            
                }
                <CustomButton 
                    action={() => {
                        uploadImage(setImageUrl, setUploading)
                    }}
                    text={uploading ? 'Uploading ...' : 'Upload a picture'}
                    // style={{width: "90%"}}
                />
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton 
                    action={() => {
                        props.removeTick()
                        props.hide()
                    }}
                    text={"Cancel Tick"}
                    style={{width: "45%"}}
                />
                <CustomButton 
                    action={() => {
                        props.insertTick(imageUrl, commentText);
                        props.hide()
                    }}
                    text={"Confirm Tick"}
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
        borderRadius: 10
    },
    gifContainer: {
        top: -50,
        position: "absolute",
        width: "100%",
        alignItems: "center",
        zIndex: 1,
        pointerEvents: "none"
    },
    headingContainer: {
        alignItems: "center",
        marginBottom: 20

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