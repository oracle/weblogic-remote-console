import { ContextMenuItems } from '../PRIVATE_ItemsMenu/items-menu';
export type ContextMenuConfig = {
    items: Array<ContextMenuItems> | Promise<Array<ContextMenuItems>>;
    anchor?: Element;
    offset?: {
        mainAxis?: number;
        crossAxis?: number;
    };
    collision?: 'fit' | 'flipfit';
    accessibleLabel?: string;
    placement?: 'bottom-start' | 'top-end';
};
export declare const startContextMenuGestureDetection: (rootNode: Element, contextMenuHandler: () => ContextMenuConfig) => () => void;
