import { supabase } from '../lib/supabase'

export const getTicksData = async (setTicks, id) => {
    const { data, error } = await supabase
        .from('ticks')
        .select(
            `
            comment,
            image_url,
            updated_at,
            id,
            ...profiles!inner(
            full_name,
            avatar_url
            ),
            ...attractions!inner(
            name,
            id
            )
            `,
        )
        .eq(
            'user_id',
            id,
        )
        .order('updated_at')


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