import { useState, type ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface MenuItem {
    label: string;
    onPress?: () => void;
    danger?: boolean;
}

interface MenuProps {
    trigger: ReactNode;
    items: MenuItem[];
}
/**
 * Menu component that displays a list of items when triggered. The menu is displayed in a modal.
 * Gives possibility to provide own trigger component
 */
export function Menu({ trigger, items }: MenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <View>
            <Pressable onPress={() => setOpen(true)}>{trigger}</Pressable>
            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable className="flex-1" onPress={() => setOpen(false)}>
                    <View className="absolute right-xl top-[64px] min-w-[170px] rounded-card bg-surface-card p-[6px] shadow-lg">
                        {items.map((item) => (
                            <Pressable
                                key={item.label}
                                onPress={() => {
                                    setOpen(false);
                                    item.onPress?.();
                                }}
                                className="rounded-xs px-md py-[11px]"
                            >
                                <Text
                                    className={`font-body-medium text-xs ${item.danger ? "text-action-danger" : "text-text-primary"}`}
                                >
                                    {item.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
