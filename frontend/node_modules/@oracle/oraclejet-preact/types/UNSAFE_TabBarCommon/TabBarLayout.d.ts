import { TabBarContext } from './TabBarContext';
import type { ComponentChildren, ContextType } from 'preact';
type TabBarContext = ContextType<typeof TabBarContext>;
type TabBarLayoutProps = {
    children: ComponentChildren;
    display?: TabBarContext['display'];
    layout?: TabBarContext['layout'];
};
/**
 * TabBarLayout is used to manage the display and layout of tab items within
 * its children.
 *
 * @param {TabBarLayoutProps} props TabBarLayout component props.
 * @returns {JSX.Element} TabBarLayout component element.
 */
export declare function TabBarLayout(props: TabBarLayoutProps): import("preact").JSX.Element;
export {};
