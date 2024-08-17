import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

// This compnent displays the navigation menu on the bottom of the screen. It takes two props, setScreen is a function that updates a state variable to change the screen displayed,
// and updates an array with the latest screen for back button functionality. The appState prop is the current screen that the app is on so that the right button is highlighted.
export function BottomMenu({setScreen, appState}){
    // Component specific to this screen for the menu buttons. Take 4 props. icon, the name of the font-awesome icon to appear, action, the function to change the app screen displayed, 
    // text, the text to show with the button and highlighed, a boolean to show whether the button should be highlighted
    const MenuButton = (props) => {
        return (
            <View 
                style={styles.buttonContainer}
            >
                <TouchableOpacity
                    // changes the styling on the button depending on if it is the current app screen 
                    style={props.highlighted ? styles.highlightedButton : styles.menuButton}
                    onPress={() => {
                        props.action()
                    }}
                >
                    <FontAwesome
                        name={props.icon}
                        style={styles.menuIcon} 
                    />
                    <Text style={styles.menuText}>
                        {props.text}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    // Contains five menu buttons for the main app pages
    return (
        <View style={styles.menuButtonsContainer}>
            <MenuButton 
                icon={'home'}
                action={() => (
                    setScreen("home")
                )}
                text={'Home'}
                highlighted={appState == "home"}
            />
            <MenuButton 
                icon={'map'}
                action={() => (
                    setScreen("map")
                )}
                text={'Map'}
                highlighted={appState == "map"}
            />
            <MenuButton 
                icon={'check-square-o'}
                action={() => (
                    setScreen("log ticks")
                )}
                text={'Log Ticks'}
                highlighted={appState == "log ticks"}
            />
            <MenuButton 
                icon={'search'}
                action={() => (
                    setScreen("search")
                )}
                text={'Search'}
                highlighted={appState == "search"}
            />
            <MenuButton 
                icon={'cog'}
                action={() => (
                    setScreen("settings")
                )}
                text={'Settings'}
                highlighted={appState == "settings"}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    menuButtonsContainer:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "cneter",
        height: "100%",
        padding: 5,
        backgroundColor: "#1D4A7A",
        paddingHorizontal: 10
    },
    buttonContainer: {
        width: '20%',
        alignItems: "center",
    },
    menuButton: {
        alignItems: "center",
        paddingVertical: 10
    },
    highlightedButton: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: "100%",
        paddingVertical: 10,
        borderRadius: 10,
    },
    menuIcon: {
        fontSize: 40,
        color: "white"
    },
    menuText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12
    }
})
