export interface WaterSettings {
    goalMl: number;
    glassMl: number;
}

export interface WaterData extends WaterSettings {
    consumedMl: number;
    addWater: (ml: number) => void;
}
