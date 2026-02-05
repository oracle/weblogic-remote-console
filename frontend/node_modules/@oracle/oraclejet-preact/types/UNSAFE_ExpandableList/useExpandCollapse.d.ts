import { ToggleDetail } from '../UNSAFE_Collection';
import { Keys } from '../utils/UNSAFE_keys';
/**
 * A hook that handles mouse and keyboard gesture that toggles the expanded state.
 * @param keyExtractor
 * @param expanded
 * @param onToggle
 * @returns
 */
export declare function useExpandCollapse<K>(keyExtractor: (element: HTMLElement) => K | null, expanded: Keys<K>, onToggle?: (detail: ToggleDetail<K>) => void): {
    onClick: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
} | {
    onClick?: undefined;
    onKeyDown?: undefined;
    onKeyUp?: undefined;
};
