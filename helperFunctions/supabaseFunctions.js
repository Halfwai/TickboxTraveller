import { supabase } from '../lib/supabase'
import { sortAttractions } from './generalFunctions';

export async function getImageUrl(path, bucket) {
    if(!path){
        return;
    }
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 3600)
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
                    avatar_url: imageUrl
                })
                return;
            }
            setUserData(data)
        }
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    }
}

export const getTicksData = async (setTicks, id) => {
    let { data, error } = await supabase
        .rpc('get_single_user_ticks', {
            input_id: id
        })
    if(data){
        const dataWithUrls = await handleImageUrls(data)
        console.log(dataWithUrls);
        setTicks(dataWithUrls)
    }
    if (error){
        console.log(error);
    }
}

export const getUserData = async (setUserData, searchType, searchString, userId) => {
    console.log(userId)
    const { data, error } = await supabase
        .rpc('get_user_data', { user_id: userId})
        .like(searchType, `%${searchString}%`)

    if (data){
        setUserData(data)
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
    console.log(image)
    if(!image){
        console.log("No Image")
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
    } finally {
        console.log(imagePath)        
    }
}

export const getFollowedUserTicks = async (user_id, setData) => {
    try {
        let { data: tickData, error: tickError } = await supabase
            .rpc('get_followed_user_ticks', {
                user_id: user_id
            })
        if (tickError) {
            throw(tickError)  
        } else {
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
        image_url: signedTickUrls[i].signedUrl,
        avatar_url: signedProfileUrls[i].signedUrl
        };
    })
    return dataWithImageUrls;
}




export const getImageUrls = async (path, bucket) => {
    let imageSize = 50
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

