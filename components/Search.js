import { useState, useEffect, useMemo, useContext } from 'react'
import { StyleSheet, View, TextInput, FlatList } from 'react-native'
import RadioGroup from 'react-native-radio-buttons-group';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { getUserData } from '../helperFunctions/supabaseFunctions';
import { updateAppState } from '../helperFunctions/generalFunctions';

import { UserView } from './UserView';

import { UserContext } from '../context/Context'

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

    const { session, currentProfileId, currentAppState, currentNavigationMap } = useContext(UserContext)
    const [ profileId, setProfileId ] = currentProfileId;
    const [ appState, setAppState ] = currentAppState;
    const [ navigationMap, setNavigationMap ] = currentNavigationMap;
    


    const [selectedId, setSelectedId] = useState('full_name');
    const [searchText, setSearchText] = useState("")
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUserData(setUserData, selectedId, searchText, session.user.id);
    }, [searchText])

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
                                    setProfileId(user.item.id);
                                    updateAppState("profile", appState, setAppState, navigationMap, setNavigationMap)
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