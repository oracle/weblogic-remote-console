/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { NavigationListProps } from './NavigationListProps';
type CurrentKeyDetail<K> = {
    value: K;
};
export type NavigationListContextProps<K extends string | number> = Pick<NavigationListProps<K>, 'selection' | 'onSelectionChange' | 'onRemove'> & {
    currentKey?: K;
    showFocusRing: boolean;
    onCurrentKeyChange: (<K extends string | number>(detail: CurrentKeyDetail<K>) => void) | undefined;
    navigationListItemPrefix: string;
};
/**
 * Context used to pass navlist information without having to pass it to navlist children props.
 * We want to communicate information down to any interested navlist item children.
 */
declare const NavigationListContext: import("preact").Context<NavigationListContextProps<string | number>>;
export { NavigationListContext };
