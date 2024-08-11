import { supabase } from '../lib/supabase'

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