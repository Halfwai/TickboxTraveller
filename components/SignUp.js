import React, { useState, useContext  } from 'react'
import { Alert, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { Input } from '@rneui/themed'
import * as ImagePicker from 'expo-image-picker'

import { AuthContext } from '../context/Context'
import { CustomButton } from './GenericComponents'



export const SignUp = () => {

    const { emailState, passwordState, setSigningUp } = useContext(AuthContext);
    const [email, setEmail] = emailState;
    const [password, setPassword] = passwordState;

    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmationPassword, setHideConfirmationPassword] = useState(true);

    const [userName, setUserName] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        if (!validateInput()){
            return;
        }

        setLoading(true)
        let imagePath = ""
        try {
            const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

            const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
            const path = `${Date.now()}.${fileExt}`
            console.log(path)
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(path, arraybuffer)

            if (uploadError) {
                throw uploadError
            }
            
            if(data){
                imagePath = data.path;
            }

        } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        } else {
            throw error
        }
        } finally {
        setUploading(false)
        }



        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: userName,
                    avatar_url: imagePath != null ? imagePath : ""
                }
            },
        })

        if (error){
            if (error.message === "Database error saving new user"){
                Alert.alert("User name already in use. Please try different user name")
            } else {
                Alert.alert(error.message)
            }            
        } 
        // if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)

    }



    async function uploadAvatar() {
        try {
            setUploading(true)

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
                allowsMultipleSelection: false, // Can only select one image
                allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
                quality: 1,
                exif: false, // We don't want nor need that data.
            })

            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log('User cancelled image picker.')
                return
            }

            setImage(result.assets[0]);

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            } else {
                throw error
        }
        } finally {
            setUploading(false)
        }
    }

    const validateInput = () => {
        if (userName == ''){
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
                        onChangeText={(text) => setUserName(text)}
                        value={userName}
                        placeholder="User Name"
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
                            signUpWithEmail()
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