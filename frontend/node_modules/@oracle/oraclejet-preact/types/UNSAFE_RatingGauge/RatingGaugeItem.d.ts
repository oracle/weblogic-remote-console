/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { RatingStarColorType } from './ratingUtils';
type Props = {
    fillRatio: number;
    isDisabled?: boolean;
    isReadonly?: boolean;
    color: RatingStarColorType;
};
declare const RatingGaugeItem: ({ fillRatio, isDisabled, isReadonly, color }: Props) => import("preact").JSX.Element;
export { RatingGaugeItem };
