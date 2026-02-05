/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
type Props = {
    /**
     * True if the segment should be hidden.
     */
    isHidden?: boolean;
    /**
     * True if the segment should be highlighted.
     */
    isHighlighted?: boolean;
    /**
     * True if the literal is part of a date placeholder, such as mm/dd/yyyy.
     * If the date is partially specified or complete, this is false.
     */
    isPlaceholder?: boolean;
    /**
     * The text to display for this segment.
     */
    text: string;
};
/**
 * LiteralSegment is used to represent a literal separator in a calendar date,
 * such as the '/' in 11/29/2023.
 */
export declare const LiteralSegment: ({ isHidden, isHighlighted, isPlaceholder, text }: Props) => import("preact").JSX.Element;
export {};
