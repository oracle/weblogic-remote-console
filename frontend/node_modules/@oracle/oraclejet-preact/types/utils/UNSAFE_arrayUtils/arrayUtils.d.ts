export declare const coerceArray: <T>(value: T | T[]) => T[];
export declare const callEach: <T>(fns: ((args: T) => void)[]) => (args: T) => void;
