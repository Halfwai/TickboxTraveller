import { StyleSheet, View, Alert, Image, Text, TouchableOpacity } from 'react-native'
import { getImageUrl } from "../helperFunctions/getImageUrl";
import { useState, useEffect, useContext, useMemo } from 'react'



export const TickView = ({tick}) => {
    let formatTime = () => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(tickData.updated_at)
        const currentDate = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: timezone,
          }).format(date)
        return currentDate
    }

    let tickData = tick.item;
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        getImageUrl(setAvatarUrl, tickData.avatar_url, "avatars")
        getImageUrl(setImageUrl, tickData.image_url, "tickImages");
    }, [])

    const date = useMemo(() => {
        return formatTime()
    })

    console.log(tickData.image_url)
    return (
        <View style={styles.tickInfoContainer}>
            <View style={styles.topContainer}>
                <Image 
                    style={styles.tickProfileImage}
                    source={{uri: avatarUrl}}
                />
                <View style={{flexShrink: 1}}>
                    <Text style={styles.tickText}>
                        {`${tickData.full_name} `}
                    </Text>
                    <Text style={styles.tickText}>
                        {`has sucessfully ticked off ${tickData.name}`}
                    </Text>
                    <Text style={styles.dateText}>
                        {`${date}`}
                    </Text>
                </View>
            </View>
            <View style={styles.imageCommentContainer}>
                { tickData.image_url &&
                    <Image 
                        source={{uri: imageUrl}}
                        style={styles.tickImage}
                        resizeMode='contain'
                    />
                }
                { tickData.comment &&
                    <View style={styles.commentBox}>
                        <Text>
                            {tickData.comment}
                        </Text>
                    </View>
                }

            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    tickInfoContainer: {
        width: "100%",
        paddingHorizontal: 10,
        borderBottomColor: "#51A6F5",
        borderBottomWidth: 2
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    tickProfileImage: {
        height: 50,
        width: 50,
        backgroundColor: "black",
        borderRadius: 25,
        marginRight: 10,
    },
    tickText: {
        flexWrap: "wrap"
    },
    dateText: {
        fontSize: 12,
        fontStyle: "italic"
    },
    tickImage: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "black"
    }, 
    commentBox: {        
        padding: 20,

    },
    imageCommentContainer: {
        // borderRadius: 10,
        // borderWidth: 1,
        // borderColor: "#51A6F5"
    }
})