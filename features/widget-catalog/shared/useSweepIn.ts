import { useEffect, useState } from "react";

// First paint at 0, then the real value on the next frame — so rings and
// fills animate in on mount and re-sweep when the value changes.
export function useSweepIn(value: number) {
    const [shown, setShown] = useState(0);
    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(value));
        return () => cancelAnimationFrame(id);
    }, [value]);
    return shown;
}
