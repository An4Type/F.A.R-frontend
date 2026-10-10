// NativeWind only patches core RN elements for 'className' to work so other
// non-RN components need to be registered here in order to className to work.
// Important this file needs to be imported in app/_layout.tsx before any other
// components are rendered.
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";

cssInterop(BlurView, { className: "style" });
cssInterop(LinearGradient, { className: "style" });
