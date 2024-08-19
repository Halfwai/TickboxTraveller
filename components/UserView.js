import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import {
  removeFollow,
  insertFollow,
} from '../helperFunctions/supabaseFunctions';
import { CustomButton } from './GenericComponents';

import { AvatarImage } from './AvatarImage';
import { UserContext } from '../context/Context';

// This component displays data on a user on the search screen. Takes three props, the user object, the id of the current user
// and the action function which sets the ID for the proile to be displayed and shows the profile page.
export const UserView = ({ userData, sessionId, action }) => {
  const user = userData.item;
  const { setTicksView } = useContext(UserContext);

  // Tracks whether the current user if following this user and gives them the option to either follow or unfollow
  const [isFollowing, setIsFollowing] = useState(user.is_following);

  // if the user found in search is the current user, then no UserView is shown for themself.
  if (sessionId == user.id) {
    return;
  }

  return (
    <View style={styles.userContainer}>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => {
          action();
        }}>
        <AvatarImage
          full_name={user.full_name}
          signedUrl={user.avatar_signedUrl}
          size={55}
        />
        <Text style={styles.nameText}>{user.full_name}</Text>
      </TouchableOpacity>
      <CustomButton
        style={[styles.button, isFollowing && { backgroundColor: 'gray' }]}
        text={isFollowing ? 'Following' : 'Follow'}
        action={async () => {
          if (isFollowing) {
            await removeFollow(sessionId, user.id);
          } else {
            await insertFollow(sessionId, user.id);
          }
          setIsFollowing(!isFollowing);
          setTicksView();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#51A6F5',
    justifyContent: 'space-between',
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  button: {
    width: '40%',
  },
});
