import React, { useState } from 'react'
import { AppState } from 'react-native'
import { supabase } from '../lib/supabase'

import { SignIn } from '../screens/AuthScreens/SignIn'
import { SignUp } from '../screens/AuthScreens/SignUp'

import { AuthContext } from '../context/Context'

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
    
    const [signingUp, setSigningUp] = useState(false);
    return (
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