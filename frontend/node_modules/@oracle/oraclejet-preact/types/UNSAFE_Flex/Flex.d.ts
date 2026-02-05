/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { TestIdProps } from "../hooks/UNSAFE_useTestId";
import { ComponentChildren } from 'preact';
import type { BoxAlignmentProps } from '../utils/UNSAFE_interpolations/boxalignment';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import type { FlexboxProps } from '../utils/UNSAFE_interpolations/flexbox';
import type { FlexitemProps } from '../utils/UNSAFE_interpolations/flexitem';
type StyleProps = DimensionProps & FlexboxProps & FlexitemProps & BoxAlignmentProps;
type Props = StyleProps & TestIdProps & {
    children?: ComponentChildren;
    /**
     * @default true
     */
    hasZeroMargins?: boolean;
};
export declare const Flex: ({ children, hasZeroMargins, testId, ...props }: Props) => import("preact").JSX.Element;
export {};
