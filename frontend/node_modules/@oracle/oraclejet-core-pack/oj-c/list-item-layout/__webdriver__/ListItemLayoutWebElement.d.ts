import { ListItemLayoutWebElementBase } from './ListItemLayoutWebElementBase';
/**
 * ListItemLayout is not accessible to WebDriverJS.
 * These methods are deprecated since 16.0.0 and are not to be used.
 */
export declare class ListItemLayoutWebElement extends ListItemLayoutWebElementBase {
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>primary</code> property.
     * Returns primary text.
     * @return The value of <code>primary</code> property.
     *
     */
    getPrimary(): Promise<string>;
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>secondary</code> property.
     * Returns secondary text.
     * @return The value of <code>secondary</code> property.
     *
     */
    getSecondary(): Promise<string>;
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>tertiary</code> property.
     * Returns tertiary text.
     * @return The value of <code>tertiary</code> property.
     *
     */
    getTertiary(): Promise<string>;
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>quaternary</code> property.
     * Returns quaternary text.
     * @return The value of <code>quaternary</code> property.
     *
     */
    getQuaternary(): Promise<string>;
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>overline</code> property.
     * Returns overline text.
     * @return The value of <code>overline</code> property.
     *
     */
    getOverline(): Promise<string>;
}
