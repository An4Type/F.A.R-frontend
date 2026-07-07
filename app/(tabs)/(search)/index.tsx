import React, { useRef, useState } from "react";
import { router } from "expo-router";
import {
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, TextInput } from "react-native-paper";
import { addFoodConsumedLight, getFoodByPhoto } from "@/app/services/api";
import { ReactStorage, ValEnum } from "@/app/services/reactStorage";

const UploadPhoto = () => {
    const [cameraType, setCameraType] = useState<CameraType>("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [photoTaken, setPhotoTaken] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const [food, setFood] = useState("");
    const [grams, setGrams] = useState();
    const [photoUri, setPhotoUri] = useState("");

    const [showCamera, setShowCamera] = useState(false);

    const toggleCameraType = () => {
        setCameraType((current) => (current === "back" ? "front" : "back"));
    };
    const handlePress = (value: string) => {
        router.push(`./(unit)/${value}`);
    };
    const handleAcceptFood = async () => {
        try {
            const gramsValue = parseFloat(grams);
            if (isNaN(gramsValue)) {
                setError("Invalid number of grams");
                return;
            }
            const dailyInfo = await addFoodConsumedLight({
                mass: gramsValue,
                foodCanName: food.canName,
            });
            ReactStorage.saveVal(ValEnum.DAILYINFO, dailyInfo);
        } catch (error) {
            console.error("Error:", error);
            setError("Error submitting food");
        }
    };

    const takePhoto = async () => {
        if (cameraRef.current) {
            try {
                setLoading(true);
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                    base64: true,
                    imageType: "jpg",
                });

                if (photo?.uri) {
                    const response = await getFoodByPhoto(photo);

                    // Assuming `getFoodByPhoto` expects FormData
                    setFood(response.response.data);
                    setPhotoUri(response.uri);

                    setPhotoTaken(true);
                }
            } catch (err) {
                console.error("Ошибка при создании фото:", err);
                setError("Error taking photo");
            } finally {
                setLoading(false);
            }
        }
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>We need your permission to use the camera</Text>
                <Button onPress={requestPermission}>Grant Permission</Button>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.index}>
                {/* <View style={styles.input}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View> */}
                <Button
                    icon="camera"
                    buttonColor="#89BD71"
                    mode="contained"
                    onPress={() => setShowCamera((prev) => !prev)}
                >
                    Photo
                </Button>

                {showCamera && (
                    <View style={styles.openCamera}>
                        <View style={styles.container}>
                            {!photoTaken ? (
                                <CameraView
                                    ref={cameraRef}
                                    style={styles.camera}
                                    facing={cameraType}
                                >
                                    <View style={styles.controls}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={toggleCameraType}
                                        >
                                            <Text style={styles.text}>Flip Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button} onPress={takePhoto}>
                                            <Text style={styles.text}>Take Photo</Text>
                                        </TouchableOpacity>
                                    </View>
                                </CameraView>
                            ) : (
                                <View style={styles.result}>
                                    <Text style={{ fontSize: 30 }}>Is that {food?.name}?</Text>
                                    <Image source={{ uri: photoUri }} style={styles.image} />
                                    <TextInput
                                        label="Enter the number of grams"
                                        style={{ marginTop: 20, width: "80%" }}
                                        onChangeText={(text) => setGrams(text)}
                                    />
                                    <Button
                                        mode="contained"
                                        buttonColor="#89BD71"
                                        onPress={handleAcceptFood}
                                        style={{ marginTop: 20, marginBottom: 30, width: "80%" }}
                                    >
                                        Confirm
                                    </Button>
                                    <Button onPress={() => setPhotoTaken(false)}>
                                        Take Another Photo
                                    </Button>
                                </View>
                            )}
                            {loading && (
                                <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                    style={styles.loader}
                                />
                            )}
                            {error && <Text style={styles.error}>{error}</Text>}
                        </View>
                    </View>
                )}
                <View style={styles.toplevelUnits}>
                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("meat");
                        }}
                    >
                        <Text>Meat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("fish");
                        }}
                    >
                        <Text>Seafood</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("vegetables");
                        }}
                    >
                        <Text>Vegetables</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("fruits");
                        }}
                    >
                        <Text>Fruits</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("grains");
                        }}
                    >
                        <Text>Grains</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("dairy");
                        }}
                    >
                        <Text>Dairy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("bakery");
                        }}
                    >
                        <Text>Bakery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("snacks");
                        }}
                    >
                        <Text>Snacks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.unit}
                        onPress={() => {
                            handlePress("beverages");
                        }}
                    >
                        <Text>Beverages</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        paddingTop: 30,
        paddingBottom: 30,
    },
    camera: {
        flex: 1,
    },
    image: {
        width: 100, // Set your desired width
        height: 100, // Set your desired height
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    button: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 5,
    },
    text: {
        color: "black",
    },
    result: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loader: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    index: {
        flex: 1,
        paddingHorizontal: 20,
    },
    openCamera: {
        flex: 2,
        display: "flex",
        justifyContent: "center",
        // backgroundColor: "red",
        marginBottom: 40,
    },
    input: {
        flex: 0.2,
        display: "flex",
        justifyContent: "center",
        // backgroundColor: "green",
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
        // backgroundColor: "yellow",
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
    unitLink: {
        width: "100%",
        height: "100%",
        backgroundColor: "red",
    },
});

export default UploadPhoto;
