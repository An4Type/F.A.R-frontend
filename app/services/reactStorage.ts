import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export enum ValEnum {
    DAILYINFO = "DAILYINFO",
}

export const ReactStorage = {
    loadVal:
        Platform.OS === "web"
            ? async (val: ValEnum) => localStorage.getItem(val)
            : async (val: ValEnum) => AsyncStorage.getItem(val),

    saveVal:
        Platform.OS === "web"
            ? async (val: ValEnum, newVal: any) => localStorage.setItem(val, JSON.stringify(newVal))
            : async (val: ValEnum, newVal: any) =>
                  AsyncStorage.setItem(val, JSON.stringify(newVal)),

    deleteVal:
        Platform.OS === "web"
            ? async (val: ValEnum) => localStorage.removeItem(val)
            : async (val: ValEnum) => AsyncStorage.removeItem(val),
};
