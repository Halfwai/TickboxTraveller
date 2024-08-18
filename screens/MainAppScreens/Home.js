import { StyleSheet, View, Text, FlatList } from "react-native";
import { TickView } from "../../components/TickView";



export const Home = (props) => {
    const ticksData = props.ticksData;
    if(!ticksData){
        return;
    }
    return(
        <View>
            { ticksData?.length > 0 ?
                <FlatList
                    nestedScrollEnabled
                    data={ticksData}
                    renderItem={item => 
                        <TickView 
                            tick={item} 
                        />
                    }
                    keyExtractor={(item) => item.id}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                /> :
                <View style={styles.textContainer}>
                   <Text style={styles.text}>
                        Nothing to show here. Please Tick some boxes, or use the search tab to find some fellow travellers to follow✈️
                    </Text>     
                </View>
                        
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        padding: 30
    },
    text: {
        fontSize: 20
    }
})