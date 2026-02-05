import type { DimensionProps } from '../../utils/UNSAFE_interpolations/dimensions';
import { LayoutWidths, InputTypes } from '../../utils/UNSAFE_buttonUtils/toggle.types';
import { ValueUpdateDetail } from '../../utils/UNSAFE_valueUpdateDetail';
type WidthProps = Pick<DimensionProps, 'width'>;
type ButtonSetContextProps = WidthProps & {
    /**
     * variant indicates the toggle button variant
     */
    variant?: 'borderless' | 'outlined';
    /**
     * isDisabled indicates whether the toggle button is in disabled state
     */
    isDisabled: boolean;
    /**
     * size indicates the size of the button
     */
    size: 'sm' | 'md' | 'lg';
    /**
     * inputType specifies what type of input is needed
     */
    inputType?: InputTypes;
    /**
     * inputName is the name of the radio or checkbox
     */
    inputName?: string;
    /**
     * The layoutWidth specifies if the toggle button width fits the contents or
     * the container.
     */
    layoutWidth?: LayoutWidths;
    /**
     * Display indicates whether only the label, icons, or all elements should be rendered by the buttonset.
     */
    display?: 'label' | 'all' | 'icons';
    /**
     * Value of the ButtonSetItem
     */
    buttonSetValue?: Array<string>;
    /**
     * Property that triggers a callback immediately when toggle happens and value of isSelected property should be updated
     */
    onCommit?: (detail: ValueUpdateDetail<Array<string>>) => void;
};
/**
 * Context which the parent component can use to provide various ToggleButton related
 * information
 */
declare const ButtonSetContext: import("preact").Context<ButtonSetContextProps>;
export { ButtonSetContext };
