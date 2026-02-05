/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Dropdown as PreactDropdown } from '@oracle/oraclejet-preact/UNSAFE_Dropdown';
import { ComponentProps } from 'preact';
type PreactDropdownProps = ComponentProps<typeof PreactDropdown>;
type Placement = Extract<Parameters<Required<PreactDropdownProps>['onPosition']>[0]['placement'], 'bottom-start' | 'top-start' | 'bottom-end' | 'top-end'>;
declare function Dropdown({ anchorRef, isOpen, children, onClose, initialFocus, onPosition }: Pick<PreactDropdownProps, 'anchorRef' | 'isOpen' | 'children' | 'onClose' | 'initialFocus'> & {
    /**
     * Triggered when placement or coordinates are changed after collision is detected.
     */
    onPosition?: (data: {
        placement: Placement;
    }) => void;
}): import("preact").JSX.Element;
export { Dropdown };
