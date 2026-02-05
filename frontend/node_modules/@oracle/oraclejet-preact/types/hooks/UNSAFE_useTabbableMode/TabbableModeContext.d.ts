/**
 * Context for Tabbable Mode Consumer and Provider
 */
/**
 * Context props for Tabbable Mode
 */
type TabbableModeContextProps = {
    /**
     * State of Tabbable mode
     * @default true
     */
    isTabbable: boolean;
    /**
     * State of roving tab index mode
     * @default undefined
     */
    isRoving?: true;
    /**
     * id of currently focused element
     * @default undefined
     */
    focusedId?: string;
};
declare const TabbableModeContext: import("preact").Context<TabbableModeContextProps>;
export { TabbableModeContext };
