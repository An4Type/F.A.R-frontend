import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Searchbar, Button } from "react-native-paper";

export default function Id() {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handlePress = (value: string) => {
        router.push(`./(item)/${value}`);
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.index}>
                <View style={styles.input}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                    />
                </View>

                <View style={styles.toplevelUnits}>
                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("1")}>
                        <Text>1</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("2")}>
                        <Text>2</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("3")}>
                        <Text>3</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("fruits")}>
                        <Text>4</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("4")}>
                        <Text>5</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("5")}>
                        <Text>6</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("bakery")}>
                        <Text>7</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("snacks")}>
                        <Text>8</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.unit} onPress={() => handlePress("beverages")}>
                        <Text>9</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.openCamera}>
                    <Button
                        icon="camera"
                        mode="contained"
                        buttonColor="#89BD71"
                        onPress={() => console.log("Pressed")}
                    >
                        Press me
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    index: {
        flex: 1,
        paddingHorizontal: 20,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#e8e8e8",
        borderRadius: 8,
        alignItems: "center",
    },
    backButtonText: {
        color: "#007bff",
        fontSize: 16,
    },
    openCamera: {
        flex: 0.1,
        display: "flex",
        justifyContent: "center",
        marginBottom: 40,
    },
    input: {
        flex: 0.2,
        display: "flex",
        justifyContent: "center",
        marginTop: 40,
    },
    toplevelUnits: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        width: "100%",
    },
    unit: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "30%",
        height: "30%",
        backgroundColor: "#e8e8e8",
        borderRadius: 10,
        minWidth: 0,
    },
});
