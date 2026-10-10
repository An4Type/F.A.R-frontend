import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CircularGoalControl, useProfileStore } from "@/features/profile";

interface SetGoalModalProps {
    visible: boolean;
    onClose: () => void;
}

export function SetGoalModal({ visible, onClose }: SetGoalModalProps) {
    const caloriesGoal = useProfileStore((state) => state.caloriesGoal);
    const setCaloriesGoal = useProfileStore((state) => state.setCaloriesGoal);
    const [goalDraft, setGoalDraft] = useState(caloriesGoal);
    const [wasVisible, setWasVisible] = useState(visible);

    if (visible !== wasVisible) {
        setWasVisible(visible);
        if (visible) setGoalDraft(caloriesGoal);
    }

    return (
        <Modal visible={visible} onClose={onClose}>
            <Text className="mb-2xs text-center font-display-semibold text-[17px] text-text-primary">
                Set your calorie goal
            </Text>
            <CircularGoalControl value={goalDraft} onChange={setGoalDraft} />
            <View className="mt-xl">
                <Button
                    fullWidth
                    onPress={() => {
                        setCaloriesGoal(goalDraft);
                        onClose();
                    }}
                >
                    Set Goal
                </Button>
            </View>
        </Modal>
    );
}
