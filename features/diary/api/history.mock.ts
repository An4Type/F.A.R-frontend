// Stands in for a weekly-history endpoint the real backend doesn't have yet.

export interface DayHistory {
    day: string;
    calories: number;
}

const WEEKLY_HISTORY: DayHistory[] = [
    { day: "Mon", calories: 2100 },
    { day: "Tue", calories: 2900 },
    { day: "Wed", calories: 2500 },
    { day: "Thu", calories: 3400 },
    { day: "Fri", calories: 2700 },
    { day: "Sat", calories: 4100 },
    { day: "Sun", calories: 2700 },
];

export const getWeeklyHistory = (): Promise<DayHistory[]> =>
    new Promise((resolve) => setTimeout(() => resolve(WEEKLY_HISTORY), 300));
