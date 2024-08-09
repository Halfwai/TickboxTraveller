import { supabase } from '../lib/supabase'

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
        // if (error instanceof Error) {
        //     Alert.alert(error.message)
        // } else {
        //     throw error
        // }
    } finally {
        console.log(imagePath)        
    }
}


