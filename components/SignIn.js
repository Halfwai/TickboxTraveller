import React, { useState, useContext  } from 'react'
import { Alert, StyleSheet, View,  Image, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Input } from '@rneui/themed'

import { AuthContext } from '../context/Context'
import { CustomButton } from './GenericComponents'


export const SignIn = () => {
    const { emailState, passwordState, setSigningUp } = useContext(AuthContext);
    const [email, setEmail] = emailState;
    const [password, setPassword] = passwordState;
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
            setLoading(false)
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
            <View style={styles.signInContainer}>
                <Text style={styles.subheadingText}>Sign In</Text>
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
                    <CustomButton 
                        action={() => {
                            signInWithEmail()
                        }}
                        text={"Sign in"}
                        disabled={loading}
                    />
                </View>
            </View>
            <View style={styles.signUpButtonContainer}>
                <Text style={styles.subheadingText}>Not a member? Sign up here</Text>
                <View style={styles.inputContainer}>
                    <CustomButton 
                        action={() => {
                            setSigningUp(true)
                        }}
                        text={"Sign up"}
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
})