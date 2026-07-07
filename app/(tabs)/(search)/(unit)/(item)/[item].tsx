import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

export default function Id() {
    const { id } = useLocalSearchParams();
    const [productData, setProductData] = useState<any | null>(null);

    // Mock data for demonstration, replace with AI-powered data later
    useEffect(() => {
        // Ideally fetch product data based on the id, for example:
        // fetch(`https://api.example.com/products/${id}`).then(response => response.json()).then(data => setProductData(data));
        setProductData({
            name: "Fried Chicken",
            image: "https://static.toiimg.com/thumb/61589069.cms?width=1200&height=900",
            protein: "30g",
            carbs: "10g",
            fats: "20g",
            calories: "350 kcal",
            description: "A crispy fried chicken serving, rich in protein and delicious!",
        });
    }, [id]);

    return (
        <SafeAreaView style={styles.container}>
            {productData ? (
                <>
                    <Image source={{ uri: productData.image }} style={styles.productImage} />
                    <Text style={styles.productName}>{productData.name}</Text>

                    <View style={styles.nutritionContainer}>
                        <View style={styles.nutritionBox}>
                            <Text style={styles.nutritionTitle}>Protein</Text>
                            <Text style={styles.nutritionValue}>{productData.protein}</Text>
                        </View>
                        <View style={styles.nutritionBox}>
                            <Text style={styles.nutritionTitle}>Carbs</Text>
                            <Text style={styles.nutritionValue}>{productData.carbs}</Text>
                        </View>
                        <View style={styles.nutritionBox}>
                            <Text style={styles.nutritionTitle}>Fats</Text>
                            <Text style={styles.nutritionValue}>{productData.fats}</Text>
                        </View>
                    </View>

                    <Text style={styles.caloriesText}>{productData.calories}</Text>

                    {/* Moving description and button to the bottom */}
                    <View style={styles.bottomContainer}>
                        <Text style={styles.description}>{productData.description}</Text>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add to Current Meal</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    backButton: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#007BFF",
        borderRadius: 5,
    },
    backText: {
        color: "#fff",
        fontSize: 16,
    },
    productImage: {
        width: "100%",
        height: 250,
        borderRadius: 8,
        marginBottom: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    nutritionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    nutritionBox: {
        flex: 1,
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    nutritionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    nutritionValue: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 5,
    },
    caloriesText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
        marginBottom: 15,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: "flex-end", // Push content to the bottom
        paddingBottom: 30, // Space for the button at the bottom
    },
    description: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
