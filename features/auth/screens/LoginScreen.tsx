import { useState, type ComponentProps, type ReactNode } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { authApi } from "@/features/auth/api";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Onboarding } from "@/features/auth/components/Onboarding";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import type { LoginFormValues } from "@/features/auth/schemas/loginSchema";
import type { RegisterFormValues } from "@/features/auth/schemas/registerSchema";
import { useOnboardingStore } from "@/features/auth/store/onboardingStore";
import { TAB_BAR_TOP_MARGIN } from "@/constants/layout";

type Stage = "onboarding" | "auth";
type Facing = "front" | "back";

const FLIP_DURATION = 500;

const CARD_HEIGHT = 460;

export function LoginScreen() {
    const hasOnboarded = useOnboardingStore((state) => state.hasOnboarded);
    const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
    const { loginRequest, registerRequest } = authApi;
    const insets = useSafeAreaInsets();

    // Onboarding, login and register share one two-face flip card: `stage`
    // decides what the faces hold (onboarding + login, or login + register)
    // and `facing` which one is turned toward the viewer. Onboarding only
    // ever flips forward once, then the faces are relabelled.
    const [stage, setStage] = useState<Stage>(hasOnboarded ? "auth" : "onboarding");
    const [facing, setFacing] = useState<Facing>("front");
    const flip = useSharedValue(0);

    const finishOnboarding = () => {
        completeOnboarding();
        setFacing("back");
        flip.value = withTiming(1, { duration: FLIP_DURATION }, (finished) => {
            if (finished) {
                flip.value = 0;
                // The callback runs on the UI thread, so state updates are
                // scheduled back onto the JS (React Native) thread.
                scheduleOnRN(setStage, "auth");
                scheduleOnRN(setFacing, "front");
            }
        });
    };

    const goToRegister = () => {
        flip.value = withTiming(1, { duration: FLIP_DURATION });
        setFacing("back");
    };

    const goToLogin = () => {
        flip.value = withTiming(0, { duration: FLIP_DURATION });
        setFacing("front");
    };

    const handleSignIn = async (values: LoginFormValues) => {
        try {
            await loginRequest(values);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleSignUp = async (values: RegisterFormValues) => {
        try {
            if (await registerRequest(values)) {
                goToLogin();
            }
        } catch (error) {
            console.error("Register failed:", error);
        }
    };

    // Onboarding -> login flips vertically, login <-> register horizontally.
    const frontStyle = useAnimatedStyle(() => {
        const deg = `${interpolate(flip.value, [0, 1], [0, 180])}deg`;
        return {
            transform: [
                { perspective: 1200 },
                stage === "onboarding" ? { rotateX: deg } : { rotateY: deg },
            ],
        };
    });
    const backStyle = useAnimatedStyle(() => {
        const deg = `${interpolate(flip.value, [0, 1], [-180, 0])}deg`;
        return {
            transform: [
                { perspective: 1200 },
                stage === "onboarding" ? { rotateX: deg } : { rotateY: deg },
            ],
        };
    });

    const loginForm = <LoginForm onSubmit={handleSignIn} onCancel={goToRegister} />;

    return (
        <View className="flex-1 bg-action-primary">
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <AuthHeader title="AnyMeal" />
                <View style={{ height: CARD_HEIGHT + insets.bottom + TAB_BAR_TOP_MARGIN }}>
                    <FlipFace
                        style={frontStyle}
                        interactive={facing === "front"}
                        bottomInset={insets.bottom}
                    >
                        {stage === "onboarding" ? (
                            <Onboarding finishOnboarding={finishOnboarding} />
                        ) : (
                            loginForm
                        )}
                    </FlipFace>
                    <FlipFace
                        style={backStyle}
                        interactive={facing === "back"}
                        bottomInset={insets.bottom}
                    >
                        {stage === "onboarding" ? (
                            loginForm
                        ) : (
                            <RegisterForm onSubmit={handleSignUp} onCancel={goToLogin} />
                        )}
                    </FlipFace>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// Reanimated components don't get NativeWind className support, so the
// animated face only carries the transform; the card look is on the inner
// View. Explicit top/left/right/bottom instead of the `inset` shorthand,
// which mis-sized the card on iOS together with backfaceVisibility.
function FlipFace({
    style,
    interactive,
    bottomInset,
    children,
}: {
    style: ComponentProps<typeof Animated.View>["style"];
    interactive: boolean;
    bottomInset: number;
    children: ReactNode;
}) {
    return (
        <Animated.View
            pointerEvents={interactive ? "auto" : "none"}
            style={[
                { backfaceVisibility: "hidden" },
                style,
                { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
            ]}
        >
            <View
                className="flex-1 items-center rounded-t-2xl bg-surface-card shadow-lg"
                style={{ paddingBottom: bottomInset }}
            >
                {children}
            </View>
        </Animated.View>
    );
}
