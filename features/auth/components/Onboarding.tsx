import { useRef, useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import { Button } from "@/components/ui/Button";

const SLIDES = [
    {
        title: "Snap a meal",
        body: "Point your camera at any meal and let AnyMeal identify it in seconds.",
    },
    {
        title: "Track your macros",
        body: "See carbs, protein, and fat at a glance — with clear goals to hit each day.",
    },
    {
        title: "Get smart advice",
        body: "Daily, personalized nutrition tips based on what you actually ate.",
    },
];

interface OnboardingProps {
    className?: string;
    finishOnboarding: () => void;
}

export function Onboarding({ className = "", finishOnboarding }: OnboardingProps) {
    // Is needed for calculation how much to scroll to next slide
    const { width } = useWindowDimensions();
    const [slideIndex, setSlideIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const isLastSlide = slideIndex === SLIDES.length - 1;

    // Needs to check any slide scroll rather than just end - react-native-web doesn't
    // fire momentum events, and native doesn't fire them for the programmatic
    // scrollTo behind "Next". State only changes when the rounded index does,
    // so this doesn't re-render per frame.
    const onSlideScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setSlideIndex(Math.max(0, Math.min(SLIDES.length - 1, index)));
    };

    const goToSlide = (next: number) => {
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
    };

    return (
        <View className={`w-full flex-1 items-center pt-4xl ${className}`}>
            <View className="items-center">
                <View className="mb-[22px] flex-row gap-[6px]">
                    {SLIDES.map((slide, i) => (
                        <View
                            key={slide.title}
                            className={`h-[7px] rounded-pill ${i === slideIndex ? "w-[20px] bg-action-primary" : "w-[7px] bg-gray-200"}`}
                        />
                    ))}
                </View>

                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onSlideScroll}
                    scrollEventThrottle={16}
                    className="grow-0"
                    style={{ width }}
                >
                    {SLIDES.map((slide) => (
                        <View key={slide.title} style={{ width }} className="items-center px-2xl">
                            <Text className="text-center font-display-bold text-2xl tracking-tight text-text-primary">
                                {slide.title}
                            </Text>
                            <Text className="mt-sm max-w-[280px] text-center font-body text-sm leading-[21px] text-text-secondary">
                                {slide.body}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View className="flex-1" />

            <View className="w-full px-2xl pb-2xl">
                <Button
                    fullWidth
                    onPress={() => (isLastSlide ? finishOnboarding() : goToSlide(slideIndex + 1))}
                >
                    {isLastSlide ? "Get started" : "Next"}
                </Button>
                {!isLastSlide ? (
                    <Pressable onPress={finishOnboarding} className="mt-[14px] items-center">
                        <Text className="font-body text-sm text-text-tertiary">Skip</Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}
