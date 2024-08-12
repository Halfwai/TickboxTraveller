import { StyleSheet, View, Alert, Image, Text, ScrollView, Pressable, Animated, LayoutAnimation, Platform, UIManager } from 'react-native'
import React, { useContext } from 'react'

import { UserContext } from '../context/Context';

import { TickBoxContainer } from './TickBoxContainer'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


export function LogScreen() {
    const { session, attractionsList } = useContext(UserContext);
    const [ attractions ] = attractionsList;
    return (
        <View style={styles.container}>
            <View style={styles.attractionsContainer}>
                <ScrollView>
                    {attractions.map((attraction, i) => (
                        <TickBoxContainer 
                            attraction={attraction}
                            session={session}
                            key={attraction.id}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
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