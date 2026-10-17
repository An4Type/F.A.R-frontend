import {
    createContext,
    Fragment,
    useContext,
    useId,
    useLayoutEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface PortalHost {
    mount: (key: string, node: ReactNode) => void;
    unmount: (key: string) => void;
}

const PortalContext = createContext<PortalHost | null>(null);

// Renders portalled content after the app, in the same native window. Used
// instead of RN's Modal, so overlays share coordinates with the app and
// the blur behind them stays live
export function PortalProvider({ children }: { children: ReactNode }) {
    const [nodes, setNodes] = useState<Record<string, ReactNode>>({});

    const host = useMemo<PortalHost>(
        () => ({
            mount: (key, node) => setNodes((prev) => ({ ...prev, [key]: node })),
            unmount: (key) =>
                setNodes((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                }),
        }),
        []
    );

    return (
        <PortalContext.Provider value={host}>
            {children}
            {Object.entries(nodes).map(([key, node]) => (
                <Fragment key={key}>{node}</Fragment>
            ))}
        </PortalContext.Provider>
    );
}

// Renders `children` in the PortalProvider's layer instead of in place.
// Hooks run where <Portal> is used; only the resulting elements move.
export function Portal({ children }: { children: ReactNode }) {
    const host = useContext(PortalContext);
    const key = useId();

    // Every render pushes the latest children; layout effects avoid a frame
    // where the overlay lags behind its owner.
    useLayoutEffect(() => {
        host?.mount(key, children);
    });
    useLayoutEffect(() => () => host?.unmount(key), [host, key]);

    return null;
}
