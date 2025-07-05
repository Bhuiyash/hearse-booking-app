import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';

export default function MapViewComponent() {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 28.6139, // New Delhi
        longitude: 77.2090,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <UrlTile
        urlTemplate="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=f8JputcH6YXBbLyeCqhw"
        maximumZ={19}
        flipY={false}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
});
