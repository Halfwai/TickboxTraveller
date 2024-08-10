import { supabase } from '../lib/supabase'

export async function getImageUrl(setImage, path, bucket) {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 3600)
        if (error) {
            throw error
        }
        if (data){
            setImage(data.signedUrl);
        }
    } catch (error) {
        console.log('Error getting URL: ', error.message)

    }
}