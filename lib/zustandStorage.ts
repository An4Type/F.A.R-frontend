import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { StateStorage } from "zustand/middleware";

const webStorage: StateStorage = {
    getItem: (name) => localStorage.getItem(name),
    setItem: (name, value) => localStorage.setItem(name, value),
    removeItem: (name) => localStorage.removeItem(name),
};

export const zustandStorage: StateStorage = Platform.OS === "web" ? webStorage : AsyncStorage;
