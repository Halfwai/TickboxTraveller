import React, { useState, createContext, useContext  } from 'react'
import { Alert, StyleSheet, View, AppState, Image, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

import { AuthContext } from '../context/Context'


export const SignIn = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { setSigningUp } = useContext(AuthContext);

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
                    <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
                </View>
            </View>
            <View style={styles.signUpButtonContainer}>
                <Text style={styles.subheadingText}>Not a member? Sign up here</Text>
                <View style={styles.inputContainer}>
                    <Button title="Sign up" disabled={loading} onPress={() => setSigningUp(true)} />
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