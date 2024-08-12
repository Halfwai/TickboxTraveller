import { StyleSheet, View, Image, Text, Dimensions } from 'react-native'
import { useState, useEffect, useMemo } from 'react'

import ImageModal from 'react-native-image-modal'

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
    const date = useMemo(() => {
        return formatTime()
    })

    const windowWidth = Dimensions.get('window').width;

    return (
        <View style={styles.tickInfoContainer}>
            <View style={styles.topContainer}>
                <View style={styles.avatarContainer}>
                    { tickData.avatar_url ?
                        <Image
                            style={styles.tickProfileImage}
                            source={{uri: tickData.avatar_url}}
                        /> :
                        <Text style={styles.imageReplacementText}>
                            {tickData.full_name[0]}
                        </Text>
                    }  
                </View>
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
                    <ImageModal 
                        source={{uri: tickData.image_url}}
                        style={[styles.tickImage, {width: windowWidth - 20}]}
                        resizeMode='contain'
                        animationDuration={300}
                        // resizeMethod='resize'
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
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 52,
        width: 52,
        marginRight: 10,
        backgroundColor: "black",
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#51A6F5"
    },
    tickProfileImage: {
        height: 50,
        width: 50,
        borderRadius: 25,                   
    },
    imageReplacementText: {
        color: "white",
        fontSize: 30
    },
    tickText: {
        flexWrap: "wrap"
    },
    dateText: {
        fontSize: 12,
        fontStyle: "italic"
    },
    tickImage: {
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