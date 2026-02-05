/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX, ComponentChildren } from 'preact';
type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
type Props = {
    children?: ComponentChildren;
    /**
     * Name of the text slot which determines styling
     */
    variant: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'overline' | 'metadata';
} & IntrinsicProps;
export declare function ListItemText({ children, variant }: Props): JSX.Element;
export {};
