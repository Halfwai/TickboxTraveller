import { StyleSheet, View, Text, TouchableOpacity, Button, FlatList } from "react-native";
import { useState, useEffect, useMemo, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { getFollowedUserTicks } from "../helperFunctions/supabaseFunctions";
import { UserContext } from "../context/Context";
import { TickView } from "./TickView";



export const Home = () => {
    const { session } = useContext(UserContext)
    const [ticksData, setTicksData] = useState(null)

    useMemo(() => {
        getFollowedUserTicks(session.user.id, setTicksData);
    }, []);

    if(!ticksData){
        return;
    }
    // let result = ticksData.map((tick) => {
    //     return tick.image_url
    // });

    return(
        <View>
            { ticksData &&
                <FlatList
                    nestedScrollEnabled
                    data={ticksData}
                    renderItem={item => 
                        <TickView 
                            tick={item} 
                        />
                    }
                    keyExtractor={(item) => item.id}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                />
            }
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
    )
}