export type ActionableOptions = {
    isDisabled?: boolean;
    isRepeat?: boolean;
};
/**
 * A hook that can add actionable support to a target element, turning it into a
 * clickable button, div, card, etc.
 * If isHover, isFocus, and isActive are only used for changing visual rendering, it would be
 * faster to not use this hook, and instead use :hover, :focus-visible, :active and usePress.
 * @param onActionHandler
 * @returns
 */
export declare function useActionable(onActionHandler: (event: Event) => void, settings?: ActionableOptions): {
    isActive: boolean;
    isHover: boolean;
    isFocus: boolean;
    actionableProps: Record<string, any>;
};
