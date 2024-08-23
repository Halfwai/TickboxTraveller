import { StyleSheet, View, Text, FlatList } from 'react-native';
import { TickView } from '../../components/TickView';
import { useState, useContext } from 'react';

import { UserContext } from '../../context/Context';

// This component displays a FlatList of ticks from the user and other users that they follow
export const Home = (props) => {
  const ticksData = props.ticksData;
  const [refreshing, setRefreshing] = useState(false);
  const { setTicksView, currentUserData } = useContext(UserContext);
  const [userData] = currentUserData;
  return (
    <View>
        <FlatList
          nestedScrollEnabled
          data={ticksData}
          renderItem={(item) => <TickView tick={item} />}
          keyExtractor={(item) => item.id}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          refreshing={refreshing}
          onRefresh={async() => {
            setRefreshing(true);
            await setTicksView(userData.id);
            setRefreshing(false);
          }}
          ListEmptyComponent={() => (
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Nothing to show here. Please Tick some boxes, or use the search tab
            to find some fellow travellers to follow✈️
          </Text>
        </View>
          )}
        />
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
