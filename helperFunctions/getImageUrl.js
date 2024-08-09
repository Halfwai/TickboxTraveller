import { supabase } from '../lib/supabase'

export const getImageUrl = async (filename, bucket) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filename, 3600)

    if (data) {
        return data.signedUrl
    }
    if (error) {
        console.log(error);
    }
}