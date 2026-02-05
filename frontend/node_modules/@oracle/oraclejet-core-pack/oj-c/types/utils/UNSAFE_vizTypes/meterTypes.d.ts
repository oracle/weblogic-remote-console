/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ReferenceLine as PreactReferenceLine, Threshold as PreactThreshold } from '@oracle/oraclejet-preact/utils/UNSAFE_meterUtils';
type ReferenceLineLabelStyle = {
    /**
     * The color of the text.
     * @ojmetadata format 'color'
     */
    color?: NonNullable<PreactReferenceLine['labelStyle']>['color'];
} & Omit<NonNullable<PreactReferenceLine['labelStyle']>, 'color'>;
export type ReferenceLine = {
    /**
     * @description
     * <p>The color of the reference line.</p>
     * <p>In addition to standard CSS color values, special enumerated values 'danger', 'warning',
     * and 'success' are also supported. These special values are mapped to corresponding CSS color values
     * based upon the current theme.</p>
     * @ojmetadata format "color"
     * @ojmetadata propertyEditorValues {
     *   "danger": {
     *     "description": "Maps to theme-specific color indicating a danger condition"
     *   },
     *   "warning": {
     *     "description": "Maps to theme-specific color indicating a warning condition"
     *   },
     *   "success": {
     *     "description": "Maps to theme-specific color indicating a success condition"
     *   }
     * }
     */
    color?: PreactReferenceLine['color'];
    /**
     * @description
     * The position of the reference line.
     */
    position?: PreactReferenceLine['position'];
    /**
     * @description
     * The value of the reference line.
     */
    value: PreactReferenceLine['value'];
    /**
     * @description
     * The label for the reference line.
     */
    label?: PreactReferenceLine['label'];
    /**
     * @description
     * The style of the label for the reference line.
     */
    style?: ReferenceLineLabelStyle;
};
export type Threshold = {
    /**
     * @description
     * A label for the threshold used for accessibility purposes.
     */
    accessibleLabel?: PreactThreshold['accessibleLabel'];
    /**
     * @description
     * <p>The color of the threshold.</p>
     * <p>In addition to standard CSS color values, special enumerated values 'danger', 'warning',
     * and 'success' are also supported. These special values are mapped to corresponding CSS color values
     * based upon the current theme.</p>
     * @ojmetadata format "color"
     * @ojmetadata propertyEditorValues {
     *   "danger": {
     *     "description": "Maps to theme-specific color indicating a danger condition"
     *   },
     *   "warning": {
     *     "description": "Maps to theme-specific color indicating a warning condition"
     *   },
     *   "success": {
     *     "description": "Maps to theme-specific color indicating a success condition"
     *   }
     * }
     */
    color?: PreactThreshold['color'];
    /**
     * @description
     * The maximum value of the threshold.
     */
    max: PreactThreshold['max'];
};
export {};
