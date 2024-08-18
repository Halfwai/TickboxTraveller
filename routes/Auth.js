import React, { useState } from 'react'
import { AppState } from 'react-native'
import { supabase } from '../lib/supabase'

import { SignIn } from '../screens/AuthScreens/SignIn'
import { SignUp } from '../screens/AuthScreens/SignUp'

import { AuthContext } from '../context/Context'

// Continusly refreshed SupabaseAuth. This code is taken from - https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

// The Auth route runs if the user has not signed in and no token is present
export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [signingUp, setSigningUp] = useState(false);
    return (
        // Context used as both auth pages need access to the same state data
        <AuthContext.Provider value={
            { 
                emailState: [email, setEmail],
                passwordState: [password, setPassword],
                setSigningUp
            }        
        }>
            {signingUp ? <SignUp /> : <SignIn />}          
        </AuthContext.Provider>
    )
}