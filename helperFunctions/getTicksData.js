import { supabase } from '../lib/supabase'

export const getTicksData = async (setTicks, id) => {
    const { data, error } = await supabase
        .from('ticks')
        .select()
        .eq("user_id", id)

    if(data){
        try {
            let ticksList = Object.values(data);
            setTicks(ticksList)
        } catch (error) {
            // Error saving data
            console.log(`Error getting data: ${error}`)
        }
    }
    if (error){
        console.log(error);
    }
}