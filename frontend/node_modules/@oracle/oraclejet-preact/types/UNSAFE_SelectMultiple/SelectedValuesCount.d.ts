import { ComponentProps } from 'preact';
import { Chip } from '../UNSAFE_Chip';
type PickedPropsFromChip = Pick<ComponentProps<typeof Chip>, 'aria-label' | 'isDisabled' | 'isSelected' | 'onToggle'>;
type Props = PickedPropsFromChip & {
    count?: number;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
};
export declare function SelectedValuesCount({ 'aria-label': ariaLabel, count, onKeyDown, onKeyUp, onMouseDown, ...passThroughProps }: Props): import("preact").JSX.Element;
export {};
