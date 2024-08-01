import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { UserContext } from '../context/Context'

import * as React from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { BottomMenu } from '../components/BottomMenu';
import { Map } from '../components/Map';


export default function MainApp({ session }) {
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [appState, setAppState] = useState('home');

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        console.log(data);
        setFullName(data.full_name)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
        console.log(error)
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={
        { 
            session,
            currentAppState: [appState, setAppState],
        }        
    }>
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image 
                        source={require("../assets/images/icon.png")}
                        style={styles.logo}
                        resizeMode='contain'
                    />
                <Text style={styles.headingText}>Tickbox Traveller</Text>
            </View>
            <View style={styles.contentContainer}>
                {appState == "record" ? 
                    <HomeScreen session={session}/> :
                    <Map />
                }
                
            </View>
            <View style={styles.footerContainer}>
                <BottomMenu />
            </View>
            <StatusBar style="auto" />
        </View>
    </UserContext.Provider>
  )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: 0
    },
    headerContainer: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: "#1D4A7A",
        flexDirection: "row",
        alignItems: "center",
        // width: "100%",
        // justifyContent: "space-between"
    },
    logo: {
        width: 100,
        height: "100%",
        margin: 0
    },
    headingText: {
        fontSize: 30,
    },
    contentContainer: {
        flex: 6
    },
    footerContainer: {
        flex: 1
    }
})