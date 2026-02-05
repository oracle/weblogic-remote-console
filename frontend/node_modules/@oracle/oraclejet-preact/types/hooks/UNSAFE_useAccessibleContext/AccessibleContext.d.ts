type AccessibleContextProps = {
    /**
     * The id of an external label element for some component.
     */
    UNSAFE_ariaLabelledBy?: string;
};
/**
 * Context used by the parent to pass accessibility related information.
 */
declare const AccessibleContext: import("preact").Context<AccessibleContextProps>;
export { AccessibleContext };
export type { AccessibleContextProps };
