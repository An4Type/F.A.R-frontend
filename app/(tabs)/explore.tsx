import * as React from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { useDayInfoQuery } from "@/queries/useDayInfo";

export default function Explore() {
    const { data: dayInfoList, isLoading, isFetching, error, refetch } = useDayInfoQuery();
    const data = dayInfoList?.[0];

    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#89BD71" />
                <Text>Loading data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    Error: {error instanceof Error ? error.message : "Something went wrong"}
                </Text>
            </View>
        );
    }

    const { nutrition, foodConsumed = [] } = data || {};
    const totalCalories = nutrition?.calories || 0;
    const macros = nutrition || { fats: 0, carbohydrates: 0, proteins: 0 };

    return (
        <View style={styles.index}>
            <Appbar.Header style={styles.appbarHeader}>
                <Appbar.Content title="AnyMeal" titleStyle={{ color: "white" }} />
            </Appbar.Header>

            <View style={styles.header}>
                <Text style={styles.title}>Today</Text>
                <Text style={styles.totalCalories}>{totalCalories} cal</Text>
                {/* <Text style={styles.caloriesGoal}>/ {calorieGoal} goal</Text> */}
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {foodConsumed.map((item, index) => (
                    <View key={index} style={styles.foodItem}>
                        <Text style={styles.foodName}>{item.food.name}</Text>
                        <Text style={styles.foodCals}>{item.nutrition.calories} cal</Text>
                    </View>
                ))}

                <View style={styles.macrosContainer}>
                    <View style={styles.macroItem}>
                        <Text style={styles.macroLabel}>Carbs</Text>
                        <Text style={styles.macroValue}>{macros.carbohydrates} g</Text>
                    </View>
                    <View style={styles.macroItem}>
                        <Text style={styles.macroLabel}>Protein</Text>
                        <Text style={styles.macroValue}>{macros.proteins} g</Text>
                    </View>
                    <View style={styles.macroItem}>
                        <Text style={styles.macroLabel}>Fat</Text>
                        <Text style={styles.macroValue}>{macros.fats} g</Text>
                    </View>
                </View>
                <View style={styles.refreshContainer}>
                    <Button
                        icon="refresh"
                        mode="contained"
                        buttonColor="#89BD71"
                        loading={isFetching}
                        onPress={() => refetch()}
                    >
                        Refresh
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    index: {
        flex: 1,
        backgroundColor: "white",
    },
    appbarHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor: "#89BD71",
    },
    header: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#89BD71",
        paddingVertical: 40,
    },
    caloriesGoal: {
        fontSize: 18,
        color: "#ededed",
        fontWeight: "400",
    },
    title: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
    },
    totalCalories: {
        fontSize: 48,
        color: "white",
        fontWeight: "bold",
    },
    container: {
        padding: 20,
    },
    foodItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    foodName: {
        fontSize: 18,
        color: "#333",
    },
    foodCals: {
        fontSize: 18,
        fontWeight: "bold",
    },
    macrosContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    macroItem: {
        alignItems: "center",
    },
    macroLabel: {
        fontSize: 16,
        color: "#555",
    },
    macroValue: {
        fontSize: 18,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
});
