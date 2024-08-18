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

// Returns the data on a single users Ticsk for the profile page 
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

export const getUserData = async (setUserData, searchType, searchString, userId) => {
    const { data, error } = await supabase
        .rpc('get_user_data', { user_id: userId})
        .like(searchType, `%${searchString}%`)
    if (data){
        const imageUrls = data.map((tick) => {
            return tick.avatar_url
        });
        const signedAvatarUrls = await getImageUrls(imageUrls, 'avatars')
        const dataWithImageUrls = data.map((profile, i) => {
            return {
                ...profile,
                avatar_signedUrl: signedAvatarUrls[i].signedUrl
            };
        })
        setUserData(dataWithImageUrls)
    }
    if (error){
        console.log(error)
    }
} 

export const insertFollow = async (followerId, followeeId) => {
    const { data, error } = await supabase
        .from('follows')
        .insert({follower: followerId, followee: followeeId})
        .select()
    if(error){
        console.log(error)
    }
    if (data){
        console.log(data)
    }
} 

export const removeFollow = async (followerId, followeeId) => {
    const { data, error } = await supabase
        .from('follows')
        .delete()
        .eq("follower", followerId)
        .eq("followee", followeeId)
        .select()
    if(error){
        console.log(error)
    }
    if (data){
        console.log(data)
    }
} 

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
        console.log(error);
    }
}

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
        console.log(error);
    }
}

export const getFollowedUserTicks = async (user_id, setData) => {
    try {
        let { data: tickData, error: tickError } = await supabase
            .rpc('get_followed_user_ticks', {
                input_id: user_id
            })
        if (tickError) {
            throw(tickError)  
        } else {
            if (tickData.length == 0){
                setData(tickData)
                return;
            }
            const dataWithUrls = await handleImageUrls(tickData);
            setData(dataWithUrls);
        }
    } catch (error) {
        console.log(`Home screen Error: ${error.message}`);
    }   
}

const handleImageUrls = async (tickData) => {
    const imageUrls = tickData.map((tick) => {
        return tick.image_url
    });
    const signedTickUrls = await getImageUrls(imageUrls, 'tickImages')
    const avatarUrls = tickData.map((tick) => {
        return tick.avatar_url
    });
    const signedProfileUrls = await getImageUrls(avatarUrls, 'avatars')
    const dataWithImageUrls = tickData.map((tick, i) => {
        return {
        ...tick,
        image_signedUrl: signedTickUrls[i].signedUrl,
        avatar_signedUrl: signedProfileUrls[i].signedUrl
        };
    })
    return dataWithImageUrls;
}




export const getImageUrls = async (path, bucket) => {
    let imageSize = 10
    if(bucket == "tickImages"){
        imageSize = 200
    }
    if(!path){
        return;
    }
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrls(path, 3600, {
            transform: {
              width: imageSize,
              height: imageSize,
        },})    
    if (error) {
        throw error
    }
    if (data){
        return data;
    }
}

export const downloadAttractionsData = async (user_id) => {
    let { data, error } = await supabase
        .rpc('get_attractions_data', {
            input_id: user_id
        })
    if(data){
        return data;
    }
    if(error){
        console.log(`Attractions Error: ${error.message}`);
    }
}

export async function signUpWithEmail(image, email, password, fullName) {
    let imagePath = await saveImageToSupabase(image, "avatars")
    
    const {data, error } = await supabase.auth
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
        console.log(error);
        if (error.message === "Database error saving new user"){
            Alert.alert("User name already in use. Please try different user name")
        } else {
            Alert.alert(error.message)
        }            
    }

    if (data){
        
    }
}

export const updateProfile = async (full_name, email, user, image ) => {
    try{
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
        if (Object.keys(updatePackage).length == 0){
            return false;
        } 
        const { error } = await supabase.auth.updateUser(updatePackage)
        if(error){
            throw error;
        }
        if(email in updatePackage){
            Alert.alert("Please check new email address to confirm")
        }
        return true
    }
    catch (error) {
        Alert.alert(error.message);
        return false
    } 
}

export async function insertTick(id, imageUrl, comment){        
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

export async function removeTick(id, attraction_id){
    const { data, error } = await supabase
        .from('ticks')
        .delete()
        .eq("user_id", id)
        .eq("attraction_id", attraction_id)
        .select()        
    if (data){
        if(data[0].image_url){
            removeImage(data[0].image_url, "tickImages");    
        }
        return true;                  
    }
    if (error){
        Alert.alert("Tick not removed from database", "Please reset attractions in settings and try again");
    }
}

