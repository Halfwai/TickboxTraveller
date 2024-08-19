import React, { useState, useContext } from 'react';
import { Alert, StyleSheet, View, Image, Text } from 'react-native';
import { Input } from '@rneui/themed';

import { AuthContext } from '../../context/Context';
import { CustomButton } from '../../components/GenericComponents';

import { signUpWithEmail } from '../../helperFunctions/supabaseFunctions';
import { uploadImage } from '../../helperFunctions/generalFunctions';

// This component displays the SignUp page. It allows the user to sign up to Tickbox Traveller
export const SignUp = () => {
  // AuthContext provides some states that can be used across the Auth Route. the saves the user on typing time if
  // they try to login when they mean to sign up, and vice versa
  const { emailState, setSigningUp, passwordState } = useContext(AuthContext);
  const [email, setEmail] = emailState;
  const [password, setPassword] = passwordState;

  // These states allow the user to hide an show thier password to check for typos
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmationPassword, setHideConfirmationPassword] =
    useState(true);
  const [fullName, setFullName] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // This function signs up the user
  async function signUp() {
    if (!validateInput()) {
      return;
    }
    setLoading(true);
    await signUpWithEmail(image, email, password, fullName);
    setLoading(false);
  }

  // This function uploads the Avatar image to the app
  async function uploadAvatar() {
    setUploading(true);
    setImage(await uploadImage());
    setUploading(false);
  }

  // This function performs some front end validation on the user date to be submitted. Supabase also performs
  // some backend validation for example, checking that the email is in the correnct format.
  const validateInput = () => {
    if (fullName == '') {
      Alert.alert('Please input user name');
      return false;
    }
    if (password == '') {
      Alert.alert('Please input password');
      return false;
    }
    if (password != passwordConfirmation) {
      Alert.alert('Passwords do not match, please check and try again');
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headingText}>Tickbox Traveller</Text>
      </View>
      <View style={styles.signUpContainer}>
        <Text style={styles.subheadingText}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <Input
            leftIcon={{
              type: 'font-awesome',
              name: 'envelope',
              color: 'lightgray',
            }}
            onChangeText={(text) => setFullName(text)}
            value={fullName}
            placeholder="Full Name"
            autoCapitalize={'words'}
            style={styles.input}
            selectionColor={'black'}
            inputContainerStyle={styles.inputBox}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            leftIcon={{
              type: 'font-awesome',
              name: 'envelope',
              color: 'lightgray',
            }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
            style={styles.input}
            selectionColor={'black'}
            inputContainerStyle={styles.inputBox}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            leftIcon={{
              type: 'font-awesome',
              name: 'lock',
              color: 'lightgray',
            }}
            rightIcon={{
              type: 'font-awesome',
              name: hidePassword ? 'eye' : 'eye-slash',
              color: 'lightgray',
              onPress: () => {
                setHidePassword(!hidePassword);
              },
            }}
            textContentType={'newPassword'}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={hidePassword}
            placeholder="Password"
            autoCapitalize={'none'}
            style={styles.input}
            selectionColor={'black'}
            inputContainerStyle={styles.inputBox}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            leftIcon={{
              type: 'font-awesome',
              name: 'lock',
              color: 'lightgray',
            }}
            rightIcon={{
              type: 'font-awesome',
              name: hidePassword ? 'eye' : 'eye-slash',
              color: 'lightgray',
              onPress: () => {
                setHideConfirmationPassword(!hideConfirmationPassword);
              },
            }}
            onChangeText={(text) => setPasswordConfirmation(text)}
            value={passwordConfirmation}
            secureTextEntry={hideConfirmationPassword}
            placeholder="Password Confirmation"
            autoCapitalize={'none'}
            style={styles.input}
            selectionColor={'black'}
            inputContainerStyle={styles.inputBox}
          />
        </View>

        <View style={[styles.inputContainer, styles.imageInputContainer]}>
          {image != null ? (
            <Image
              source={{ uri: image.uri }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Image style={styles.logo} resizeMode="contain" />
          )}
          <CustomButton
            action={() => uploadAvatar()}
            text={uploading ? 'Uploading ...' : 'Upload Profile Picture(Optional)'}
            style={{ width: '60%' }}
          />
        </View>
        <View style={styles.inputContainer}>
          <CustomButton
            action={() => {
              signUp();
            }}
            text={'Sign Up'}
            disabled={loading}
          />
        </View>
        <View style={styles.inputContainer}>
          <CustomButton
            action={() => {
              setSigningUp(false);
            }}
            text={'Back to sign in page'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#1D4A7A',
    height: '100%',
  },
  headingContainer: {
    flex: 0.5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'white',
    marginTop: 20,
    paddingBottom: 5,
  },
  headingText: {
    fontSize: 25,
    color: 'white',
  },
  subheadingText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  logo: {
    width: '40%',
    height: 100,
  },
  inputContainer: {
    width: '100%',
    flex: 1,
  },
  input: {
    color: 'black ',
  },
  inputBox: {
    paddingHorizontal: 10,
    margin: 0,
    borderBottomWidth: 0,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signUpContainer: {
    flex: 3,
    alignItems: 'center',
  },
});
