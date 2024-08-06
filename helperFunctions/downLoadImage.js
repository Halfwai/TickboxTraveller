import { supabase } from '../lib/supabase'

export async function downloadImage(setImage, path) {
    try {
        const { data, error } = await supabase.storage.from('avatars').download(path)    
        if (error) {
            throw error
        }

        const fr = new FileReader()
        fr.readAsDataURL(data)
        fr.onload = () => {
            setImage(fr.result)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error downloading image: ', error.message)
        }
    }
}