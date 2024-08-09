import { StyleSheet, View, Alert, Image, Text, TouchableOpacity } from 'react-native'
import { getImageUrl } from "../helperFunctions/getImageUrl";

export const TickView = (tick) => {
    console.log(tick.item)

    console.log(tick.item)
    return (
        <View style={styles.tickInfoContainer}>
            <Image 
                style={styles.tickProfileImage}
            />
            <Text>{`${tick.item.full_name} has sucessfully ticked off ${tick.item.name}`}</Text>
        </View>
        
    )
}