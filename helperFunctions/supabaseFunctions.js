import { supabase } from '../lib/supabase'
import { sortAttractions } from './generalFunctions';
import { Alert} from "react-native";

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
        console.log('Error getting URL: ', error.message)
    }
}

export async function getProfile(setUserData, id) {
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
                const imageUrl = await getImageUrl(data.avatar_url, "avatars")
                setUserData({
                    ...data,
                    avatar_signedUrl: imageUrl
                })
                return;
            }
            setUserData(data)
        }
    } catch (error) {
        console.log(error)
    }
}

export const getTicksData = async (setTicks, id) => {
    let { data, error } = await supabase
        .rpc('get_single_user_ticks', {
            input_id: id
        })
    if(data){
        const dataWithUrls = await handleImageUrls(data)
        setTicks(dataWithUrls)
    }
    if (error){
        console.log(error);
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
        const { data, error } = await supabase.storage
            .from(bucket)
            .remove(image)

        if (error) {
            throw error
        }
        if(data){
            console.log(data)
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

export const getAttractionsData = async (user_id, setAttractions) => {
    let { data, error } = await supabase
            .rpc('get_attractions_data', {
                input_id: user_id
            })
    if(data){
        setAttractions(data);
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

