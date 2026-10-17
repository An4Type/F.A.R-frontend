import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/layout/EmptyState";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { TAB_BAR_TOP_MARGIN } from "@/constants/layout";
import { colors } from "@/constants/theme";
import { FoodListItem } from "@/features/food/components/FoodListItem";
import { getCategoryBySlug } from "@/features/food/constants";
import { useCategoryFoods } from "@/features/food/queries/useCategoryFoods";
import type { CategoryFood } from "@/features/food/types";
import { goBack } from "@/lib/navigation";

export function CategoryScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const category = getCategoryBySlug(id ?? "");
    const { data: foods, isLoading } = useCategoryFoods(category?.label ?? "");

    const handlePress = (food: CategoryFood) => {
        router.push({
            pathname: "/search/food/[slug]",
            params: { slug: food.slug, name: food.name, cal: String(food.calories) },
        });
    };

    return (
        <View className="flex-1 bg-surface-subtle-2">
            <ScreenHeader
                title={category?.label ?? "Category"}
                titleIcon={category?.icon}
                onBack={() => goBack("/search")}
            />

            <ScrollView
                className="flex-1"
                contentContainerClassName="gap-sm p-xl"
                contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_TOP_MARGIN }}
            >
                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color={colors.action.primary}
                        className="mt-4xl"
                    />
                ) : foods && foods.length > 0 ? (
                    foods.map((food) => (
                        <FoodListItem
                            key={food.slug}
                            name={food.name}
                            cal={food.calories}
                            icon={food.icon}
                            onPress={() => handlePress(food)}
                        />
                    ))
                ) : (
                    <EmptyState
                        icon={category?.icon ?? "restaurant-outline"}
                        title="Nothing here yet"
                        subtitle="This category doesn't have sample foods yet."
                    />
                )}
            </ScrollView>
        </View>
    );
}
