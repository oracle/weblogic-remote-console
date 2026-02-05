import { ComponentChildren } from 'preact';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
type Props = {
    /**
     * Collapsible's header. If not specified, the header contains only an open/close icon. Note that the header text is required for JET collapsible for accessibility purposes.
     */
    header?: ComponentChildren;
    /**
     * The content node to be collapsed
     */
    children?: ComponentChildren;
    /**
     * Disables the collapsible if set to true
     */
    isDisabled?: boolean;
    /**
     * Specifies if the content is expanded
     */
    isExpanded?: boolean;
    /**
     * Changes chevron icon placement at the end of the collapsible header
     */
    iconPosition?: 'start' | 'end';
    /**
     * Controls the header display which con include a divider below the collapsible header
     */
    variant?: 'basic' | 'horizontal-rule';
    /**
     * Property that triggers a callback immediately when toggle happens and value of expanded property should be updated
     */
    onToggle?: (details: ToggleDetail) => void;
    /**
     * Property that triggers a callback after toggle animation is done
     */
    onTransitionEnd?: (details: TransitionEnd) => void;
    /**
     * An alternative accessible label. By default, the header content is used as Collapsible's accessible label.
     * If required, the user can set a custom 'accessibleLabel' value.
     */
    'aria-label'?: string;
    /**
     * An alternative accessible label id. By default, the header content is used as Collapsible's accessible label.
     * If required, the user can specify an element id within the header to be used as the accessible label.
     * If both 'accessibleLabel' and 'accessibilityId' are specified, the 'accessibleLabelId' is ignored.
     */
    'aria-labelledby'?: string;
} & TestIdProps;
type ToggleDetail = TransitionEnd & {
    target: EventTarget | null;
};
type TransitionEnd = {
    value: boolean;
};
/**
 * A collapsible displays a header that can be expanded to show its content.
 */
export declare const Collapsible: ({ header, children, isDisabled, isExpanded, iconPosition, variant, onToggle, onTransitionEnd, "aria-label": accessibleLabel, "aria-labelledby": accessibleLabelId, testId }: Props) => import("preact").JSX.Element;
export {};
