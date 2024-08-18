import { supabase } from '../lib/supabase'
import { Alert } from "react-native";

// Gets a Signed URL from supabase for the requested image, takes the image path, and the bucket that it is stored in
export async function getImageUrl(path, bucket) {
    if(!path){
        return;
    }
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 3600, {transform: {
                width: 10,
                height: 10,
            },
        })
        if (error) {
            throw error
        }
        if (data){
            return data.signedUrl;
        }
    } catch (error) {
        Alert.alert("Error", "Unable to find image")
    }
}

// Returns profile data on a single user for the profile page
export async function getProfile(id) {
    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select()
            .eq('id', id)
            .single()
        if (error && status !== 406) {
            throw error
        }
        if (data) {
            if(data.avatar_url){
                // If the user has an avatar_url gets a signed url for that image and attaches it to the returned data
                const imageUrl = await getImageUrl(data.avatar_url, "avatars")
                return {
                    ...data,
                    avatar_signedUrl: imageUrl
                };
            }
            return data;
        }
    } catch (error) {
        Alert.alert("Error", "Unable to recover user data")
    }
}

// Returns the data on a single users Ticks for the profile page 
export const getTicksData = async (id) => {
    let { data, error } = await supabase
        .rpc('get_single_user_ticks', {
            input_id: id
        })
    if(data){
        if(data.length > 0){
            const dataWithUrls = await handleImageUrls(data)
            return dataWithUrls;
        }
        return data;          
    }
    if (error){
        Alert.alert("Error", "Unable to recover ticks data")
    }
}

// Searches and returns users based on a string. The searchType argument allows a search using full_name or email
export const getUserData = async (searchType, searchString, userId) => {
    // The .ilike property makes the search case insenstive
    const { data, error } = await supabase
        .rpc('get_user_data', { user_id: userId})
        .ilike(searchType, `%${searchString}%`)
    if (data){
        if(data.length == 0){
            return data;
        }
        // maps the avatar_urls to an array so that the avatar images can be signed using one request
        const imageUrls = data.map((tick) => {
            return tick.avatar_url
        });
        const signedAvatarUrls = await getImageUrls(imageUrls, 'avatars')
        // adds the signedUrls back to the data objects
        const dataWithImageUrls = data.map((profile, i) => {
            return {
                ...profile,
                avatar_signedUrl: signedAvatarUrls[i].signedUrl
            };
        })
        return dataWithImageUrls;
    }
    if (error){
        Alert.alert("Search Error", error.message)
    }
} 

// Inserts a follow into the follows table to indicate that the user is following another
export const insertFollow = async (followerId, followeeId) => {
    const { error } = await supabase
        .from('follows')
        .insert({follower: followerId, followee: followeeId})
        .select()
    if(error){
        Alert.alert("Add Follow Error", error.message)
    }
} 

// Removes a follow in the follows table to indicate that the user has unfollowed someone
export const removeFollow = async (followerId, followeeId) => {
    const { error } = await supabase
        .from('follows')
        .delete()
        .eq("follower", followerId)
        .eq("followee", followeeId)
        .select()
    if(error){
        Alert.alert("Remove Follow Error", error.message)
    }
} 

// When a user updates their avater, or removes a tick, this function will delete the image from the supabase database.
export const removeImage = async (image, bucket) => {
    if(!image){
        return null;
    }
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove(image)

        if (error) {
            throw error
        }
    } catch (error) {
        Alert.alert("Error Removing Image", error.message)
    }
}

