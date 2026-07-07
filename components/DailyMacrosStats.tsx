import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DailyMacrosStatsProps {
    proteins: number; // В граммах
    carbs: number; // В граммах
    fat: number; // В граммах
}

const DailyMacrosStats: React.FC<DailyMacrosStatsProps> = ({ proteins, carbs, fat }) => {
    const calculatePercentage = (value: number, totalCalories: number): number => {
        return Math.round((value / totalCalories) * 100);
    };

    // Калорийность макронутриентов
    const PROTEIN_CALORIES = 4; // 1 грамм белка = 4 калории
    const CARB_CALORIES = 4; // 1 грамм углеводов = 4 калории
    const FAT_CALORIES = 9; // 1 грамм жиров = 9 калорий

    // Расчет общей калорийности
    const totalCalories = proteins * PROTEIN_CALORIES + carbs * CARB_CALORIES + fat * FAT_CALORIES;

    // Расчет процентных значений
    const proteinPercentage = calculatePercentage(proteins * PROTEIN_CALORIES, totalCalories);
    const carbPercentage = calculatePercentage(carbs * CARB_CALORIES, totalCalories);
    const fatPercentage = calculatePercentage(fat * FAT_CALORIES, totalCalories);

    return (
        <View>
            <View style={styles.statistics}>
                <View style={styles.childStatistics}>
                    <View
                        style={{
                            height: `${carbPercentage}%`,
                            backgroundColor: "#89d381",
                            ...styles.childStatistics__text,
                        }}
                    >
                        <Text>Carbs</Text>
                    </View>
                </View>
                <View style={styles.childStatistics}>
                    <View
                        style={{
                            height: `${proteinPercentage}%`,
                            backgroundColor: "#F7A2BD",
                            ...styles.childStatistics__text,
                        }}
                    >
                        <Text>Proteins</Text>
                    </View>
                </View>
                <View style={styles.childStatistics}>
                    <View
                        style={{
                            height: `${fatPercentage}%`,
                            backgroundColor: "#FFD978",
                            ...styles.childStatistics__text,
                        }}
                    >
                        <Text>Fat</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default DailyMacrosStats;

const styles = StyleSheet.create({
    childStatistics__text: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 18,
    },
    statistics: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height: 180,
    },
    childStatistics: {
        overflow: "hidden",
        width: "30%",
        height: "100%",
        backgroundColor: "#e8e8e8",
        borderRadius: 30,
        display: "flex",
        justifyContent: "flex-end",
    },
});
