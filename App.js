import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import Auth from './routes/Auth';
import MainApp from './routes/MainApp';
import { View } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';

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
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      {session && session.user ? (
        <MainApp key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
      <StatusBar style="auto" backgroundColor="#1D4A7A" />
    </View>
  );
}
