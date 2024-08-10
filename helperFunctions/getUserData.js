import { supabase } from '../lib/supabase'

export const getUserData = async (setUserData, searchType, searchString) => {
    const { data, error } = await supabase
        .from('profiles')
        .select()
        .like(searchType, `%${searchString}%`)
    if(error){
        console.log(error)
    }
    if (data){
        setUserData(data);
    }
} 