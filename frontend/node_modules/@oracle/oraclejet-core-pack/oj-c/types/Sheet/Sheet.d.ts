/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Sheet as PreactSheet } from '@oracle/oraclejet-preact/UNSAFE_Sheet';
import { ComponentProps } from 'preact';
type PreactSheetProps = ComponentProps<typeof PreactSheet>;
declare function Sheet({ isOpen, children, onClose, initialFocus }: Pick<PreactSheetProps, 'isOpen' | 'children' | 'onClose' | 'initialFocus'>): import("preact").JSX.Element;
export { Sheet };
