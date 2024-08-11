import { supabase } from '../lib/supabase'

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