import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-tab-bar-mixed WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TabBarMixedWebElement.ts.
 */
export declare class TabBarMixedWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>dynamicTabs</code> property.
     * An array of dynamic tabs
     * @return The value of <code>dynamicTabs</code> property.
     *
     */
    getDynamicTabs(): Promise<Array<DynamicTabs>>;
    /**
     * Gets the value of <code>dynamicTabsOverflow</code> property.
     * Dynamic tabs overflow configurations
     * @return The value of <code>dynamicTabsOverflow</code> property.
     *
     */
    getDynamicTabsOverflow(): Promise<string>;
    /**
     * Gets the value of <code>dynamicTabsOverflowIcon</code> property.
     * The icon used on the overflow tab
     * @return The value of <code>dynamicTabsOverflowIcon</code> property.
     *
     */
    getDynamicTabsOverflowIcon(): Promise<object>;
    /**
     * Gets the value of <code>size</code> property.
     * Size of TabBarMixed
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
    /**
     * Sets the value of <code>selection</code> property.
     * The key of the selected tab
     * @param selection The value to set for <code>selection</code>
     *
     */
    changeSelection(selection: string | number): Promise<void>;
    /**
     * Gets the value of <code>selection</code> property.
     * The key of the selected tab
     * @return The value of <code>selection</code> property.
     *
     */
    getSelection(): Promise<string | number>;
    /**
     * Gets the value of <code>separatorPadding</code> property.
     * The padding around the vertical divider that seperates collections of tabs.
     * @return The value of <code>separatorPadding</code> property.
     *
     */
    getSeparatorPadding(): Promise<string>;
    /**
     * Gets the value of <code>staticTabs</code> property.
     * An array of static tabs
     * @return The value of <code>staticTabs</code> property.
     *
     */
    getStaticTabs(): Promise<Array<StaticTabs>>;
    /**
     * Gets the value of <code>staticTabsDisplay</code> property.
     * The display configuration for static tabs.
     * @return The value of <code>staticTabsDisplay</code> property.
     *
     */
    getStaticTabsDisplay(): Promise<string>;
}
export interface DynamicTabs {
    /**
     *
     */
    badge: number;
    /**
     *
     */
    icon: object;
    /**
     *
     */
    itemKey: string | number;
    /**
     *
     */
    label: string;
    /**
     *
     */
    tabPanelId: string;
}
export interface StaticTabs {
    /**
     *
     */
    badge: number;
    /**
     *
     */
    icon: object;
    /**
     *
     */
    itemKey: string | number;
    /**
     *
     */
    label: string;
    /**
     *
     */
    tabPanelId: string;
}
