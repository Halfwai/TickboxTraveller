import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Modal,
} from 'react-native';
import { UserContext } from '../../context/Context';
import { useContext, useState, useEffect } from 'react';
import { CustomButton, Input } from '../../components/GenericComponents';
import { ToggleButton } from '../../components/ToggleButton';
import {
    saveTimeFormat,
    saveDistanceFormat,
    uploadImage,
} from '../../helperFunctions/generalFunctions';
import {
    updateProfile,
    getProfile,
    createUserUpdateObject,
} from '../../helperFunctions/supabaseFunctions';
import { supabase } from '../../lib/supabase';

// Displays the setting page. Allows the user to change some account settings, as well as some preferences
// within the app. Also allows the user to reset the attractions to the database, and show a Modal with
// information about the app. Also allows the user to log out. Users that have denied location permissions
// will also find a button to change their location.
export const Settings = ({
    resetAttractionsData,
    gpsPermissionGranted,
    showLocationScreen,
}) => {
    const {
        currentUserData,
        currentTimeFormat,
        currentDistanceFormat,
    } = useContext(UserContext);
    const [userData, setUserData] = currentUserData;
    const [timeFormat, setTimeFormat] = currentTimeFormat;
    const [distanceFormat, setDistanceFormat] = currentDistanceFormat;

    const [fullName, setFullName] = useState(userData.full_name);
    const [email, setEmail] = useState(userData.email);

    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [newImage, setNewImage] = useState(null);

    const [showAppDetails, setShowAppDetails] = useState(false);

    // Uploads a new image 
    const uploadNewAvatar = async () => {
        setUploading(true);
        setNewImage(await uploadImage());
        setUploading(false);
    };

    useEffect(() => {
        (async () => {
            setUserData(await getProfile(userData.id));
        })()
    }, [])

    // This function updates the user's data on the database
    const handleUpdate = async () => {
        const updatedUser = await createUserUpdateObject(
            fullName,
            email,
            userData,
            newImage
        );
        if (!updatedUser) {
            return;
        }
        const profileUpdated = await updateProfile(updatedUser);
        if (profileUpdated) {
            setUserData(await getProfile(userData.id));
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.heading}>Settings</Text>
                <View style={styles.subheadingContainer}>
                    <Text style={styles.subheading}>User Settings</Text>
                </View>
                <View style={styles.userInputContainer}>
                    <Input
                        title={'Full Name'}
                        value={fullName}
                        onChange={(text) => {
                            setFullName(text);
                        }}
                        color={'lightgray'}
                    />
                    <Input
                        title={'Email'}
                        value={email}
                        onChange={(text) => {
                            setEmail(text);
                        }}
                        color={'lightgray'}
                    />
                </View>
                <View style={styles.imageInputContainer}>
                    <Image
                        source={
                            newImage
                                ? { uri: newImage.uri }
                                : userData.avatar_signedUrl
                                    ? { uri: userData.avatar_signedUrl }
                                    : null
                        }
                        style={styles.avatarImage}
                        resizeMode="contain"
                    />
                    <CustomButton
                        action={() => uploadNewAvatar()}
                        text={
                            uploading
                                ? 'Uploading ...'
                                : newImage || userData.avatar_signedUrl
                                    ? 'Replace Avatar'
                                    : 'Upload Avatar'
                        }
                        style={{ width: '60%' }}
                    />
                </View>
                <CustomButton
                    text={updating ? 'Saving Changes' : 'Save Changes'}
                    disabled={updating}
                    action={async () => {
                        setUpdating(true);
                        await handleUpdate();
                        setUpdating(false);
                    }}
                />
                <View style={styles.subheadingContainer}>
                    <Text style={styles.subheading}>App Settings</Text>
                </View>
                <ToggleButton
                    title={'Time Format:'}
                    left={{
                        option: '12h',
                        action: () => {
                            setTimeFormat(TIMEFORMATSTYLE.TWELVEHOUR);
                            saveTimeFormat(TIMEFORMATSTYLE.TWELVEHOUR);
                        },
                    }}
                    right={{
                        option: '24h',
                        action: () => {
                            setTimeFormat(TIMEFORMATSTYLE.TWENTYFOURHOUR);
                            saveTimeFormat(TIMEFORMATSTYLE.TWENTYFOURHOUR);
                        },
                    }}
                    startPosition={timeFormat == TIMEFORMATSTYLE.TWELVEHOUR ? 80 : 0}
                />
                <ToggleButton
                    title={'Distance Format:'}
                    left={{
                        option: 'Km',
                        action: () => {
                            setDistanceFormat(DISTANCEFORMATSTYLE.KM);
                            saveDistanceFormat(DISTANCEFORMATSTYLE.KM);
                        },
                    }}
                    right={{
                        option: 'Miles',
                        action: () => {
                            setDistanceFormat(DISTANCEFORMATSTYLE.MILES);
                            saveDistanceFormat(DISTANCEFORMATSTYLE.MILES);
                        },
                    }}
                    startPosition={distanceFormat == DISTANCEFORMATSTYLE.KM ? 80 : 0}
                />
                <View style={styles.buttonContainer}>
                    <CustomButton
                        text={'About App'}
                        action={() => {
                            setShowAppDetails(true);
                        }}
                        style={styles.bottomButton}
                    />
                    <CustomButton
                        text={'Reset Data'}
                        action={async () => {
                            resetAttractionsData();
                        }}
                        style={styles.bottomButton}
                    />
                </View>
                {/* Allows the user to set their location if they have rejected location permissions */}
                {!gpsPermissionGranted && (
                    <CustomButton
                        text={'Set Location'}
                        action={() => {
                            showLocationScreen();
                        }}
                        style={styles.signOutButton}
                    />
                )}
                <CustomButton
                    text={'Sign Out'}
                    action={() => {
                        supabase.auth.signOut();
                    }}
                    style={styles.signOutButton}
                />
                {/* This Modal displays information about the app */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showAppDetails}>
                    <View style={styles.modelContainer}>
                        <View style={styles.modelBox}>
                            <View style={styles.headingContainer}>
                                <Image
                                    source={require('../../assets/images/icon.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                                <Text style={styles.headingText}>TickBox Traveller</Text>
                            </View>
                            <Text style={styles.modelText}>Version: 1.0.0</Text>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.modelText}>
                                    Tickbox Traveller was created and coded by Wai-San Lee. All
                                    attraction images are royalty free from Pixabay and Unsplash.
                                    All Map icons were taken from icons8.com.
                                </Text>
                            </View>

                            <CustomButton
                                text={'Close'}
                                action={() => {
                                    setShowAppDetails(false);
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    subheadingContainer: {
        width: '100%',
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#51A6F5',
    },
    subheading: {
        fontSize: 20,
    },
    userInputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#51A6F5',
        marginBottom: 10,
    },
    imageInputContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    avatarImage: {
        width: '40%',
        height: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    bottomButton: {
        width: '48%',
    },
    modelContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modelBox: {
        borderWidth: 3,
        backgroundColor: '#1D4A7A',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headingText: {
        color: 'white',
        fontSize: 25,
    },
    logo: {
        width: 80,
        height: 80,
        overflow: 'hidden',
    },
    infoTextContainer: {
        marginVertical: 20,
    },
    modelText: {
        color: 'white',
        fontSize: 15,
    },
    signOutButton: {
        width: '100%',
        marginVertical: 10,
    },
});
