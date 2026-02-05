import { ButtonSetPosition } from '../../utils/UNSAFE_buttonUtils';
export type ButtonSetPositionContextProps = {
    /**
     * The position modifies the borders for usage inside a button group.
     */
    position?: ButtonSetPosition;
};
/**
 * Context which the parent component can use to provide various ToggleButton related
 * information
 */
export declare const ButtonSetPositionContext: import("preact").Context<ButtonSetPositionContextProps>;
