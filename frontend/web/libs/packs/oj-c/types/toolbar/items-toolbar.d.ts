import { PropertyChanged } from 'ojs/ojvcomponent';
import { SelectToolbarItemDetail, ToolbarItems, ToolbarActionDetail, ToolbarSelection, ItemChroming, ItemSizes } from './itemsTypes';
export type { ToolbarItems, ToolbarActionDetail, ToolbarSelection, ToolbarSelectionDetail, ItemChroming, ItemSizes } from './itemsTypes';
type Props = {
    /**
     * @ojmetadata description "Specifies the content to be placed into the toolbar."
     * @ojmetadata displayName "items"
     * @ojmetadata help "#items"
     */
    items?: ToolbarItems[];
    /**
     * @ojmetadata description "Specifies the chroming to be set on content to be placed into the toolbar."
     * @ojmetadata displayName "chroming"
     * @ojmetadata help "#chroming"
     */
    chroming?: ItemChroming;
    /**
     * @ojmetadata description "Specifies the size of content to be placed into the toolbar."
     * @ojmetadata displayName "size"
     * @ojmetadata help "#size"
     */
    size?: ItemSizes;
    /**
     * @ojmetadata description "An array containing key/value objects for selection groups."
     * @ojmetadata displayName "toolbarSelection"
     * @ojmetadata help "#toolbarSelection"
     */
    toolbarSelection?: Record<string, ToolbarSelection>;
    /**
     * @ojmetadata description Writeback support for the selection property.
     * @ojmetadata displayName "onToolbarSelectionChanged"
     * @ojmetadata help "#selection"
     */
    onToolbarSelectionChanged?: PropertyChanged<Record<string, ToolbarSelection>>;
    /**
     * @ojmetadata description "Triggered when a toolbar item is clicked, whether by keyboard, mouse,
     *    or touch events. Detail indicates which toolbar item was clicked."
     * @ojmetadata @ojmetadata displayName "onOjToolbarAction"
     * @ojmetadata help "#event:ojToolbarAction"
     */
    onOjToolbarAction?: (details: ToolbarActionDetail) => void;
    /**
     * @ojmetadata description "Triggered when a toolbar selection group item is clicked, whether by keyboard, mouse,
     *    or touch events. Detail indicates new selection value for group."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:ojToolbarSelection"
     */
    onOjToolbarSelection?: (details: SelectToolbarItemDetail<ToolbarSelection> & {
        toolbarSelectionGroupKey: string;
    }) => void;
};
export declare const ItemsToolbar: ({ items, size, chroming, toolbarSelection, onToolbarSelectionChanged, onOjToolbarAction, onOjToolbarSelection }: Props) => import("preact").JSX.Element;
