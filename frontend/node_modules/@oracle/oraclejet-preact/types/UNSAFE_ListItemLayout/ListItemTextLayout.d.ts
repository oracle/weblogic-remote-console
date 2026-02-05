/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX } from 'preact';
type IntrinsicProps = JSX.HTMLAttributes<HTMLDivElement>;
type Props = {
    /**
     * The primary prop takes a simple string that will be formatted and placed in the center of the text area.
     */
    primary?: string;
    /**
     * The secondary prop takes a simple string that will be formatted and placed below the primary text.
     */
    secondary?: string;
    /**
     * The tertiary prop takes a simple string that will be formatted and placed below the secondary text.
     */
    tertiary?: string;
    /**
     * The overline prop takes a simple string that will be formatted and placed above the primary text.
     */
    overline?: string;
} & IntrinsicProps;
export declare function ListItemTextLayout({ primary, secondary, tertiary, overline }: Props): JSX.Element;
export {};
