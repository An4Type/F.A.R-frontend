import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { type Dispatch, type SetStateAction } from "react";
import { View } from "react-native";
import { HomeHeader } from "@/features/dashboard/components/header/HomeHeader";
import { WeekHeader } from "@/features/dashboard/components/header/WeekHeader";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { colors } from "@/constants/theme";

const EXTRA_FADE_HEIGHT = 60;

interface HeaderLayoutProps {
    remainingCalories: number;
    editing: boolean;
    setEditing: Dispatch<SetStateAction<boolean>>;
    setGoalModalOpen: Dispatch<SetStateAction<boolean>>;
    logout: () => void;
    headerHeight: number;
    setHeaderHeight: (height: number) => void;
}

/**
 * Header layout for the dashboard screen.
 * Displays the home header with remaining calories, editing state, and actions.
 * Also includes a week header below the home header.
 * Provide fading linear background overlapping the main content area, because of that
 * child element should provide a callback to measure its height and pass it back to this component.
 */
export function HeaderLayout({
    remainingCalories,
    editing,
    setEditing,
    setGoalModalOpen,
    logout,
    headerHeight,
    setHeaderHeight,
}: HeaderLayoutProps) {
    return (
        <View className="flex-1">
            <LinearGradient
                colors={[colors.surface.hero, colors.surface["hero-mid"], colors.surface.app]}
                locations={[0, (headerHeight - 80) / (headerHeight + EXTRA_FADE_HEIGHT), 1]}
                pointerEvents="none"
                className="absolute inset-x-0 top-0"
                style={{ height: headerHeight + EXTRA_FADE_HEIGHT }}
            />
            <HomeHeader
                setHeaderHeight={setHeaderHeight}
                remainingCalories={remainingCalories}
                actions={
                    <>
                        <IconButton
                            icon={editing ? "checkmark" : "pencil-outline"}
                            active={editing}
                            onPress={() => setEditing((e) => !e)}
                        />
                        <Menu
                            trigger={
                                <View className="h-[36px] w-[36px] items-center justify-center rounded-pill bg-white/20">
                                    <Ionicons
                                        name="ellipsis-vertical"
                                        size={20}
                                        color={colors.text["on-brand"]}
                                    />
                                </View>
                            }
                            items={[
                                {
                                    label: editing ? "Done editing" : "Edit widgets",
                                    onPress: () => setEditing((e) => !e),
                                },
                                { label: "Set goal", onPress: () => setGoalModalOpen(true) },
                                { label: "Log out", onPress: logout, danger: true },
                            ]}
                        />
                    </>
                }
            >
                <WeekHeader />
            </HomeHeader>
        </View>
    );
}
