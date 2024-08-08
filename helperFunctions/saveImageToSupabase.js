export const saveImageToSupabase = async (setLoading) => {
    setLoading(true)
        let imagePath = ""
        try {
            const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

            const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
            const path = `${Date.now()}.${fileExt}`
            console.log(path)
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(path, arraybuffer)

            if (uploadError) {
                throw uploadError
            }
            
            if(data){
                imagePath = data.path;
            }

        } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        } else {
            throw error
        }
        } finally {
            setUploading(false)
            return imagePath;
        }
}


