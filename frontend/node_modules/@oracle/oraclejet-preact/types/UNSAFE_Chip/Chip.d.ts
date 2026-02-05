import { TestIdProps } from '../hooks/UNSAFE_useTestId';
type SelectedChangeDetail = {
    previousValue?: boolean;
    value?: boolean;
};
type Props = {
    /**
     * Specifies if the chip component is selected.
     */
    isSelected?: boolean;
    /**
     * Disables the component.
     */
    isDisabled?: boolean;
    /**
     * Specifies some screen reader text.
     */
    'aria-label'?: string;
    children: string;
    /**
     * Triggered when a chip is clickable, whether by keyboard, mouse, or touch events.
     */
    onToggle?: (detail: SelectedChangeDetail) => void;
} & TestIdProps;
export declare function Chip({ isSelected, isDisabled, 'aria-label': accessibleLabel, children, testId, onToggle }: Props): import("preact").JSX.Element;
export {};
