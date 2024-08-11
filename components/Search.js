import { useState, useEffect, useMemo, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, Text, TextInput, FlatList } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import RadioGroup from 'react-native-radio-buttons-group';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Input } from '@rneui/themed'
import { getUserData } from '../helperFunctions/getUserData';
import { getImageUrl } from "../helperFunctions/getImageUrl";

import { UserView } from './UserView';

import { UserContext } from '../context/Context'

import { insertFollow } from '../helperFunctions/insertFollow';

export const Search = () => {
    const radioButtons = useMemo(() => ([
        {
            id: 'full_name', // acts as primary key, should be unique and non-empty string
            label: 'Search by Name',
        },
        {
            id: 'email',
            label: 'Search by Email',
        }
    ]), []);

    const { session } = useContext(UserContext)


    const [selectedId, setSelectedId] = useState('full_name');
    const [searchText, setSearchText] = useState("")
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUserData(setUserData, selectedId, searchText, session.user.id);
    }, [searchText])

    console.log(userData);
    return (
        <View>
            <View style={styles.headingContainer}>
                <View style={styles.searchContainer}>
                <FontAwesome name="search" style={styles.searchText}/>
                <TextInput
                    leftIcon={{type: 'font-awesome', name: 'search', color: 'gray'}}
                    onChangeText={(text) => setSearchText(text)}
                    value={searchText}
                    placeholder="Search for user"
                    style={styles.searchText}
                    selectionColor={"black"}
                    multiline
                />
                </View>
                <RadioGroup 
                    radioButtons={radioButtons} 
                    onPress={ (id) => {
                        setSelectedId(id)
                    }}
                    selectedId={selectedId}
                    layout='row'
                />
            </View>
            <View style={styles.searchResultsContainer}>
                { userData &&
                    <FlatList
                        nestedScrollEnabled
                        data={userData}
                        renderItem={user => 
                            <UserView
                                user={user}
                                action={() => {
                                    console.log("here")
                                }}
                                key={user.id}
                                sessionId={session.user.id}
                                
                            />
                        }
                    />

                }



                {/* { userData &&
                    userData.map((user) => {
                        if (user.id != session.user.id){
                            return (
                                   
                            )  
                        }
                    })
                } */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headingContainer:{
        borderBottomWidth: 2,
        borderBottomColor: "#51A6F5"
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "lightgray"
    }, 
    searchText: {
        fontSize: 20
    }
})