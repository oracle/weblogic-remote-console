/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChild } from 'preact';
import { ContextMenuItems, MenuSelection, MenuItemSelectionDetail, SelectMenuItemDetail } from './menuTypes';
export type { MenuItem, MenuItems, ContextMenuItems, MenuSeparator, MenuSelection, MenuItemSelectionDetail, MenuIcon, MenuSelectItem, SelectMenuItemDetail } from './menuTypes';
type ItemsMenuMenuItems = (ContextMenuItems | {
    type: 'divider';
} | string)[];
type DefaultMenuItemsRenderer = {
    [key: string]: () => ComponentChild;
};
type Props = {
    /**
     * @ojmetadata description Items describe the menu items rendered by the menu button.
     * @ojmetadata displayName "items"
     * @ojmetadata help "#items"
     */
    items?: ItemsMenuMenuItems;
    /**
     * @ojmetadata description A map of menu selection groups and values.
     * @ojmetadata displayName "selection"
     * @ojmetadata help "#selection"
     */
    selection?: Readonly<Record<string, MenuSelection>>;
    /**
     * @ojmetadata description Passable selection property writepack callback
     * @ojmetadata displayName "changed"
     * @ojmetadata help "#changed"
     */
    onSelectionChanged?: (value: Readonly<Record<string, MenuSelection>>) => void;
    /**
     * @ojmetadata description Triggered when a menu item is clicked, whether by keyboard, mouse,
     * or touch events.
     * @ojmetadata displayName "onOjMenuAction"
     * @ojmetadata help "#event:ojMenuAction"
     */
    onOjMenuAction?: (details: MenuItemSelectionDetail) => void;
    /**
     * @ojmetadata description Triggered when a select menu item is clicked, whether by keyboard, mouse,
     *    or touch events..
     * @ojmetadata displayName "onOjMenuSelection"
     * @ojmetadata help "#event:ojMenuSelection"
     */
    onOjMenuSelection?: (details: SelectMenuItemDetail<string | Array<string>> & {
        menuSelectionGroupKey: string;
    }) => void;
    /**
     * @ojmetadata description Limits menu item support to avoid icons and select groups
     * @ojmetadata displayName "isSplitMenu"
     * @ojmetadata help "#isSplitMenu"
     */
    isSplitMenu?: boolean;
    /**
     * @ojmetadata description Allows default context menu items to be rendered
     * @ojmetadata displayName "defaultItemsRenderer"
     * @ojmetadata help "#defaultItemsRenderer"
     */
    defaultItemsRenderer?: DefaultMenuItemsRenderer;
};
/**
 * @classdesc
 * <h3 id="MenuButtonOverview-section">
 *   JET Items Menu
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
 * </h3>
 *
 * <p>Description: A component that takes an items property containing a description of
 * menu items and converts to a collection of menu items suitable for a menu container,
 * such as a menu button.
 *
 * @ojmetadata description "An items to menu items converter"
 * @ojmetadata displayName "Items Menu"
 * @ojmetadata help "oj-c.ItemsMenu.html"
 * @ojmetadata main "oj-c/items-menu"
 * @ojmetadata since "16.0.0"
 */
export declare const ItemsMenu: ({ items, selection, onSelectionChanged, defaultItemsRenderer, onOjMenuAction, isSplitMenu, onOjMenuSelection }: Props) => import("preact").JSX.Element;
