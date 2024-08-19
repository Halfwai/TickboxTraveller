import { StyleSheet, View, Text, FlatList } from 'react-native';
import { TickView } from '../../components/TickView';

// This component displays a FlatList of ticks from the user and other users that they follow
export const Home = (props) => {
  const ticksData = props.ticksData;
  return (
    <View>
      {ticksData?.length > 0 ? (
        <FlatList
          nestedScrollEnabled
          data={ticksData}
          renderItem={(item) => <TickView tick={item} />}
          keyExtractor={(item) => item.id}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
        />
      ) : (
        // if the user has not ticked off any boxes, or follow any other users displays a message
        // informing them of this.
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Nothing to show here. Please Tick some boxes, or use the search tab
            to find some fellow travellers to follow✈️
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    padding: 30,
  },
  text: {
    fontSize: 20,
  },
});
