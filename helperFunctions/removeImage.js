import { supabase } from '../lib/supabase'

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