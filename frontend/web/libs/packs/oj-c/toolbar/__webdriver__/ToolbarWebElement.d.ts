import { ToolbarWebElementBase } from './ToolbarWebElementBase';
/**
 * The component WebElement for [oj-c-toolbar](../../jsdocs/oj-c.Toolbar.html).
 * Do not instantiate this class directly, instead, use
 * [findToolbar](../functions/findToolbar.html).
 */
export declare class ToolbarWebElement extends ToolbarWebElementBase {
    /**
     * Gets the value of <code>items</code> property.
     * Specifies the content to be placed into the toolbar.
     * @return The value of <code>items</code> property.
     *
     */
    getItems(): Promise<Array<object>>;
    /**
     * Performs action of toolbar item specified by key.
     * @param itemLocation object containing key of the item to be activated.
     * Used for triggering the action on an item of type 'button' or 'progress-button', triggering the action on the button portion of an item of type 'oj-c-split-menu-button', or triggering the action on a menu item inside of an item of type 'menu-button' or 'split-menu-button'.
     * For changing the selection state of an item of type buttonset-single or buttonset-multiple, changing the selection state of a menu selection group inside of an item of type oj-c-menu-button or oj-c-split-menu-button, or changing the value of an item of type toggle-button, use the changeToolbarSelection method.
     * @override
     * @typeparam string
     * @param path optional object of label or labels, only needed for menu items
     */
    doToolbarAction(itemLocator: {
        key: string;
    }, path?: {
        label: string | string[];
        key?: never;
    }): Promise<void>;
}
