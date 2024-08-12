import { useState, useEffect, useContext, useRef } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'

import { UserContext } from '../context/Context'

import * as React from 'react';

import { getImageUrl } from '../helperFunctions/supabaseFunctions';

export const Header = (props) => {
    const { currentAppState, currentProfileId, session } = useContext(UserContext);
    const [appState, setAppState] = currentAppState;
    const [profileId, setProfileId] =  currentProfileId;

    updateProfileId = async () => {
        setProfileId(session?.user.id);
        setAppState("profile")
    }


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

            <TouchableOpacity
                onPress={() => {
                    updateProfileId() 
                }}
            >
                <Image 
                    source={{ uri: props.profileImage }}
                    style={styles.userImage}
                    resizeMode='contain'
                />
            </TouchableOpacity>



            {/* <Text style={styles.headingText}>Tickbox Traveller</Text> */}
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
        fontSize: 25,
        fontWeight: "bold"
    },
    headingText: {
        fontSize: 30,
    },
    userImage: {
        width: 70,
        height: 70,
        borderRadius: 40,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#51A6F5",
        backgroundColor: "black"
    }
})