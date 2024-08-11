import { supabase } from '../lib/supabase'

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