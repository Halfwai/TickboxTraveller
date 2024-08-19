import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
} from 'react-native';

import { TickBoxContainer } from '../../components/TickBoxContainer';

// This screen displays a FlatList containing attractions, some information, and a tick box
export function LogScreen(props) {
  // The tickbox uses a ImageModal component from the ImageModal library. It needs a width
  // value rather than a percentage. The Map view also uses this component and they have different
  // width requirements, so windowWidth is passed as a prop to the TickBoxContainer    
  const windowWidth = Dimensions.get('window').width;
  const attractions = props.attractions;
  return (
    <View style={styles.container}>
      <View style={styles.attractionsContainer}>
        <FlatList
          nestedScrollEnabled
          data={attractions}
          renderItem={(attraction) => (
            <TickBoxContainer
              attraction={attraction.item}
              key={attraction.item.id}
              imageWidth={windowWidth - 20}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
});
