import { StyleSheet, View, Text } from 'react-native';
import { CustomButton } from './GenericComponents';

// This component displays a modal overlay that checks if the user wants to cancel/delete a tick that they have previously made. It takes three props, the attraction name, a function to hide the modal and a function that removes the tick from the database.
export const CancelTickBox = ({ attractionName, hide, removeTick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text>{`Are you sure you want to cancel your tick for ${attractionName}?`}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          action={() => {
            hide();
          }}
          text={'Back'}
          style={styles.button}
        />
        <CustomButton
          action={() => {
            removeTick();
            hide();
          }}
          text={'Confirm Cancellation'}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#51A6F5',
    borderRadius: 10,
    padding: 10,
  },
  headingContainer: {
    alignItems: 'center',
    marginVertical: 20,
    textAlign: 'center',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  button: {
    width: '45%',
    height: 50,
  },
});
