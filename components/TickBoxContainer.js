import {
    StyleSheet,
    View,
    Image,
    Text,
    Pressable,
    Animated,
    LayoutAnimation,
    Modal
} from 'react-native';
import React, { useState, useRef, useContext } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { UserContext } from '../context/Context';
import { ConfirmTickBox } from './ConfirmTickBox';
import { CancelTickBox } from './CancelTickBox';
import { removeTick, insertTick } from '../helperFunctions/supabaseFunctions';
import { updateAttractions } from '../helperFunctions/generalFunctions';

import { theme } from '../global';

// Uses Image Modal library - https://www.npmjs.com/package/react-native-image-modal
import ImageModal from 'react-native-image-modal';
import * as Haptics from 'expo-haptics';

// This component displays a tickbox for the user to tick off the attraction. It takes twp props, the attraction,
// and the width that the image will be. Two different screens use this component, the map screen and the log
//screen, and they have different requirements in terms of how wide the attraction image should be. It also gets two
// objects and one function from UserContext. I did this to avoid prop drilling.
export const TickBoxContainer = ({ attraction, imageWidth }) => {
    const { currentAttractions, currentUserData, setTicksView } = useContext(UserContext);
    const [attractions, setAttractions] = currentAttractions;
    const [userData] = currentUserData;

    const [showDescription, setShowDescription] = useState(false);
    const [isChecked, setChecked] = useState(attraction.ticked);
    const [tickBoxDisabled, setTickBoxDisabled] = useState(false);

    const [showConfirmModel, setShowConfirmModel] = useState(false);
    const [showCancelModel, setShowCancelModel] = useState(false);

    // This code animated the tickbox and makes an star flash behind it when the tickbox is ticked
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
        ]).start(() => {
            setTickBoxDisabled(false);
            setShowConfirmModel(true);
        });
    };

    return (
        <View style={styles.tickBoxContainer}>
            <View style={styles.tickBoxTextContainer}>
                <View style={styles.tickBoxHeadingContainer}>
                    <Pressable style={styles.dropDownPress}
                        onPress={() => {
                            if (!showDescription) {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                            } else {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            }
                            setShowDescription(!showDescription);
                        }}
                    >
                        <FontAwesome
                            name={showDescription ? 'caret-down' : 'caret-right'}
                            style={styles.toggleIcon}

                        />
                        <Text style={styles.tickBoxMainText}>{attraction.name}</Text>
                    </Pressable>

                </View>
                <View style={styles.tickBoxDistanceContainer}>
                    <Text style={styles.text}>{attraction.currentDistance}</Text>
                </View>
            </View>
            {showDescription && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.text}>{attraction.description}</Text>
                </View>
            )}

            <View style={styles.tickBoxElementContainer}>
                <View style={styles.imageContainer}>
                    <ImageModal
                        source={attraction.url != "" && { uri: attraction.url }}
                        style={[styles.attractionImage, { width: imageWidth }]}
                        resizeMode={'hidden'}
                        modalImageResizeMode={'contain'}
                    />
                </View>
                <Animated.Image
                    source={require('../assets/images/tickSplash.png')}
                    style={[styles.tickBoxAnimation, { opacity: splashOpacity }]}
                />
                <Pressable
                    onPress={() => {
                        if (!isChecked) {
                            setChecked(!isChecked);
                            Haptics.notificationAsync(
                                Haptics.NotificationFeedbackType.Success
                            )
                            animateSplash();
                        } else {
                            setShowCancelModel(true);
                        }
                    }}
                    disabled={tickBoxDisabled}
                    style={styles.tickBoxPressable}>
                    <Image
                        source={
                            isChecked
                                ? require('../assets/images/tickedBox.png')
                                : require('../assets/images/unTickedBox.png')
                        }
                        style={styles.tickBox}
                    />
                </Pressable>
            </View>
            {/* There are two Modal overlays for this component. One shows when the user ticks a box to 
            allow them to add a comment and a picture, one shows when a tickbox is aalready ticked to confirm they
            want to delete the tick */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showConfirmModel}>
                <View style={styles.modelContainer}>
                    <ConfirmTickBox
                        attractionName={attraction.name}
                        add={isChecked}
                        hide={() => {
                            setShowConfirmModel(false);
                        }}
                        removeTick={() => {
                            setChecked(false);
                        }}
                        insertTick={async (imageUrl, comment) => {
                            const success = await insertTick(
                                attraction.id,
                                imageUrl,
                                comment
                            );
                            if (success) {
                                setAttractions(
                                    updateAttractions(attractions, attraction.id, true)
                                );
                                setTicksView();
                            }
                        }}
                    />
                </View>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={showCancelModel}>
                <View style={styles.modelContainer}>
                    <CancelTickBox
                        attractionName={attraction.name}
                        add={isChecked}
                        hide={() => {
                            setShowCancelModel(false);
                        }}
                        removeTick={async () => {
                            setChecked(false);
                            const success = await removeTick(userData.id, attraction.id);
                            if (success) {
                                setAttractions(
                                    updateAttractions(attractions, attraction.id, false)
                                );
                                setTicksView();
                            }
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    tickBoxTextContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        borderBottomColor: '#51A6F5',
        borderBottomWidth: 1,
    },
    tickBoxHeadingContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '60%',
    },
    dropDownPress: {
        flexDirection: "row",
        alignItems: "center"
    },
    tickBoxDistanceContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '40%',
    },
    tickBoxMainText: {
        fontSize: 20,
        lineHeight: 30,
        flexWrap: 'wrap',
        fontFamily: theme.fonts.heading,
    },
    text: {
        fontFamily: theme.fonts.regular,
    },
    tickBoxElementContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end',
        paddingVertical: 0,
        borderBottomColor: '#51A6F5',
        borderBottomWidth: 1,
    },
    toggleIcon: {
        fontSize: 30,
        paddingRight: 10,
    },
    imageContainer: {
        height: 80,
    },
    attractionImage: {
        height: 80,
        backgroundColor: "black"
    },
    tickBox: {
        height: 50,
        width: 50,
        color: '#51A6F5',
        marginRight: 30,
    },
    tickBoxPressable: {
        position: 'absolute',
        top: 15,
    },
    tickBoxAnimation: {
        height: 100,
        width: 100,
        top: -10,
        right: 5,
        position: 'absolute',
    },
    descriptionContainer: {
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'lightgray',
    },
    modelContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});