// Saves an image to the supabase database and returns it's path
export const saveImageToSupabase = async (image, bucket) => {
    if(!image){
        return null;
    }
    let imagePath = ""
    try {
        const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

        const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
        const path = `${Date.now()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, arraybuffer)

        if (uploadError) {
            throw uploadError
        }
        
        if(data){
            imagePath = data.path;
            return imagePath
        }
    } catch (error) {
        Alert.alert("Error Saving Image to Database", error.message)
    }
}

// Returns the ticks from all the users that the main user is following
export const getFollowedUserTicks = async (user_id) => {
    try {
        let { data, error } = await supabase
            .rpc('get_followed_user_ticks', {
                input_id: user_id
            })
        if (error) {
            throw(error)  
        } else {
            if (data.length == 0){
                return data;
            }
            const dataWithUrls = await handleImageUrls(data);
            return dataWithUrls;
        }
    } catch (error) {
        Alert.alert("Error Getting Home Screen Data", error.message);
    }   
}

// Retrives signedUrls for the function getFollowedUserTicks
const handleImageUrls = async (tickData) => {
    // creats an array with all the image_urls
    const imageUrls = tickData.map((tick) => {
        return tick.image_url
    });
    // retrices signed urls for these
    const signedTickUrls = await getImageUrls(imageUrls, 'tickImages')
    // creates an array with all the avatarUrls
    const avatarUrls = tickData.map((tick) => {
        return tick.avatar_url
    });
    // retrives signed urls for these
    const signedProfileUrls = await getImageUrls(avatarUrls, 'avatars')
    // replaces each object in the array with a new version with the signed urls attached
    const dataWithImageUrls = tickData.map((tick, i) => {
        return {
            ...tick,
            image_signedUrl: signedTickUrls[i].signedUrl,
            avatar_signedUrl: signedProfileUrls[i].signedUrl
        };
    })
    return dataWithImageUrls;
}

// Processes a request for signedUrls from supabase
export const getImageUrls = async (array, bucket) => {
    if(!array){
        return;
    }
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrls(array, 3600)    
    if (error) {
        throw error
    }
    if (data){
        return data;
    }
}

// Gets the data on all the attractions from supabase
export const downloadAttractionsData = async (user_id) => {
    let { data, error } = await supabase
        .rpc('get_attractions_data', {
            input_id: user_id
        })
    if(data){
        return data;
    }
    if(error){
        Alert.alert("Error Getting Attraction Data", error.message);
    }
}

// Signs the user up for Tickbox Traveller. Code adapted from here - https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
export async function signUpWithEmail(image, email, password, fullName) {
    let imagePath = await saveImageToSupabase(image, "avatars")    
    const {error } = await supabase.auth
        .signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    avatar_url: imagePath != null ? imagePath : "",
                    email: email
                }
            },
        })
    if (error){
        if (error.message === "Database error saving new user"){
            Alert.alert("User name already in use. Please try different user name")
        } else {
            Alert.alert("Error Signing Up User",error.message)
        }            
    }
}

// Updates a user. Takes an updatedUser object, the return value of the function createUserUpdateObject
export const updateProfile = async (updatedUser) => {
    try{
        if(!updatedUser){
            return;
        }
        const { error } = await supabase.auth.updateUser(updatedUser)
        if(error){
            throw error;
        }
        // If the user updates their email, they need to confirm it via an email link
        if("email" in updatedUser){
            Alert.alert("Please check new email address to confirm")
        }
        return true
    }
    catch (error) {
        Alert.alert("Error Updating Profile",error.message);
        return false
    } 
}

// Checks the new user data against the old and creates an object with the required update values
export const createUserUpdateObject = async (full_name, email, user, image) => {
    let updatedUser = {}
    if(user.full_name != full_name){
        updatedUser.full_name = full_name
    }
    if(image){
        updatedUser.avatar_url = await saveImageToSupabase(image, "avatars")
        if(user.avatar_url){
            removeImage(user.avatar_url, "avatars");
        }
    }
    let updatePackage = {}
    if (user.email != email){
        updatePackage.email = email
    }
    if (Object.keys(updatedUser).length > 0){
        updatePackage.data = updatedUser;
    }
    // if nothing need to be updated, ie the new data is exactly the same as the old, returns false and no api calls are needed 
    if (Object.keys(updatePackage).length == 0){
        return false;
    }
    return updatePackage
}

// Inserts a tick into the ticks table
export async function insertTick(id, imageUrl, comment){
    // saves the image to the database
    const imagePath = await saveImageToSupabase(imageUrl, 'tickImages')
    const { data, error } = await supabase
        .from('ticks')
        .insert({ attraction_id: id, comment: comment, image_url: imagePath ? imagePath : null })
        .select()
    if(data){
        return true;
    }
    if(error){
        Alert.alert("Tick not inserted into Database")
        return false;
    }
}

// Removes the tick from the database
export async function removeTick(id, attraction_id){
    const { data, error } = await supabase
        .from('ticks')
        .delete()
        .eq("user_id", id)
        .eq("attraction_id", attraction_id)
        .select()        
    if (data){
        // if the tick had an image with it, this deletes the image from the database
        if(data[0].image_url){
            removeImage(data[0].image_url, "tickImages");    
        }
        return true;                  
    }
    if (error){
        Alert.alert("Tick not removed from database", "Please reset attractions in settings and try again");
    }
}

