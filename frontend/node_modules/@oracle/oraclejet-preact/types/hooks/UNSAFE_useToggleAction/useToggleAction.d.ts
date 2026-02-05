export type ToggleDetail = {
    value: boolean;
};
export type ToggleActionOptions = {
    isDisabled?: boolean;
    onToggle?: (details: ToggleDetail) => void;
};
export type ToggleActionReturnType = {
    triggerProps: Record<string, any>;
};
/**
 * Use to provide support for toggles
 *
 * @returns
 */
export declare function useToggleAction({ isDisabled, onToggle }: ToggleActionOptions): ToggleActionReturnType;
