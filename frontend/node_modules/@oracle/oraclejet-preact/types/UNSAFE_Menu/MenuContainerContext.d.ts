/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { MutableRef } from 'preact/hooks';
import { MenuCollectionItem } from './menuUtils';
export type MenuContainerContextProps = {
    menuContainerRef: MutableRef<HTMLDivElement | null>;
    currentKey?: string;
    showFocusRing: boolean;
    changeKey: (detail: MenuCollectionItem) => void;
    isContainerFocused: boolean;
    menuContainerGeneralInformation: MutableRef<{
        wasMouseMoved: boolean;
        lastMouseLeaveMenuItemdRelatedTarget: HTMLElement | null;
    }>;
};
/**
 * Context used to pass menu information without having to pass it to menu children MenuContainerContextprops.
 * We want to communicate information down to any interested menu item children.
 */
declare const MenuContainerContext: import("preact").Context<MenuContainerContextProps>;
export { MenuContainerContext };
