import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/TextInput";
import { colors } from "@/constants/theme";
import { MEAL_GROUP_ICONS, useMealGroupStore, type MealGroup } from "@/features/food";

interface MealGroupEditorModalProps {
    // "new" opens the add form, a group opens it pre-filled, null is closed.
    group: MealGroup | "new" | null;
    onClose: () => void;
}

export function MealGroupEditorModal({ group, onClose }: MealGroupEditorModalProps) {
    const addGroup = useMealGroupStore((state) => state.addGroup);
    const updateGroup = useMealGroupStore((state) => state.updateGroup);
    const deleteGroup = useMealGroupStore((state) => state.deleteGroup);

    const [name, setName] = useState("");
    const [icon, setIcon] = useState<MealGroup["icon"]>(MEAL_GROUP_ICONS[0]);
    const [goal, setGoal] = useState("500");
    const [reminder, setReminder] = useState("");

    // Reset the form each time it opens.
    useEffect(() => {
        if (group === "new") {
            setName("");
            setIcon(MEAL_GROUP_ICONS[0]);
            setGoal("500");
            setReminder("");
        } else if (group) {
            setName(group.name);
            setIcon(group.icon);
            setGoal(String(group.goal));
            setReminder(group.reminder ?? "");
        }
    }, [group]);

    const isEditing = !!group && group !== "new";

    const save = () => {
        if (!name.trim()) return;
        const values = {
            name: name.trim(),
            icon,
            goal: Math.max(50, parseInt(goal, 10) || 500),
            reminder: reminder.trim() || undefined,
        };
        if (isEditing) updateGroup(group.id, values);
        else addGroup(values);
        onClose();
    };

    const remove = () => {
        if (isEditing) deleteGroup(group.id);
        onClose();
    };

    return (
        <Modal visible={!!group} onClose={onClose}>
            {group ? (
                <View className="w-[260px]">
                    <Text className="mb-lg text-center font-display-semibold text-[17px] text-text-primary">
                        {isEditing ? "Edit meal group" : "New meal group"}
                    </Text>
                    <TextInput label="Name" value={name} onChangeText={setName} />
                    <Text className="mb-2xs font-body-medium text-[12px] text-text-secondary">
                        Icon
                    </Text>
                    <View className="mb-lg flex-row flex-wrap gap-2xs">
                        {MEAL_GROUP_ICONS.map((choice) => (
                            <Pressable
                                key={choice}
                                onPress={() => setIcon(choice)}
                                className={`h-[34px] w-[34px] items-center justify-center rounded-pill ${icon === choice ? "bg-action-primary" : "bg-surface-subtle"}`}
                            >
                                <Ionicons
                                    name={choice}
                                    size={16}
                                    color={
                                        icon === choice
                                            ? colors.text["on-brand"]
                                            : colors.action["primary-active"]
                                    }
                                />
                            </Pressable>
                        ))}
                    </View>
                    <TextInput
                        label="Daily target (cal)"
                        keyboardType="number-pad"
                        value={goal}
                        onChangeText={setGoal}
                    />
                    <TextInput
                        label="Reminder time (optional)"
                        placeholder="e.g. 18:30"
                        value={reminder}
                        onChangeText={setReminder}
                    />
                    <View className="mt-2xs gap-2xs">
                        <Button fullWidth onPress={save}>
                            {isEditing ? "Save" : "Add group"}
                        </Button>
                        {isEditing ? (
                            <Button fullWidth variant="text" onPress={remove}>
                                Delete
                            </Button>
                        ) : null}
                    </View>
                </View>
            ) : null}
        </Modal>
    );
}
