import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { TickView } from '../../components/TickView';

import {
    getProfile,
    getTicksData,
} from '../../helperFunctions/supabaseFunctions';

import { UserContext } from '../../context/Context';

// This screen displays profile data on a specific user. If the user presses their own profile picture
// it will display themself, otherwise it can will display the user pressed on, either from the search 
// screen, or the home screen.
export const Profile = () => {
    const [ticksData, setTicksData] = useState(null);
    const [profileData, setProfileData] = useState(null);

    const { currentProfileId } = useContext(UserContext);
    const [profileId] = currentProfileId;

    // This useEffect will load the profile information for the user. If the profileId changes this will
    // be updated
    useEffect(() => {
        (async () => {
            setProfileData(await getProfile(profileId));
            setTicksData(await getTicksData(profileId));
        })();
    }, [profileId]);

    return (
        <View style={styles.container}>
            {profileData && (
                <View style={styles.userContainer}>
                    <View style={styles.avatarContainer}>
                        {profileData.avatar_url ? (
                            <Image
                                source={{ uri: profileData.avatar_signedUrl }}
                                style={styles.profileImage}
                                resizeMode={'contain'}
                            />
                        ) : (
                            <Text style={styles.avatarLetter}>
                                {profileData.full_name[0]}
                            </Text>
                        )}
                    </View>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.usernameText}>{profileData.full_name}</Text>
                        {ticksData && (
                            <Text>
                                {ticksData.length == 1
                                    ? `${ticksData.length} box ticked`
                                    : `${ticksData.length} boxes ticked`}
                            </Text>
                        )}
                    </View>
                </View>
            )}
            {ticksData && (
                <FlatList
                    nestedScrollEnabled
                    data={ticksData}
                    renderItem={(item) => <TickView tick={item} />}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatarContainer: {
        height: 100,
        width: 100,
        borderRadius: 25,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 25,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#51A6F5',
        padding: 10,
    },
    avatarLetter: {
        color: 'white',
        fontSize: 50,
    },
    usernameContainer: {
        width: '45%',
        alignItems: 'center',
    },
    usernameText: {
        fontSize: 20,
        textAlign: 'center',
    },
});
