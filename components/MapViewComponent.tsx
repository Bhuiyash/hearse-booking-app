import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
import MapView, {
  Marker,
  UrlTile,
  Polyline,
  MapPressEvent,
} from "react-native-maps";

export default function MapViewComponent() {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [pickup, setPickup] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [drop, setDrop] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destination, setDestination] = useState("");
  const [loadingDrop, setLoadingDrop] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Allow location access to continue.");
        return;
      }

      let currentLoc = await Location.getCurrentPositionAsync({});
      setLocation(currentLoc.coords);
    })();
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (!pickup) {
      setPickup({ latitude, longitude });
    } else if (!drop) {
      setDrop({ latitude, longitude });
    } else {
      setPickup({ latitude, longitude });
      setDrop(null);
    }
  };

  const handleDestinationSubmit = async () => {
    if (!destination) return;
    setLoadingDrop(true);
    try {
      const results = await Location.geocodeAsync(destination);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setDrop({ latitude, longitude });
      } else {
        Alert.alert("Not found", "Could not find that location.");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to geocode address.");
    }
    setLoadingDrop(false);
  };

  const selectCurrentAsPickup = () => {
    alert("Current location selected as pickup location. Please select the drop point");
    if (location) {
      setPickup({ latitude: location.latitude, longitude: location.longitude });
    }
  };
  const centerOnCurrentLocation = async () => {
    if (!location) return;
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  if (!location) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef} // Add this prop
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        <UrlTile
          urlTemplate="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=f8JputcH6YXBbLyeCqhw"
          maximumZ={19}
        />
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="blue"
        />
        {pickup && (
          <Marker
            coordinate={pickup}
            title="Pickup Location"
            pinColor="green"
          />
        )}
        {drop && (
          <Marker coordinate={drop} title="Drop Location" pinColor="red" />
        )}
        {pickup && drop && (
          <Polyline
            coordinates={[pickup, drop]}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Enter destination address"
        value={destination}
        onChangeText={setDestination}
        onSubmitEditing={handleDestinationSubmit}
        returnKeyType="search"
      />
      {/* Select Current Location as Pickup Button */}
      <TouchableOpacity
        style={styles.pickupBtn}
        onPress={selectCurrentAsPickup}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Select Current Location as Pickup
        </Text>
      </TouchableOpacity>
      {/* Current Location Button */}

      <TouchableOpacity
        style={styles.currentLocationBtn}
        onPress={centerOnCurrentLocation}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Current Location
        </Text>
      </TouchableOpacity>
      {loadingDrop && <ActivityIndicator style={styles.loading} />}
      <Button
        title="Confirm Pickup"
        onPress={() => alert("Hearse is on the way!")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.4,
  },
  input: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    elevation: 2,
  },
  currentLocationBtn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    zIndex: 20,
    elevation: 3,
  },
  loading: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    zIndex: 20,
  },
  pickupBtn: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#28a745",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    zIndex: 11,
    elevation: 2,
  },
});
