import { StyleSheet, View, Text, Image, TextInput, Button } from "react-native";
import { UserContext } from '../context/Context'
import { useContext, useState, useEffect, useRef } from 'react'
import { CustomButton, ToggleButton } from "./GenericComponents";
import { saveTimeFormat, saveDistanceFormat, uploadImage } from "../helperFunctions/generalFunctions";
import { updateProfile } from "../helperFunctions/supabaseFunctions"
import { supabase } from '../lib/supabase'

export const Settings = () => {
    const { currentUserData, currentTimeFormat, currentDistanceFormat } = useContext(UserContext)
    const [ userData, setUserData ] = currentUserData;

    const [ timeFormat, setTimeFormat ] = currentTimeFormat;
    const [ distanceFormat, setDistanceFormat ] = currentDistanceFormat

    const [ fullName, setFullName ] = useState(userData.full_name);
    const [ email, setEmail] = useState(userData.email);

    const [uploading, setUploading ] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [newImage, setNewImage] = useState(null)

    const uploadNewAvatar = async () => {
        setUploading(true);
        setNewImage(await uploadImage())
        setUploading(false);
    }

    const handleUpdate = async() => {
        setUpdating(true)
        await updateProfile(userData.id, fullName, email, newImage);
        setUpdating(false)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <View style={styles.subheadingContainer}>
                <Text style={styles.subheading}>User Settings</Text>
            </View>
            <View style={styles.userInputContainer}>
                <View style={styles.inputContainer}>
                    <Text>Full Name:</Text>
                    <TextInput
                        leftIcon={{type: 'font-awesome', name: 'search', color: 'gray'}}
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        style={styles.input}
                        selectionColor={"black"}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Email:</Text>
                    <TextInput
                        leftIcon={{type: 'font-awesome', name: 'search', color: 'gray'}}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        style={styles.input}
                        selectionColor={"black"}
                    />
                </View>
            </View>
            <View style={styles.imageInputContainer}>
                <Image 
                    // source={{ uri: userData.avatar_signedUrl }}
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
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center"
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold"
    },
    subheadingContainer: {
        width: "100%",
        paddingHorizontal: 10,
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
    }
})