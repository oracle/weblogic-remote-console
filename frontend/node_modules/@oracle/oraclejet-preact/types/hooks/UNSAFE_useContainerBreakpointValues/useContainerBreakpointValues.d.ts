import { defaultBreakpoints, Breakpoints } from '../UNSAFE_useBreakpoints';
type DefaultBreakpoints = keyof typeof defaultBreakpoints;
type DefaultType<T> = Record<DefaultBreakpoints, T>;
type Responsive<V> = Partial<DefaultType<V>>;
export declare function useContainerBreakpointValues<V>(breakpointValues: Responsive<V>, breakpoints?: Breakpoints): {
    breakpoint: V;
    ref: (node: HTMLElement) => void;
};
export {};
