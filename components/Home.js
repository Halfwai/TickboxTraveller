import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import { supabase } from '../lib/supabase'

export const Home = () => {
    return(
        <View>
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
    )
}