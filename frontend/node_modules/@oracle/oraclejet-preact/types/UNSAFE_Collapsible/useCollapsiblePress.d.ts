export type CollapsiblePressOptions = {
    isDisabled?: boolean;
};
/**
 * Returns a click handler that can make a target element either clickable or keyboard pressable.
 *
 * @param onPressHandler function
 * @param isDisabled boolean
 * @returns
 */
export declare function useCollapsiblePress(onPressHandler: (event: Event) => void, settings?: CollapsiblePressOptions): {
    pressProps: Record<string, any>;
};
