import React, { useState, createContext, useContext  } from 'react'
import { Alert, StyleSheet, View, AppState, Image, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [signingUp, setSigningUp] = useState(false);

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
            setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
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
                    <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
                </View>
            </View>
            <View style={styles.signUpContainer}>
                <Text style={styles.subheadingText}>Not a member? Sign up here</Text>
                <View style={styles.inputContainer}>
                    <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
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
    signUpContainer: {
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
        width: "100%"
    },
    input: {
        color: 'white',
    },

})