import React, { useContext }from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';

import { UserContext } from '../context/Context'


import { TickBoxContainer } from './TickBoxContainer'

export function Map() {
    const { session, location, attractionsList } = useContext(UserContext)
    const attractions = attractionsList[0];
    const iconImage = require(`../assets/mapIcons/nature.png`)
    return (
        <View style={styles.container}>
            <MapView style={styles.map} 
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 1,
                    longitudeDelta: 1,
                }}                
            >
                <Marker
                    coordinate={location}
                    onPress={() => {
                        console.log("here");
                    }}
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
                    > 
                        <Callout>
                            <TickBoxContainer 
                                attraction={attraction}
                                session={session}
                                key={i}
                            />
                            <Button
                                title="Test"
                                onPress={() => {
                                    console.log(attraction.name);
                                }}
                            />
                       </Callout>
                    </Marker>
                    )

                })

                }
                    


            </MapView>
        </View>
    );
}

const InfoBox = (props) => {
    return (
        <View>
            <Text>
                {props.attraction.name}
            </Text>
        </View>
    )
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
    }
});