import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { AvatarImage } from './AvatarImage';

import { UserContext } from '../context/Context';
import { useContext } from 'react';

// Conponent for the header. Takes three props. The the user, a function to set the id for the profile to be displayed and shows the profile page, and the name of the current screen
export const Header = (props) => {
  const { updateAppState } = useContext(UserContext);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <TouchableOpacity
          onPress={() => {
            props.setScreen('home');
          }}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.stateText}>{props.appState}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {/* Pressing on the users image will send you to thier profile */}
        <TouchableOpacity
          onPress={() => {
            props.setProfileId(props.user.id);
            updateAppState(APPSTATE.PROFILE);
          }}>
          <AvatarImage
            full_name={props.user.full_name}
            signedUrl={props.user.avatar_signedUrl}
            size={80}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1D4A7A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    overflow: 'hidden',
    left: -10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stateText: {
    textTransform: 'capitalize',
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});