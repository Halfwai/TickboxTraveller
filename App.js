import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import MainApp from './components/MainApp'
import { View, Text } from 'react-native'
import * as Font from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [session, setSession] = useState(null);
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                supabase.auth.getSession().then(({ data: { session } }) => {
                    setSession(session);
                })
        
                supabase.auth.onAuthStateChange((_event, session) => {
                    setSession(session);
                })

                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }
        prepare();

    }, [])

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
          // This tells the splash screen to hide immediately! If we call this after
          // `setAppIsReady`, then we may see a blank screen while the app is
          // loading its initial state and rendering its first pixels. So instead,
          // we hide the splash screen once we know the root view has already
          // performed layout.
          await SplashScreen.hideAsync();
        }
      }, [appIsReady]);
    
      if (!appIsReady) {
        return null;
      }

    return (
        <View
            onLayout={onLayoutRootView}
        >
            {session && session.user ? <MainApp key={session.user.id} session={session} /> : <Auth />}
        </View>
    )
}
