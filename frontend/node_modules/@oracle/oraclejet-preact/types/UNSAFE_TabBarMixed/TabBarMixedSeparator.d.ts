import type { Size } from '../utils/UNSAFE_size';
type TabBarMixedSeparatorProps = {
    /**
     * Padding around the visual Separator line.
     */
    padding?: Size;
};
/**
 * TabBarMixedSeparator is a component that renders a visual separator (displayed
 * as a vertical line) between collections of tabs within TabBarMixed.
 *
 * @param {TabBarMixedSeparatorProps} props Component props for TabBarMixedSeparator.
 * @returns {JSX.Element} Component element for TabBarMixedSeparator.
 */
export declare function TabBarMixedSeparator(props: TabBarMixedSeparatorProps): import("preact").JSX.Element;
export {};
