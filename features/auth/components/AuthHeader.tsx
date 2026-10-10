import { Image, Text, useWindowDimensions, View } from "react-native";

const TEXTURE = require("@/assets/texture.png");

interface AuthHeaderProps {
    title: string;
}

export function AuthHeader({ title }: AuthHeaderProps) {
    const { height: screenHeight } = useWindowDimensions();

    return (
        <View className="flex-1 items-center justify-center overflow-visible">
            <Image
                source={TEXTURE}
                resizeMode="cover"
                className="absolute left-0 top-0 w-full"
                style={{ height: screenHeight }}
            />
            <View
                className="absolute inset-x-0 top-0 bg-black/10"
                style={{ height: screenHeight }}
            />
            <Text className="font-display-semibold text-3xl tracking-tight text-text-on-brand">
                {title}
            </Text>
        </View>
    );
}
