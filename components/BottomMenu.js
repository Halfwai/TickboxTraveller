import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { UserContext } from '../context/Context'
import React, { useContext  } from 'react'

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { updateAppState } from "../helperFunctions/generalFunctions";

export function BottomMenu(){
    const { currentAppState, currentNavigationMap } = useContext(UserContext);
    const [appState, setAppState] = currentAppState
    const [navigationMap, setNavigationMap] = currentNavigationMap

    const MenuButton = (props) => {
        return (
            <View 
                style={styles.buttonContainer}
                {...props}
            >
                <TouchableOpacity 
                    
                    style={props.highlighted ? styles.highlightedButton : styles.menuButton}
                    onPress={() => {
                        props.action()
                    }}
                >
                    <FontAwesome
                        name={props.icon}
                        style={styles.menuIcon} 
                    />
                    <Text style={styles.menuText}>
                        {props.text}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.menuButtonsContainer}>
            <MenuButton 
                icon={'home'}
                action={() => (
                    updateAppState('home', appState, setAppState, navigationMap, setNavigationMap)
                )}
                text={'Home'}
                highlighted={appState == "home"}
            />
            <MenuButton 
                icon={'map'}
                action={() => (
                    updateAppState('map', appState, setAppState, navigationMap, setNavigationMap)
                )}
                text={'Map'}
                highlighted={appState == "map"}
            />
            <MenuButton 
                icon={'check-square-o'}
                action={() => (
                    updateAppState('log ticks', appState, setAppState, navigationMap, setNavigationMap)
                )}
                text={'Log Ticks'}
                highlighted={appState == "log ticks"}
            />
            <MenuButton 
                icon={'search'}
                action={() => (
                    updateAppState('search', appState, setAppState, navigationMap, setNavigationMap)
                )}
                text={'Search'}
                highlighted={appState == "search"}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    menuButtonsContainer:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: "100%",
        padding: 5,
        backgroundColor: "#1D4A7A",
    },
    buttonContainer: {
        width: '33%',
        alignItems: "center",
    },
    menuButton: {
        alignItems: "center",
        paddingVertical: 10
    },
    highlightedButton: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    menuIcon: {
        fontSize: 40,
        color: "white"

    },
    menuText: {
        color: 'white',
    }


})
