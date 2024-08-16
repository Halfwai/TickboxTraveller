import { StyleSheet, View, Text, Image, TextInput, ScrollView, Modal, TouchableOpacity } from "react-native";
import { UserContext } from '../context/Context'
import { useContext, useState, useEffect, useRef } from 'react'
import { CustomButton, ToggleButton } from "./GenericComponents";
import { saveTimeFormat, saveDistanceFormat, uploadImage, deleteAttractionsData } from "../helperFunctions/generalFunctions";
import { updateProfile, getProfile } from "../helperFunctions/supabaseFunctions"
import { supabase } from '../lib/supabase'
import { Input } from './Input'

export const Settings = ({resetAttractionsData, gpsPermissionGranted, showLocationScreen}) => {
    const { currentUserData, currentTimeFormat, currentDistanceFormat, currentAttractions } = useContext(UserContext)
    const [ userData, setUserData ] = currentUserData;
    const [ timeFormat, setTimeFormat ] = currentTimeFormat;
    const [ distanceFormat, setDistanceFormat ] = currentDistanceFormat

    const [ fullName, setFullName ] = useState(userData.full_name);
    const [ email, setEmail] = useState(userData.email);

    const [uploading, setUploading ] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [newImage, setNewImage] = useState(null)

    const [showAppDetails, setShowAppDetails] = useState(false);

    const uploadNewAvatar = async () => {
        setUploading(true);
        setNewImage(await uploadImage())
        setUploading(false);
    }

    const handleUpdate = async() => {
        setUpdating(true)
        const profileUpdated = await updateProfile(fullName, email, userData, newImage);
        if(profileUpdated){
            await getProfile(setUserData, userData.id)
        }        
        setUpdating(false)
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.heading}>Settings</Text>
                <View style={styles.subheadingContainer}>
                    <Text style={styles.subheading}>User Settings</Text>
                </View>
                <View style={styles.userInputContainer}>
                    <Input 
                        title={"Full Name"}
                        value={fullName}
                        onChange={(text) => {
                            setFullName(text)
                        }}
                        color={"lightgray"}
                    />
                    <Input 
                        title={"Email"}
                        value={email}
                        onChange={(text) => {
                            setEmail(text)
                        }}
                        color={"lightgray"}
                    />
                </View>
                <View style={styles.imageInputContainer}>
                    <Image 
                        source={ newImage ? {uri: newImage.uri} : userData.avatar_signedUrl ? {uri: userData.avatar_signedUrl} : null }
                        style={styles.avatarImage}
                        resizeMode='contain'
                    /> 
                    <CustomButton 
                        action={() => 
                            uploadNewAvatar()
                        }
                        text={uploading ? 'Uploading ...' : newImage || userData.avatar_signedUrl ? 'Replace Avatar' : "Upload Avatar"}
                        style={{width: "60%"}}
                    />
                </View>
                <CustomButton 
                    text={updating? "Saving Changes":"Save Changes"}
                    disabled={updating}
                    action={() => {
                        handleUpdate();
                    }}
                />
                <View style={styles.subheadingContainer}>
                    <Text style={styles.subheading}>App Settings</Text>
                </View>
                <ToggleButton 
                    title={"Time Format:"}
                    left={{
                        option: "12h",
                        action: () => {
                            setTimeFormat("12h")
                            saveTimeFormat("12h")
                        }
                    }}
                    right={{
                        option: "24h",
                        action: () => {
                            setTimeFormat("24h")
                            saveTimeFormat("24h")
                        }
                    }}
                    startPosition={timeFormat == '12h' ? 80 : 0}
                />
                <ToggleButton 
                    title={"Distance Format:"}
                    left={{
                        option: "Km",
                        action: () => {
                            setDistanceFormat("km")
                            saveDistanceFormat("km")
                        }
                    }}
                    right={{
                        option: "Miles",
                        action: () => {
                            setDistanceFormat("miles")
                            saveDistanceFormat("miles")
                        }
                    }}
                    startPosition={distanceFormat == 'km' ? 80 : 0}
                />
                <View style={styles.buttonContainer}>
                    <CustomButton 
                        text={"About App"}
                        action={() => {
                            setShowAppDetails(true);
                        }}
                        style={styles.bottomButton}
                    />
                    <CustomButton 
                        text={"Reset Attractions Data"}
                        action={() => {
                            resetAttractionsData();
                        }}
                        style={styles.bottomButton}
                    />   
                </View>
                {   !gpsPermissionGranted &&
                    <CustomButton 
                        text={"Set Location"}
                        action={() => {
                            showLocationScreen();
                        }}
                        style={styles.signOutButton}
                    />
                }
                <CustomButton 
                    text={"Sign Out"}
                    action={() => {
                        supabase.auth.signOut()
                    }}
                    style={styles.signOutButton}
                />   
                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={showAppDetails}
                >
                    <View style={styles.modelContainer}>
                        <View style={styles.modelBox}>
                            <View style={styles.headingContainer}>
                                <Image 
                                        source={require("../assets/images/icon.png")}
                                        style={styles.logo}
                                        resizeMode='contain'
                                />
                                <Text style={styles.headingText}>TickBox Traveller</Text>
                            </View>
                            <Text style={styles.modelText}>Version: 1.0.0</Text>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.modelText}>Tickbox Traveller was created and coded by Wai-San Lee. 
                                    All attraction images are royalty free from Pixabay and Unsplash. All Map icons were
                                    taken from icons8.com. 
                                </Text>
                            </View>

                            <CustomButton 
                                text={"Close"}
                                action={() => {
                                    setShowAppDetails(false);
                                }}
                            />
                        </View>                      
                    </View>
                </Modal> 
            </ScrollView>           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        alignItems: "center"
    },
    heading: {
        fontSize: 25,
        fontWeight: "bold"
    },
    subheadingContainer: {
        width: "100%",
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#51A6F5"
    },
    subheading: {
        fontSize: 20
    },
    userInputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#51A6F5",
        marginBottom: 10
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: 'lightgray',
        height: 50,
        paddingHorizontal: 10
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 10,
        fontSize: 15,
        width: "70%",
        borderRadius: 10
    },
    imageInputContainer: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    settingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 10,
        padding: 10,
        alignItems: "center"
    },
    avatarImage: {
        width: "40%",
        height: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: "100%"
    },
    bottomButton: {
        width: "48%",
    },
    modelContainer: {
        height: "100%", 
        width: "100%", 
        justifyContent: "center", 
        alignItems: "center",
        padding: 20
    },
    modelBox: {
        borderWidth: 3,
        backgroundColor: "#1D4A7A",
        padding: 10,
        borderRadius: 10,
        justifyContent: "center", 
        alignItems: "center",
        width: "100%"
    },
    headingContainer:{
        flexDirection: "row",
        alignItems: "center"
    },
    headingText: {
        color: "white",
        fontSize: 25
    },
    logo: {
        width: 80,
        height: 80,
        overflow: "hidden",
    },
    infoTextContainer: {
        marginVertical: 20
    },
    modelText: {
        color: "white",
        fontSize: 15
    },
    signOutButton: {
        width: "100%",
        marginVertical: 10
    }
})