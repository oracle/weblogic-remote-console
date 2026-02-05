/**
 * Where to place the floating element relative to its reference element.
 * The top, bottom, right and left are physical positions of the floating element
 * The start, end are logical positions and will adapt to the writing direction (e.g. RTL) as expected.
 * The -[*] and -[*] are alignments on the cross axis.
 * For example start-top means place the floating element to the left (in LTR) from the reference element and align their top edges
 * There are several synonyms for placements:
 * - right-top, right-start and end-top in LTR (start-top in RTL)
 * - left-top, left-start and start-top in LTR (end-top in RTL)
 * - right-bottom, right-end and end-bottom in LTR (start-bottom in RTL)
 * - left-bottom, left-end and start-bottom in LTR (end-bottom in RTL)
 */
export type Placement = 'top' | 'top-start' | 'top-end' | 'top-start-corner' | 'top-end-corner' | 'start' | 'start-top' | 'start-bottom' | 'start-top-corner' | 'start-bottom-corner' | 'bottom' | 'bottom-start' | 'bottom-end' | 'bottom-start-corner' | 'bottom-end-corner' | 'end' | 'end-top' | 'end-bottom' | 'end-top-corner' | 'end-bottom-corner' | 'center';
export type Coords = {
    x: number;
    y: number;
    contextElement?: Element;
};
type Length = 'width' | 'height';
type Dimensions = {
    [key in Length]: number;
};
export type Rect = Coords & Dimensions;
export type Offset = number | {
    mainAxis?: number;
    crossAxis?: number;
};
export type RtlSide = 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
export type PositionData = {
    placement: Placement;
    origPlacement: Placement;
    x: number | null;
    y: number | null;
    arrow?: Partial<Coords> & {
        centerOffset: number;
    };
    offset?: Coords;
    origOffset?: Offset;
};
export {};
