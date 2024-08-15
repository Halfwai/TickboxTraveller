import React, { useState, useContext  } from 'react'
import { Alert, StyleSheet, View, Image, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Input } from '@rneui/themed'
import * as ImagePicker from 'expo-image-picker'

import { AuthContext } from '../context/Context'
import { CustomButton } from './GenericComponents'

import { signUpWithEmail } from '../helperFunctions/supabaseFunctions'
import { uploadImage } from '../helperFunctions/generalFunctions'



export const SignUp = () => {

    const { emailState, passwordState, setSigningUp } = useContext(AuthContext);
    const [email, setEmail] = emailState;
    const [password, setPassword] = passwordState;

    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmationPassword, setHideConfirmationPassword] = useState(true);

    const [fullName, setFullName] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    async function signUp() {
        if (!validateInput()){
            return;
        }
        setLoading(true)
        await signUpWithEmail(image, email, password, fullName);
        setLoading(false)
    }



    async function uploadAvatar() {
        setUploading(true)      
        setImage(await uploadImage());
        setUploading(false)
    }

    const validateInput = () => {
        if (fullName == ''){
            Alert.alert('Please input user name');
            return false;
        }
        if (password == ""){
            Alert.alert('Please input password')
            return false;
        }
        if (password != passwordConfirmation){
            Alert.alert('Passwords do not match, please check and try again');
            return false;
        }
        return true;
    }


    return (
        <View style={styles.container}>            
            <View style={styles.headingContainer}>
                <Image 
                    source={require("../assets/images/icon.png")}
                    style={styles.logo}
                    resizeMode='contain'
                />
                <Text style={styles.headingText}>Tickbox Traveller</Text>
            </View>
            <View style={styles.signUpContainer}>
                <Text style={styles.subheadingText}>Sign Up</Text>
                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'lightgray' }}
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        placeholder="Full Name"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={"white"}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'lightgray' }}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={"white"}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{ type: 'font-awesome', name: 'lock', color: 'lightgray' }}
                        rightIcon={{ type: 'font-awesome', name: hidePassword ? 'eye':'eye-slash', color: 'lightgray', onPress: () => {
                            setHidePassword(!hidePassword);
                        } }}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={hidePassword}
                        placeholder="Password"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={"white"}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{ type: 'font-awesome', name: 'lock', color: 'lightgray' }}
                        rightIcon={{ type: 'font-awesome', name: hideConfirmationPassword ? 'eye':'eye-slash', color: 'lightgray', onPress: () => {
                            setHideConfirmationPassword(!hideConfirmationPassword);
                        } }}
                        onChangeText={(text) => setPasswordConfirmation(text)}
                        value={passwordConfirmation}
                        secureTextEntry={hideConfirmationPassword}
                        placeholder="Password Confirmation"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={"white"}
                    />
                </View>

                <View style={[styles.inputContainer, styles.imageInputContainer]}>
                    {image != null ? 
                    <Image 
                        source={{ uri: image.uri }}
                        style={styles.logo}
                        resizeMode='contain'
                    /> :                         
                    <Image 
                        style={styles.logo}
                        resizeMode='contain'
                    />}
                    <CustomButton 
                        action={() => 
                            uploadAvatar()
                        }
                        text={uploading ? 'Uploading ...' : 'Upload Profile Picture'}
                        style={{width: "60%"}}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <CustomButton 
                        action={() => {
                            signUp()
                        }}
                        text={"Sign Up"}
                        disabled={loading} 
                    />
                </View>
                <View style={styles.inputContainer}>
                    <CustomButton 
                        action={() => {
                            setSigningUp(false)
                        }}
                        text={"Back to sign in page"}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: "#1D4A7A",
        height: "100%",
    },
    headingContainer: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 2,
        borderColor: 'white',
        marginTop:20
    },
    headingText: {
        fontSize: 50,
        color: "white"
    }, 
    subheadingText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        marginVertical: 10
    },
    logo: {
        width: "40%",
        height: 100
    },
    inputContainer: {
        width: "100%",
        flex: 1
    },
    input: {
        color: 'white',
    },
    imageInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20
    },
    signUpContainer: {
        flex: 3,
        alignItems: "center"  
    },
    button: {
        backgroundColor: "#51A6F5",
        width: "100%",
        height: "60%",
        color: "black",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    }
})