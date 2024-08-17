import { StyleSheet, View, Image, Text, Pressable, Animated, LayoutAnimation, Modal } from 'react-native'
import React, { useState, useRef, useContext } from 'react'

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { UserContext } from '../context/Context';
import { ConfirmTickBox } from './ConfirmTickBox';
import { CancelTickBox } from './CancelTickBox';
import { removeTick, insertTick } from '../helperFunctions/supabaseFunctions';
import { updateAttractions } from '../helperFunctions/generalFunctions';

// Uses Image Modal library - https://www.npmjs.com/package/react-native-image-modal
import ImageModal from 'react-native-image-modal'

// This component displays 
export const TickBoxContainer = ({ attraction, imageWidth }) => {    
    const { currentAttractions, session } = useContext(UserContext);
    const [ attractions, setAttractions ] = currentAttractions;

    const [showDescription, setShowDescription] = useState(false);
    const [isChecked, setChecked] = useState(attraction.ticked);
    const [tickBoxDisabled, setTickBoxDisabled] = useState(false);

    const [showConfirmModel, setShowConfirmModel] = useState(false);
    const [showCancelModel, setShowCancelModel] = useState(false);

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
            setShowConfirmModel(true)
        });
    }

    return (
        <View
            style={styles.tickBoxContainer}
        >   
            <View style={styles.tickBoxTextContainer}>
                <View style={styles.tickBoxHeadingContainer}>
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
                    <Text style={styles.tickBoxMainText}>{attraction.name}</Text>
                </View>
                <View style={styles.tickBoxDistanceContainer}>
                    <Text>{attraction.currentDistance}</Text>
                </View>                
            </View>
            {showDescription && (
                <View style={[styles.descriptionContainer]} >
                    <Text>{attraction.description}</Text>    
                </View>
            )}

            <View style={styles.tickBoxElementContainer}>
                <View style={styles.imageContainer}>
                    <ImageModal
                        source={{ uri: attraction.url }}
                        style={[styles.attractionImage, {width: imageWidth}]}
                        resizeMode={"hidden"}
                        modalImageResizeMode={"contain"}
                    />
                </View>

                <Animated.Image 
                    source={require("../assets/images/tickSplash.png")}
                    style={[styles.tickBoxAnimation, {opacity: splashOpacity}]}
                />  
                <Pressable
                    onPress={() => {            
                        if(!isChecked){
                            setChecked(!isChecked);
                            animateSplash();
                        } else {
                            setShowCancelModel(true)
                        }
                    }}
                    disabled={tickBoxDisabled}
                    style={styles.tickBoxPressable}
                >
                    <Image 
                        source={isChecked ? require("../assets/images/tickedBox.png") : require("../assets/images/unTickedBox.png")} 
                        style={styles.tickBox}
                    />
                </Pressable>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showConfirmModel}
            >
                <View style={styles.modelContainer}>
                    <ConfirmTickBox 
                        attractionName={attraction.name}
                        add={isChecked}
                        hide={() => {
                            setShowConfirmModel(false)
                        }}
                        removeTick={() => {
                            setChecked(false)
                        }}
                        insertTick={async (imageUrl, comment) => {
                            const success = await insertTick(attraction.id, imageUrl, comment);
                            if (success){
                                setAttractions(updateAttractions(attractions, attraction.id, true));
                            }
                        }}
                    />
                </View>               
            </Modal>
            <Modal 
                animationType="slide"
                transparent={true}
                visible={showCancelModel}
            >
                <View style={styles.modelContainer}>
                    <CancelTickBox 
                        attractionName={attraction.name}
                        add={isChecked}
                        hide={() => {
                            setShowCancelModel(false)
                        }}
                        removeTick={async () => {
                            setChecked(false)
                            const success = await removeTick(session.user.id, attraction.id)
                            if (success){
                                setAttractions(updateAttractions(attractions, attraction.id, false));
                                
                            }                            
                        }}
                    />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 12,
    },
    tickBoxTextContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        borderBottomColor: "#51A6F5",
        borderBottomWidth: 1
    },
    tickBoxHeadingContainer: {
        alignItems: "center",
        flexDirection: "row",
        width: "60%"
    },
    tickBoxDistanceContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
        width: "40%"
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
        paddingVertical: 0,
        borderBottomColor: "#51A6F5",
        borderBottomWidth: 1
    }, 
    toggleIcon: {
        fontSize: 30,
        paddingRight: 10
    },
    imageContainer: {
        height: 80
    },
    attractionImage: {
        height: 80,
        
    },
    tickBox: {
        height: 50,
        width: 50,
        color: "#51A6F5",
        marginRight: 30
    },
    tickBoxPressable: {
        position: "absolute",
        top: 15        
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
    },
    modelContainer: {
        height: "100%", 
        width: "100%", 
        justifyContent: "center", 
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white"
    }
})