import { ComponentProps } from 'preact';
import { Button } from 'oj-c/button';
import { MenuButton } from 'oj-c/menu-button';
import { SplitMenuButton } from 'oj-c/split-menu-button';
import { MenuIcon, type MenuSelection } from 'oj-c/utils/PRIVATE_ItemsMenu/menuTypes';
import { ButtonsetSingle } from 'oj-c/buttonset-single';
import { ButtonsetMultiple } from 'oj-c/buttonset-multiple';
import { ToggleButton } from 'oj-c/toggle-button';
import { ProgressButton } from 'oj-c/progress-button';
type ButtonIcons = {
    /**
     * @ojmetadata description "Optional icon to render at the start of the button."
     */
    startIcon?: MenuIcon;
    /**
     * @ojmetadata description "Optional icon to render at the end of the button."
     */
    endIcon?: MenuIcon;
};
export type ToolbarItems = ToolbarButton | ToolbarMenuButton | ToolbarSplitMenuButton | ToolbarButtonsetSingle | ToolbarButtonsetMultiple | ToolbarToggleButton | ToolbarProgressButton | ToolbarSeparator;
/**
 * Describes the oj-c-button props available to be used when defining this specific toolbar item.
 * @ojmetadata help "#ToolbarButtonProps"
 */
type ToolbarButtonProps = Pick<ComponentProps<typeof Button>, 'chroming' | 'disabled' | 'display' | 'label' | 'tooltip'> & ButtonIcons;
/**
 * Describes an oj-c-button item in the Toolbar.
 * @ojmetadata help "#ToolbarButton"
 */
type ToolbarButton = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'button';
    /**
     * @ojmetadata description "A unique key associated with the toolbar item."
     */
    key: string;
    /**
     * @ojmetadata description "Optional callback function associated with the toolbar item."
     */
    onAction?: () => void;
} & ToolbarButtonProps;
/**
 * Describes the oj-c-menu-button props available to be used when defining this specific toolbar item.
 * @ojmetadata help "#ToolbarMenuButtonProps"
 */
type ToolbarMenuButtonProps = Pick<ComponentProps<typeof MenuButton>, 'chroming' | 'disabled' | 'display' | 'items' | 'label' | 'tooltip' | 'suffix'> & ButtonIcons;
/**
 * Describes an oj-c-menu-button item in the Toolbar.
 * @ojmetadata help "#ToolbarMenuButton"
 */
type ToolbarMenuButton = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'menu-button';
    /**
     * @ojmetadata description "A unique key associated with the toolbar item, only needed for automated testing."
     */
    key?: string;
} & ToolbarMenuButtonProps;
/**
 * Describes the oj-c-split-menu-button props available to be used when defining this specific toolbar item.
 * @ojmetadata help "#ToolbarSplitMenuButtonProps"
 */
type ToolbarSplitMenuButtonProps = Pick<ComponentProps<typeof SplitMenuButton>, 'chroming' | 'disabled' | 'items' | 'label' | 'tooltip'>;
/**
 * Describes an oj-c-split-menu-button item in the Toolbar.
 * @ojmetadata help "#ToolbarSplitMenuButton"
 */
type ToolbarSplitMenuButton = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'split-menu-button';
    /**
     * @ojmetadata description "A unique key associated with the toolbar item."
     */
    key: string;
    /**
     * @ojmetadata description "Optional callback function associated with the toolbar item."
     */
    onAction?: () => void;
} & ToolbarSplitMenuButtonProps;
/**
 * Describes the oj-c-buttonset-single props available to be used when defining this specific toolbar item.
 * @ojmetadata help "#ToolbarButtonsetSingleProps"
 */
type ToolbarButtonsetSingleProps = Pick<ComponentProps<typeof ButtonsetSingle>, 'chroming' | 'disabled' | 'display' | 'items'>;
/**
 * Describes an oj-c-buttonset-single item in the Toolbar.
 * @ojmetadata help "#ToolbarButtonsetSingle"
 */
type ToolbarButtonsetSingle = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'buttonset-single';
    /**
     * @ojmetadata description "A unique key associated with the toolbar item."
     */
    key: string;
} & ToolbarButtonsetSingleProps;
/**
 * Describes the oj-c-buttonset-multiple props available to be used when defining this specific toolbar item.
 * @ojmetadata help "#ToolbarButtonsetMultipleProps"
 */
type ToolbarButtonsetMultipleProps = Pick<ComponentProps<typeof ButtonsetMultiple>, 'chroming' | 'disabled' | 'display' | 'items'>;
/**
 * Describes an oj-c-buttonset-multiple item in the Toolbar.
 * @ojmetadata help "#ToolbarButtonsetMultiple"
 */
type ToolbarButtonsetMultiple = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'buttonset-multiple';
    /**
     * @ojmetadata description "A unique key associated with the toolbar item."
     */
    key: string;
} & ToolbarButtonsetMultipleProps;
/**
 * Describes the oj-c-toggle-button props available to be used when defining this specific toolbar item.
 * @ojmetadata help "#ToolbarToggleButtonProps"
 */
type ToolbarToggleButtonProps = Pick<ComponentProps<typeof ToggleButton>, 'chroming' | 'disabled' | 'display' | 'label' | 'tooltip'> & ButtonIcons;
/**
 * Describes an oj-c-toggle-button item in the Toolbar.
 * @ojmetadata help "#ToolbarToggleButton"
 */
type ToolbarToggleButton = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'toggle-button';
    /**
     * @ojmetadata description "A unique key associated with the toolbar item."
     */
    key: string;
} & ToolbarToggleButtonProps;
/**
 * Describes the oj-c-progress-button props available to be used when defining this specific toolbar item.
 * @ojmetadata help "#ToolbarProgressButtonProps"
 */
type ToolbarProgressButtonProps = Pick<ComponentProps<typeof ProgressButton>, 'chroming' | 'disabled' | 'display' | 'label' | 'tooltip' | 'isLoading'> & ButtonIcons;
/**
 * Describes an oj-c-progress-button item in the Toolbar.
 * @ojmetadata help "#ToolbarToggleButton"
 */
type ToolbarProgressButton = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'progress-button';
    /**
     * @ojmetadata description "A unique key associated with the toolbar item."
     */
    key: string;
    /**
     * @ojmetadata description "Optional callback function associated with the toolbar item."
     */
    onAction?: () => void;
} & ToolbarProgressButtonProps;
/**
 * Describes a separator item in the Toolbar.
 * @ojmetadata help "#ToolbarSeparator"
 */
type ToolbarSeparator = {
    /**
     * @ojmetadata description "Specifies the desired toolbar item."
     */
    type: 'separator';
};
/**
 * Describes the state of selection groups in the Toolbar.
 * @ojmetadata help "#ToolbarSelection"
 */
export type ToolbarSelection = Record<string, MenuSelection> | Array<string> | string | boolean;
export type ToolbarValueUpdateDetail<T> = {
    previousValue?: T;
    value: T;
};
export type SelectToolbarItemDetail<T extends ToolbarSelection> = {
    value: ToolbarValueUpdateDetail<T>['value'];
    toolbarSelectionGroupKey: string;
};
export type ItemChroming = 'borderless' | 'outlined';
export type ItemSizes = 'sm' | 'md' | 'lg';
export interface ToolbarActionDetail {
    key: string;
}
export type ToolbarSelectionDetail = SelectToolbarItemDetail<ToolbarSelection>;
export {};
