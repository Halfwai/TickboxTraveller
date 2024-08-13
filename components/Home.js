import { StyleSheet, View, Text, TouchableOpacity, Button, FlatList } from "react-native";
import { useState, useEffect, useMemo, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { UserContext } from "../context/Context";
import { TickView } from "./TickView";



export const Home = (props) => {
    // const { session, currentTicksViewData } = useContext(UserContext)
    // const [ticksData, setTicksData] = currentTicksViewData
    const ticksData = props.ticksData;
    if(!ticksData){
        return;
    }

    return(
        <View style={styles.container}>
            { ticksData?.length > 0 ?
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
                /> :  
                <Text>Nothing to show here. Please Tick some boxes, or use the search tab to find some travellers to follow</Text>            
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})