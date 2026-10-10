import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View className="flex-1 items-center justify-center bg-surface-app p-xl">
                <Text className="font-display-bold text-xl text-text-primary">
                    This screen doesn&apos;t exist.
                </Text>
                <Link href="/" className="mt-md py-md">
                    <Text className="font-body-semibold text-sm text-action-primary">
                        Go to home screen
                    </Text>
                </Link>
            </View>
        </>
    );
}
