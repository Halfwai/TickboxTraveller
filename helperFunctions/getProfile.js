import { supabase } from '../lib/supabase'

export async function getProfile(setUserData, id) {
    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select()
            .eq('id', id)
            .single()
        if (error && status !== 406) {
            throw error
        }

        if (data) {
            setUserData(data)
        }
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    }
}