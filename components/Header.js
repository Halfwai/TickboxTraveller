import { useState, useEffect, useContext, useRef } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'

import { UserContext } from '../context/Context'
import { updateAppState } from '../helperFunctions/generalFunctions';

import * as React from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';

export const Header = (props) => {
    const { currentAppState, currentProfileId, session, currentNavigationMap } = useContext(UserContext);
    const [appState, setAppState] = currentAppState;
    const [profileId, setProfileId] =  currentProfileId;
    const [navigationMap, setNavigationMap] = currentNavigationMap

    console.log(props);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
                <Image 
                        source={require("../assets/images/icon.png")}
                        style={styles.logo}
                        resizeMode='contain'
                />
                <Text style={styles.stateText}>{appState}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        updateAppState("settings", appState, setAppState, navigationMap, setNavigationMap)
                    }}
                >
                    <FontAwesome 
                        name="cog" 
                        style={styles.settingsIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setProfileId(session?.user.id);
                        updateAppState("profile", appState, setAppState, navigationMap, setNavigationMap)
                    }}
                >
                    <Image 
                        source={{ uri: props.profileImage }}
                        style={styles.userImage}
                        resizeMode='contain'
                    />
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#1D4A7A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        paddingHorizontal: 20
    },
    logo: {
        width: 80,
        height: 80,
        overflow: "hidden",
        left: -10
    },
    logoContainer:{
        flexDirection: "row",
        alignItems: "center"
    },
    stateText: {
        textTransform: "capitalize",
        fontSize: 22,
        fontWeight: "bold",
    },
    buttonContainer:{
        flexDirection: "row",
        alignItems: "center"
    },
    userImage: {
        width: 70,
        height: 70,
        borderRadius: 40,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#51A6F5",
        backgroundColor: "black"
    }, 
    settingsIcon: {
        fontSize: 40,
        borderWidth: 1,
        padding: 5,
        borderRadius: 10,
        backgroundColor: "#51A6F5",
        textAlign: "center",
        marginRight: 10
    }
})