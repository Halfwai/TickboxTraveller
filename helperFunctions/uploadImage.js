
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'


export async function uploadImage(setImage, setUploading) {
    try {
        setUploading(true)

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
            allowsMultipleSelection: false, // Can only select one image
            allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
            quality: 1,
            exif: false, // We don't want nor need that data.
        })

        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log('User cancelled image picker.')
            return
        }

        setImage(result.assets[0]);

    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        } else {
            throw error
    }
    } finally {
        setUploading(false)
    }
}