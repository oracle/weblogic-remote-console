/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps } from 'preact';
import { Menu } from './Menu';
type Props = {
    isMobile: boolean;
    onClose: ComponentProps<typeof Menu>['onClose'];
    testId: string | undefined;
};
/**
 * Context used to pass menu information without having to pass it to menu children props.
 * We want to communicate information down to any interested menu item children.
 */
declare const MenuContext: import("preact").Context<Props>;
export { MenuContext };
