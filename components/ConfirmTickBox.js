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


    console.log(imageUrl);
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
                leftIcon={{ type: 'font-awesome', name: 'comment', color: 'white' }}
                onChangeText={(text) => setCommentText(text)}
                value={commentText}
                placeholder="Leave a comment"
                // autoCapitalize={'none'}
                style={styles.input}
                selectionColor={"black"}
                containerStyle={{
                    padding: 0,
                    marginTop: 20,                    
                }}
                inputContainerStyle={{
                    padding: 5,
                    margin: 0,
                    borderBottomWidth: 0,
                    backgroundColor: "lightgray",
                    borderRadius: 10

                }}
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
                    action={() => 
                        uploadImage(setImageUrl, setUploading)
                    }
                    text={uploading ? 'Uploading ...' : 'Upload a picture'}
                    style={{width: "60%"}}
                />
            </View>




            
            
            <TouchableOpacity
                onPress={() => {
                    props.hide()
                }}
            >
               
                <Text>Test</Text>
            </TouchableOpacity>
            
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "90%",
        // height: "50%",
        // top: "50%",
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#51A6F5",
        borderRadius: 10
    },
    gifContainer: {
        top: -200,
        position: "absolute",
        width: "100%",
        alignItems: "center"
    },
    headingContainer: {
        alignItems: "center",

    },
    congratText: {
        fontSize: 30,
        marginVertical: 10
    }, 
    imageContainer: {
        alignItems: "center",
        justifyContent: "center"    
    },
    image: {
        
    }
})