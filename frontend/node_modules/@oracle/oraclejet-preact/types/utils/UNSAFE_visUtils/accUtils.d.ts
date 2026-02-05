/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { BundleType } from '../../resources/nls/bundle';
export declare const supportsMobileScreenReader: boolean;
/**
 * Produces an aria label by combining a given aria label and states.
 * @param translations The translations bundle.
 * @param accessibleLabel The accessible label.
 * @param states The states.
 * @returns Final aria label.
 */
export declare const generateAriaLabel: (translations: BundleType, accessibleLabel: string, states: {
    isSelected?: boolean;
    isDrillable?: boolean;
}) => string;
