import { Breakpoints, defaultBreakpoints } from '../UNSAFE_useBreakpoints';
type DefaultBreakpoints = keyof typeof defaultBreakpoints;
type DefaultType<T> = Record<DefaultBreakpoints, T>;
type Responsive<V> = Partial<DefaultType<V>>;
export declare function useBreakpointValues<V>(breakpointValues: Responsive<V>, breakpoints?: Breakpoints): V;
export {};
