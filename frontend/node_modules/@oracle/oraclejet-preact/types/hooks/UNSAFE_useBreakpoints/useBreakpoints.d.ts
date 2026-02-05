export declare const defaultBreakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
};
export type Breakpoints = Record<string, string>;
export declare function useBreakpoints(breakpoints?: Breakpoints): Record<string, boolean>;
