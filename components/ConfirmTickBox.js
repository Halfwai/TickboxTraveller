import { StyleSheet, View, Image, Text } from 'react-native';
import React, { useState } from 'react';
import { CustomButton } from './GenericComponents';
import { Input } from '@rneui/themed';
import { uploadImage } from '../helperFunctions/generalFunctions';

import { theme } from '../global';

// This component displays a modal that allows the user to confirm ticking off a box. It also allows them to add comments and an image to the tick if they wish. It takes four
// props, the name of the attraction, and three functions that remove the tick, insert it into the database, and hide the modal
export const ConfirmTickBox = ({
    attractionName,
    removeTick,
    insertTick,
    hide,
}) => {
    // This code displays a gif of firewords for just over 4 seconds when the user first ticks the box
    const [showFireWorks, setShowFireWorks] = useState(true);
    setTimeout(() => {
        setShowFireWorks(false);
    }, 4100);

    // set up component states
    const [commentText, setCommentText] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    // async fuction allows the upload image button be be disabled while the image is uploading
    const uploadTickImage = async () => {
        setUploading(true);
        setImageUrl(await uploadImage());
        setUploading(false);
    };

    return (
        <View style={styles.container}>
            {showFireWorks && (
                <View style={styles.gifContainer}>
                    <Image
                        source={require('../assets/images/fireworks.gif')}
                        style={styles.gif}
                    />
                </View>
            )}
            <View style={styles.headingContainer}>
                <Text style={styles.congratText}>Congratulations</Text>
                <Text style={styles.text}>{`for ticking off ${attractionName}`}</Text>
            </View>
            <Input
                leftIcon={
                    commentText == '' && {
                        type: 'font-awesome',
                        name: 'comment',
                        color: 'white',
                    }
                }
                onChangeText={(text) => {
                    setCommentText(text);
                }}
                value={commentText}
                placeholder="Leave a comment"
                style={styles.input}
                selectionColor={'black'}
                inputContainerStyle={styles.inputContainer}
                multiline
            />
            <View style={styles.imageContainer}>
                {imageUrl && (
                    <Image
                        source={imageUrl && { uri: imageUrl.uri }}
                        style={{ width: '100%', height: 200, marginBottom: 20 }}
                        resizeMode={'contain'}
                    />
                )}
                <CustomButton
                    action={() => {
                        uploadTickImage();
                    }}
                    text={uploading ? 'Uploading ...' : 'Upload a picture'}
                    disabled={uploading}
                />
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton
                    action={() => {
                        removeTick();
                        hide();
                    }}
                    text={'Cancel Tick'}
                    style={{ width: '45%' }}
                />
                <CustomButton
                    action={() => {
                        insertTick(imageUrl, commentText);
                        hide();
                    }}
                    text={'Confirm Tick'}
                    style={{ width: '45%' }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '90%',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#51A6F5',
        borderRadius: 10,
    },
    gifContainer: {
        top: -50,
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        zIndex: 1,
        pointerEvents: 'none',
    },
    headingContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    congratText: {
        fontSize: 30,
        marginVertical: 10,
        fontFamily: theme.fonts.heading,
        lineHeight: 60
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: theme.fonts.regular,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    inputContainer: {
        paddingHorizontal: 10,
        margin: 0,
        borderBottomWidth: 0,
        backgroundColor: 'lightgray',
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
    },
});
