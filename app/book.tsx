import MapViewComponent from '@/components/MapViewComponent';
import { View, Text, Button } from 'react-native';

export default function BookScreen() {
  return (
     <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', marginTop: 20 }}>Select Location</Text>
      <MapViewComponent />
      <Button title="Confirm Pickup" onPress={() => alert("Booked!")} />
    </View>
  );
}
