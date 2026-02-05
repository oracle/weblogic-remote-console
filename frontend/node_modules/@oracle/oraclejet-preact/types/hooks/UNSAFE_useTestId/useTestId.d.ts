export type TestIdProps = {
    testId?: string;
};
/**
 * Returns the set of attributes to be applied to the DOM node if the application's mode is not
 * set to "production".
 */
export declare function useTestId(testId?: string): {
    'data-testid'?: undefined;
} | {
    'data-testid': string | undefined;
};
