import { ComponentChildren } from 'preact';
export type ContextMenuConfig<ContextMenuContext> = {
    itemsRenderer: (context: ContextMenuContext) => ComponentChildren;
    accessibleLabel?: string;
};
