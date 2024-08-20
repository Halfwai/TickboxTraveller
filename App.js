import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import Auth from './routes/Auth';
import MainApp from './routes/MainApp';
import { View, Text, StyleSheet } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';
import {
    useFonts,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  } from '@expo-google-fonts/dm-serif-display';

import { theme } from './global';
import * as Font from 'expo-font'

import { StatusBar } from 'expo-status-bar';

// Navigation Bar code for android devices adapted from here - https://github.com/expo/fyi/blob/main/android-navigation-bar-visible-deprecated.md
import * as NavigationBar from 'expo-navigation-bar';
NavigationBar.setPositionAsync('absolute');
NavigationBar.setBackgroundColorAsync('#00000080');

// SplashScreen code adaped from expo splash screen docs - https://docs.expo.dev/versions/latest/sdk/splash-screen/
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [session, setSession] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
        DMSerifDisplay_400Regular: require('./assets/fonts/DMSerifText-Regular.ttf'),
        OpenSans_VariableFont: require('./assets/fonts/OpenSans-VariableFont.ttf'),
        OpenSans_Italic_VariableFont: require("./assets/fonts/OpenSans-Italic-VariableFont.ttf"),
    });
    setFontsLoaded(true);
  };


  useEffect(() => {
    async function prepare() {
      try {
        // Auth code adaped from https://docs.expo.dev/versions/latest/sdk/splash-screen/
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
        // console.log(DMSerifDisplay_400Regular);
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      {session && session.user ? (
        // <View style={{alignItems: "center", justifyContent: "center", height: "100%"}}>
        //     <Text style={styles.text}>Test</Text>
        // </View>
        
        <MainApp key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
      <StatusBar style="auto" backgroundColor="#1D4A7A" />
    </View>
  );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30, fontFamily: theme.fonts.regular
    }
})