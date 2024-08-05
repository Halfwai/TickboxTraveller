import React, { useContext, useState }from 'react';
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';

import { UserContext } from '../context/Context'


import { TickBoxContainer } from './TickBoxContainer'
import { CustomButton } from './GenericComponents';

export function Map() {
    const { session, currentLocation, attractionsList } = useContext(UserContext)
    const [location, setLocation] = currentLocation


    const attractions = attractionsList[0];
    // const iconImage = require(`../assets/mapIcons/nature.png`)

    const [ showAttractionBox, setShowAttractionBox ] = useState(false);
    const [ attraction, setAttraction ] = useState(attractions[0]);


    return (
        <View style={styles.container}>
            <MapView style={styles.map} 
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 1,
                    longitudeDelta: 1,
                }}
                onPress={(e) => {
                    setShowAttractionBox(false);
                }}             
            >
                <Marker
                    coordinate={location}
                />
                {attractions.map((attraction, i) => {
                    return (
                        <Marker
                        key={i}
                        coordinate={attraction}
                        icon={
                            attraction.type == "nature" ?
                            require(`../assets/mapIcons/nature.png`) :
                            attraction.type == "adventure" ?
                            require(`../assets/mapIcons/adventure.png`) :
                            attraction.type == "cultural" ?
                            require(`../assets/mapIcons/cutural.png`) :
                            attraction.type == "entertainment" ?
                            require(`../assets/mapIcons/entertainment.png`) :
                            attraction.type == "festival" ?
                            require(`../assets/mapIcons/festival.png`) :
                            attraction.type == "food" ?
                            require(`../assets/mapIcons/food.png`) :
                            attraction.type == "historic" ?
                            require(`../assets/mapIcons/history.png`) :
                            require(`../assets/mapIcons/shopping.png`)
                        }
                        onPress={() => {
                            setShowAttractionBox(true)
                            setAttraction(attraction);
                        }}
                        // onCalloutPress={() => {

                        // }}
                    > 
                        {/* <Callout style={styles.callout}>
                            <View style={styles.calloutContainer}>
                                <Text>
                                    {attraction.name}
                                </Text>
                            </View>

                       </Callout> */}
                    </Marker>
                    )

                })

                }
                    


            </MapView>
            {showAttractionBox &&
                <View style={styles.detailsContainer}>
                    <TickBoxContainer 
                        attraction={attraction}
                        session={session}
                    />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    infoBox: {
        backgroundColor: "white",
        position: "absolute"
    },
    callout:{
        justifyContent: "center",
        alignItems: "center",
    },
    calloutContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    detailsContainer: {
        position: "absolute",
        backgroundColor: 'white',
        width: "90%",
        top: "25%",
        left: "5%",
        padding: 10,
        borderRadius: 10
    }
});