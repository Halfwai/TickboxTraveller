import React, { useState, createContext, useContext  } from 'react'
import { Alert, StyleSheet, View, AppState, Image, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'


export const SignUp = (props) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        if (password != passwordConfirmation){
            Alert.alert('Passwords do not match, please check and try again');
            return;
        }


        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    avatar_url: image.uri
                }
            },
        })

        if (error) Alert.alert(error.message)
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

            await setImage(result.assets[0]);
            console.log('Got image', image)


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
                <Text style={styles.subheadingText}>Sign In</Text>
                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'lightgray' }}
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
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
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={"white"}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{ type: 'font-awesome', name: 'lock', color: 'lightgray' }}
                        onChangeText={(text) => setPasswordConfirmation(text)}
                        value={passwordConfirmation}
                        secureTextEntry={true}
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
                    <Button
                        title={uploading ? 'Uploading ...' : 'Upload Profile Picture'}
                        onPress={() => {
                            uploadAvatar();
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
                </View>
                <View style={styles.inputContainer}>
                    <Button title="Back to sign in page" disabled={loading} onPress={() => setSigningUp(false)} />
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
    signInContainer: {
        flex: 2,
        borderBottomWidth: 2,
        borderColor: "white",
        alignItems: "center"
    },
    signUpButtonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
    },
    input: {
        color: 'white',
    },
    imageInputContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    signUpContainer: {
        flex: 3        
    }

})