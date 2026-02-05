import type { ComponentChildren } from 'preact';
import { Ref } from 'preact';
import { useTabBarMixed as useTabBar } from './useTabBarMixed';
type UseTabBarOptions = Parameters<typeof useTabBar>[0];
/**
 * Component props expected to be pased to **TabBarMixed**.
 *
 * @see {@link TabBarMixed}
 */
type TabBarMixedProps<K extends string | number> = {
    /**
     * Component children that will be rendered within the **TabBarMixed**
     * root element.
     *
     * It is expected that **TabBarLayout** and **ConveyorBelt** elements are
     * provided. The same **TabBarItem**, **RemovableTabBarItem**,
     * and **OverflowTabBarItem** elements should also be used.
     */
    children?: ComponentChildren;
    /**
     * Callback fired when a tab item is removed.
     */
    onRemove?: UseTabBarOptions['onRemove'];
    /**
     * Callback fired when a tab item is selected.
     */
    onSelect?: UseTabBarOptions['onSelect'];
    /**
     * The item key of the selected tab item.
     */
    selection?: K;
    /**
     * The height of the the tab bar.
     *
     * @default "md"
     */
    size?: UseTabBarOptions['size'];
    /**
     * An aria-label which defines a string value that labels this TabBarMixed.
     * Either aria-label or aria-labelledby should be specified in order to make TabBarMixed accessible.
     */
    'aria-label'?: string;
    /**
     * An aria-labelledby which identifies the element(s) that labels this TabBarMixed.
     * Either aria-label or aria-labelledby should be specified in order to make TabBarMixed accessible.
     */
    'aria-labelledby'?: string;
};
export type FocusableHandle = {
    focus: () => void;
    blur: () => void;
};
/**
 * A navigation component that enables horizontal navigation between distinct content with a mixture of static and dynamic tabs.
 *
 * @param {TabBarMixedProps} props TabBarMixed component props.
 * @returns {JSX.Element} TabBarMixed component element.
 */
export declare const TabBarMixed: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<TabBarMixedProps<string | number>> & {
    ref?: Ref<FocusableHandle> | undefined;
}>;
export {};
