import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';

import { TickBoxContainer } from '../../components/TickBoxContainer';

// Uses React Native Maps to display a map with each location on it. Locations can be pressed to display a TickBoxContainer with
// more information and a box to tick off.
export function Map(props) {
  const windowWidth = Dimensions.get('window').width;
  const session = props.session;
  const attractions = [...props.attractions];
  const location = props.location;
  const [showAttractionBox, setShowAttractionBox] = useState(false);
  const [attraction, setAttraction] = useState();

  // The AttractionBox is a TickBoxContainer showing information about the attraction that the user has press
  const setupAttractionBox = async (attraction) => {
    setAttraction(attraction);
    setShowAttractionBox(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        onPress={(e) => {
          setShowAttractionBox(false);
        }}>
        <Marker coordinate={location} />
        {attractions.map((attraction, i) => {
          return (
            // Based on the type of attraction a different icon will be displayed
            <Marker
              key={i}
              coordinate={attraction}
              icon={
                attraction.type == 'nature'
                  ? require('../../assets/mapIcons/nature.png')
                  : attraction.type == 'adventure'
                  ? require('../../assets/mapIcons/adventure.png')
                  : attraction.type == 'cultural'
                  ? require('../../assets/mapIcons/cutural.png')
                  : attraction.type == 'entertainment'
                  ? require('../../assets/mapIcons/entertainment.png')
                  : attraction.type == 'festival'
                  ? require('../../assets/mapIcons/festival.png')
                  : attraction.type == 'food'
                  ? require('../../assets/mapIcons/food.png')
                  : attraction.type == 'historic'
                  ? require('../../assets/mapIcons/history.png')
                  : require('../../assets/mapIcons/shopping.png')
              }
              onPress={() => {
                setupAttractionBox(attraction);
              }}></Marker>
          );
        })}
      </MapView>
      {showAttractionBox && (
        <View style={styles.detailsContainer}>
          <TickBoxContainer
            attraction={attraction}
            session={session}
            imageWidth={windowWidth * 0.85}
          />
        </View>
      )}
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
  detailsContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '90%',
    top: '25%',
    left: '5%',
    padding: '2.5%',
    borderRadius: 10,
  },
});