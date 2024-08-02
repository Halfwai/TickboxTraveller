import React, { useContext }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import { UserContext } from '../context/Context'

export function Map() {
    const { location } = useContext(UserContext)
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
                        style={{height: 500, width: 500}}
                        color={"green"}
                        onPress={() => {
                            console.log("here");
                        }}
                        // icon={require('../assets/mapIcons/tree.png')}
                    />

            </MapView>
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
});