/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { MenuValueUpdateDetail } from '@oracle/oraclejet-preact/UNSAFE_Menu/menuUtils';
export type { MenuValueUpdateDetail } from '@oracle/oraclejet-preact/UNSAFE_Menu/menuUtils';
export type MenuIcon = {
    type?: 'class';
    class: string;
} | {
    type: 'img';
    src: string;
};
/**
 * Specifies a selectable item in a menu item.
 * @ojmetadata description "MenuSelectItem"
 * @ojmetadata displayName "MenuSelectItem"
 * @ojmetadata help "#menuselectitem"
 */
export type MenuSelectItem = {
    /**
     * @ojmetadata description "The selectable item label."
     */
    label: string;
    /**
     * @ojmetadata description "Specifies if the selectable item is disabled (enabled by default)."
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Optional icon to render at the end of the selectable item."
     */
    endIcon?: MenuIcon;
    /**
     * @ojmetadata description "The value associated with the selectable item."
     */
    value: string;
};
export interface MenuItemSelectionDetail {
    key: string;
}
export type MenuSelection = string | Array<string>;
/**
 * Specifies a menu separator:  <code>{ type: "separator" }</code>.
 * @ojmetadata description "MenuSeparator"
 * @ojmetadata displayName "MenuSeparator"
 * @ojmetadata help "#menuseparator"
 */
export type MenuSeparator = {
    /**
     * @ojmetadata description "Specifies a separator menu item."
     * @ojmetadata status [
     *   {
     *     type: "deprecated",
     *     since: "17.0.0",
     *     target: "propertyValue",
     *     value: ["divider"],
     *     description: "Use 'separator' instead."
     *   }
     * ]
     */
    type: 'separator' | 'divider';
};
/**
 * Specifies a standard menu item.
 * @ojmetadata description "MenuItem "
 * @ojmetadata displayName "MenuItem"
 * @ojmetadata help "#menuitem"
 */
export type MenuItem = {
    /**
     * @ojmetadata description "Specifies a standard menu item."
     */
    type?: 'item';
    /**
     * @ojmetadata description "The menu item label."
     */
    label: string;
    /**
     * @ojmetadata description "A unique key associated with the menu item."
     */
    key: string;
    /**
     * @ojmetadata description "Specifies if the menu item is disabled (enabled by default)."
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Optional callback function associated with the menu item."
     */
    onAction?: () => void;
    /**
     * @ojmetadata description "Optional icon to render at the start of the menu item."
     */
    startIcon?: MenuIcon;
    /**
     * @ojmetadata description "Optional icon to render at the end of the menu item."
     */
    endIcon?: MenuIcon;
    /**
     * @ojmetadata description "Specifies the menu item behavior."
     */
    variant?: 'standard' | 'destructive';
};
/**
 * Specifies a menu item representing a submenu.
 * @ojmetadata description "MenuSubMenu "
 * @ojmetadata displayName "MenuSubMenu"
 * @ojmetadata help "#menusubmenu"
 */
export type MenuSubMenu = {
    /**
     * @ojmetadata description "A unique key associated with the submenu menu item."
     */
    key?: string;
    /**
     * @ojmetadata description "Specifies a submenu menu item."
     */
    type: 'submenu';
    /**
     * @ojmetadata description "The submenu label."
     */
    label?: string;
    /**
     * @ojmetadata description "Specifies if the submenu is disabled (enabled by default)."
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Optional icon to render at the start of the submenu."
     */
    startIcon?: string;
    /**
     * @ojmetadata description "Specifies the array of menu items that make up the submenu."
     */
    items?: Array<MenuItems>;
};
/**
 * Specifies a menu item representing a select single.
 * @ojmetadata description "MenuSelectSingle"
 * @ojmetadata displayName "MenuSelectSingle"
 * @ojmetadata help "#menuselectsingle"
 */
export type MenuSelectSingle = {
    /**
     * @ojmetadata description "Specifies a select single menu item."
     */
    type: 'selectsingle';
    /**
     * @ojmetadata description "A unique key associated with the select single."
     */
    key: string;
    /**
     * @ojmetadata description "Specifies the array of select items that make up the select single."
     */
    items?: Array<MenuSelectItem>;
};
/**
 * Specifies a menu item representing a select multiple.
 * @ojmetadata description "MenuSelectMultiple"
 * @ojmetadata displayName "MenuSelectMultiple"
 * @ojmetadata help "#menuselectmultiple"
 */
export type MenuSelectMultiple = {
    /**
     * @ojmetadata description "Specifies a select multiple menu item."
     */
    type: 'selectmultiple';
    /**
     * @ojmetadata description "A unique key associated with the select multiple."
     */
    key: string;
    /**
     * @ojmetadata description "Specifies the array of select items that make up the select multiple."
     */
    items?: Array<MenuSelectItem>;
};
/**
 * @ojmetadata description "MenuItems"
 * @ojmetadata displayName "MenuItems"
 * @ojmetadata help "#menuitemtype"
 */
export type MenuItems = MenuSeparator | MenuItem | MenuSubMenu | MenuSelectSingle | MenuSelectMultiple;
type ContextMenuSeparator = {
    type: 'separator';
};
type ContextMenuSubMenu = Omit<MenuSubMenu, 'items'> & {
    items?: Array<ContextMenuItems | string>;
};
export type ContextMenuSelectSingle = MenuSelectSingle & {
    selection?: string;
    onSelection?: (detail: SelectMenuItemDetail<string>) => void;
};
export type ContextMenuSelectMultiple = MenuSelectMultiple & {
    selection?: Array<string>;
    onSelection?: (detail: SelectMenuItemDetail<Array<string>>) => void;
};
export type SelectMenuItemDetail<T extends MenuSelection> = {
    value: MenuValueUpdateDetail<T>['value'];
    menuSelectionGroupKey: string;
};
export type ContextMenuItems = ContextMenuSeparator | MenuItem | ContextMenuSubMenu | ContextMenuSelectSingle | ContextMenuSelectMultiple;
