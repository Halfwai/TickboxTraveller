import { StyleSheet, View, Image, Text, Dimensions } from 'react-native'
import { useMemo, useContext } from 'react'
import { UserContext } from '../context/Context';
import { formatTime } from '../helperFunctions/generalFunctions';

import { AvatarImage } from './AvatarImage'

import ImageModal from 'react-native-image-modal'

//This component displays a completed tick. It shows some information on the user that has ticked off an attraction, and
// the picture and comment from the thick if the user added one. It takes the user as a prop, and also grabs the currentTimeView
// state from UserContext to format the time stamp.
export const TickView = ({tick}) => {
    const { currentTimeFormat } = useContext(UserContext);
    const [ timeFormat ] = currentTimeFormat;
    // let formatTime = () => {
    //     const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //     const date = new Date(tickData.updated_at)
    //     const timeFormatStyle = timeFormat == "12h" ? "en-US" : "en-UK"
    //     const currentDate = new Intl.DateTimeFormat(timeFormatStyle, {
    //         dateStyle: 'full',
    //         timeStyle: 'short',
    //         timeZone: timezone,
    //       }).format(date)
    //     return currentDate
    // }
    let tickData = tick.item;
    const date = useMemo(() => {
        return formatTime(tickData.updated_at, timeFormat)
    })

    // The ImageModel component needs a width in pixels to display properly, this line of code returns the window witdth for this.
    const windowWidth = Dimensions.get('window').width;

    return (
        <View style={styles.tickInfoContainer}>
            <View style={styles.topContainer}>
                <AvatarImage
                    full_name={tickData.full_name}
                    signedUrl={tickData.avatar_signedUrl}
                    size={55}
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
                    <ImageModal 
                        source={{uri: tickData.image_signedUrl}}
                        style={[styles.tickImage, {width: windowWidth - 20}]}
                        resizeMode='contain'
                        animationDuration={300}
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
})