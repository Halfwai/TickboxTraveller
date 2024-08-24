import React, { useState, useContext } from 'react';
import { Alert, StyleSheet, View, Image, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { Input } from '@rneui/themed';

import { AuthContext } from '../../context/Context';
import { CustomButton } from '../../components/GenericComponents';

import { signUpWithEmail } from '../../helperFunctions/supabaseFunctions';
import { checkTimeFormat, uploadImage } from '../../helperFunctions/generalFunctions';

// This component displays the SignUp page. It allows the user to sign up to Tickbox Traveller
export const SignUp = () => {
    // AuthContext provides some states that can be used across the Auth Route. the saves the user on typing time if
    // they try to login when they mean to sign up, and vice versa
    const { emailState, setSigningUp, passwordState } = useContext(AuthContext);
    const [email, setEmail] = emailState;
    const [password, setPassword] = passwordState;

    // These states allow the user to hide an show thier password to check for typos
    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmationPassword, setHideConfirmationPassword] =
        useState(true);
    const [fullName, setFullName] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showTermsOfService, setShowTermsOfService] = useState(false);
    const [agree, setAgree] = useState(false);

    // This function signs up the user
    async function signUp() {
        if (!validateInput()) {
            return;
        }
        setLoading(true);
        await signUpWithEmail(image, email, password, fullName);
        setLoading(false);
    }

    // This function uploads the Avatar image to the app
    async function uploadAvatar() {
        setUploading(true);
        setImage(await uploadImage());
        setUploading(false);
    }

    // This function performs some front end validation on the user date to be submitted. Supabase also performs
    // some backend validation for example, checking that the email is in the correnct format.
    const validateInput = () => {
        if (agree == false) {
            Alert.alert('Please read and accept terms of service');
            return false;
        }
        if (fullName == '') {
            Alert.alert('Please input user name');
            return false;
        }
        if (password == '') {
            Alert.alert('Please input password');
            return false;
        }
        if (password != passwordConfirmation) {
            Alert.alert('Passwords do not match, please check and try again');
            return false;
        }
        return true;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Image
                    source={require('../../assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.headingText}>Tickbox Traveller</Text>
            </View>
            <View style={styles.signUpContainer}>
                <Text style={styles.subheadingText}>Sign Up</Text>
                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            name: 'envelope',
                            color: 'lightgray',
                        }}
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        placeholder="Full Name"
                        autoCapitalize={'words'}
                        style={styles.input}
                        selectionColor={'black'}
                        inputContainerStyle={styles.inputBox}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            name: 'envelope',
                            color: 'lightgray',
                        }}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={'black'}
                        inputContainerStyle={styles.inputBox}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            name: 'lock',
                            color: 'lightgray',
                        }}
                        rightIcon={{
                            type: 'font-awesome',
                            name: hidePassword ? 'eye' : 'eye-slash',
                            color: 'lightgray',
                            onPress: () => {
                                setHidePassword(!hidePassword);
                            },
                        }}
                        textContentType={'newPassword'}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={hidePassword}
                        placeholder="Password"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={'black'}
                        inputContainerStyle={styles.inputBox}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            name: 'lock',
                            color: 'lightgray',
                        }}
                        rightIcon={{
                            type: 'font-awesome',
                            name: hidePassword ? 'eye' : 'eye-slash',
                            color: 'lightgray',
                            onPress: () => {
                                setHideConfirmationPassword(!hideConfirmationPassword);
                            },
                        }}
                        onChangeText={(text) => setPasswordConfirmation(text)}
                        value={passwordConfirmation}
                        secureTextEntry={hideConfirmationPassword}
                        placeholder="Password Confirmation"
                        autoCapitalize={'none'}
                        style={styles.input}
                        selectionColor={'black'}
                        inputContainerStyle={styles.inputBox}
                    />
                </View>

                <View style={[styles.inputContainer, styles.imageInputContainer]}>
                    {image != null ? (
                        <Image
                            source={{ uri: image.uri }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    ) : (
                        <Image style={styles.logo} resizeMode="contain" />
                    )}
                    <CustomButton
                        action={() => uploadAvatar()}
                        text={uploading ? 'Uploading ...' : 'Upload Profile Picture(Optional)'}
                        style={{ width: '60%', height: 80 }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <CheckBox
                        size={30}
                        title={
                            <View style={styles.checkboxTitleContainer}>
                                <Text>I agree to the </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowTermsOfService(true);
                                    }}
                                >
                                    <Text style={styles.termsText}>
                                        Terms of Service
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                        checked={agree}
                        onPress={() => {
                            setAgree(!agree)
                        }}
                        containerStyle={styles.checkboxContainer}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <CustomButton
                        action={() => {
                            signUp();
                        }}
                        text={'Sign Up'}
                        disabled={loading}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <CustomButton
                        action={() => {
                            setSigningUp(false);
                        }}
                        text={'Back to sign in'}
                    />
                </View>
            </View>
            <Modal animationType="slide" transparent={true} visible={showTermsOfService}>
                <View style={styles.modelContainer}>
                    <View style={styles.termsOfServiceContainer}>
                        <ScrollView>
                            <Text style={styles.termsHeading}>Terms of Servive</Text>
                            <Text style={styles.termSubheading}>
                                1. Introduction
                            </Text>
                            <Text>
                                Welcome to Tickbox Traveller, a social media application where users can mark locations they’ve visited, share comments, and connect with others.
                                By using Tickbox Traveller, you agree to these Terms of Service.
                            </Text>
                            <Text style={styles.termSubheading}>
                                2. User Accounts
                            </Text>
                            <Text> {' - '}
                                <Text style={{ fontWeight: "bold" }}>Account Creation:</Text> To use Tickbox Traveller, you must create an account. The only information required is your email address and a full name, which can be a pseudonym if you prefer.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Account Security:</Text> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</Text>
                            <Text style={styles.termSubheading}>
                                3. User Responsibilities
                            </Text>
                            <Text> {' - '}
                                <Text style={{ fontWeight: "bold" }}>Content Posting:</Text> Users can post comments and images related to the locations they have visited. You must ensure that all content posted is appropriate and not misleading.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Respectful Interaction:</Text> Users must interact respectfully with others on the platform. Harassment, spamming, or abusive behavior is strictly prohibited.
                            </Text>
                            <Text style={styles.termSubheading}>
                                4. Content Ownership and License
                            </Text>
                            <Text> {' - '}
                                <Text style={{ fontWeight: "bold" }}>User-Generated Content:</Text>By posting content on Tickbox Traveller, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content within the app.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>App Content:</Text>All other content within the app, including designs and code, is owned by Tickbox Traveller. Unauthorized use or distribution is prohibited.
                            </Text>
                            <Text style={styles.termSubheading}>
                                5. Privacy Policy
                            </Text>
                            <Text>Your privacy is important to us. This section outlines how we collect, use, and protect your personal information.</Text>
                            <Text> {' - '}
                                <Text style={{ fontWeight: "bold" }}>Information We Collect:</Text>The only personal information we collect is your email address and the full name you provide at registration.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Use of Information:</Text>Your email address is used for authentication and to manage your account. The name you provide is used as your identifier within the app.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Cookies:</Text>Tickbox Traveller uses authentication cookies via Supabase Auth to manage user sessions. These cookies are essential for the functioning of the app.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Data Sharing:</Text>We do not share your personal information with third parties, except as required by law or to protect our legal rights.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Data Security:</Text>TWe take reasonable measures to protect your data from unauthorized access or disclosure. However, no method of transmission over the internet is 100% secure.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>User Rights:</Text>You have the right to access, correct, or delete your personal information at any time. You can manage this through your account settings or by contacting us.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Changes to Privacy Policy:</Text>Any changes to this Privacy Policy will be communicated to you via the app. Continued use of the app signifies acceptance of the updated terms.
                            </Text>
                            <Text style={styles.termSubheading}>
                                6. Termination
                            </Text>
                            <Text> {' - '}
                                <Text style={{ fontWeight: "bold" }}>Termination by You:</Text>You can delete your account at any time through the app.
                            </Text>
                            <Text>{' - '}
                                <Text style={{ fontWeight: "bold" }}>Termination by Us:</Text>We reserve the right to suspend or terminate your account if you violate these Terms of Service.
                            </Text>
                            <Text style={styles.termSubheading}>
                                7. Governing Law and Dispute Resolution
                            </Text>
                            <Text>
                                These Terms of Service are governed by and construed in accordance with the laws of Taiwan (Republic of China). Any legal action or proceeding arising under these Terms will be brought exclusively in the courts of Taiwan, with English as the preferred language for proceedings.
                            </Text>
                            <Text style={styles.termSubheading}>
                                8. Contact Information
                            </Text>
                            <Text>
                                If you have any questions or concerns about these Terms of Service or the Privacy Policy, please contact us at waisanpeterlee@gmail.com</Text>
                            <CustomButton
                                text={"Close"}
                                action={() => {
                                    setShowTermsOfService(false);
                                }}
                            />
                        </ScrollView>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#1D4A7A',
        height: '100%',
    },
    headingContainer: {
        flex: 0.5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'white',
        marginTop: 20,
        paddingBottom: 5,
    },
    headingText: {
        fontSize: 25,
        color: 'white',
    },
    subheadingText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        marginVertical: 10,
    },
    logo: {
        width: '40%',
        height: 100,
    },
    inputContainer: {
        width: '100%',
        justifyContent: "center",
        flex: 1
    },
    input: {
        color: 'black ',
    },
    inputBox: {
        paddingHorizontal: 10,
        margin: 0,
        borderBottomWidth: 0,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    imageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    checkboxTitleContainer: {
        flexDirection: "row"
    },
    checkboxContainer: {
        borderRadius: 10,
        width: "95%"
    },
    termsText: {
        textDecorationLine: "underline",
    },
    signUpContainer: {
        flex: 3,
        alignItems: 'center',
    },
    modelContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsOfServiceContainer: {
        backgroundColor: "white",
        width: "95%",
        justifyContent: "center",
        padding: 20,
        height: "80%",
        borderRadius: 20,
        borderWidth: 3
    },
    termsHeading: {
        fontSize: 30
    },
    termSubheading: {
        fontSize: 20
    }
});
