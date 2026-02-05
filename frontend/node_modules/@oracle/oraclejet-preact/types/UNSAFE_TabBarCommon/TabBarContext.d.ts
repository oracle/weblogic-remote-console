/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { TabBarProps } from '../UNSAFE_TabBar';
export type TabBarContextProps<K extends string | number> = Pick<TabBarProps<K>, 'layout' | 'display' | 'size' | 'selection' | 'onSelect' | 'onRemove'> & {
    currentKey?: K;
    showFocusRing: boolean;
    hideTooltip: boolean;
    isEdgeBottom?: boolean;
    tabItemPrefix: string;
};
/**
 * Context used to pass TabBar information without having to pass it to TabBar children props.
 * We want to communicate information down to any interested TabBar item children.
 */
declare const TabBarContext: import("preact").Context<TabBarContextProps<string | number>>;
export { TabBarContext };
