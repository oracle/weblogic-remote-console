/**
 * This file contains a style interpolation for dimension css properties.
 * It contains prop => style functions related to a UI elements
 * dimensions.
 * Style interpolations are functions that transform props to UI styling.
 * This technique is often used in Styled Components to provide consistent,
 * reusable styled props API.
 *
 * This file contains dimension properties like width, height,
 * maxHeight, etc. The intent of this dimension interpolation file
 * is that all component apis that need dimension properties
 * will use these dimensions interpolations so that the properties, in whatever component they are used,
 * will type the properties the same way and will also interpolate the
 * property values the same way. This gives us consistent apis and behavior.
 * I.e., The dimension properties are all typed with Size, and the user's values all run through the same sizeToCSS() function.
 */
import { Size } from '../../../utils/UNSAFE_size';
declare const dimensions: readonly ["height", "maxHeight", "maxWidth", "minHeight", "minWidth", "width"];
type Dimension = (typeof dimensions)[number];
export type DimensionProps = {
    [key in Dimension]?: Size;
};
type Interpolations = {
    [Key in keyof DimensionProps]-?: (props: Pick<DimensionProps, Key>) => object | Record<string, string>;
};
declare const dimensionInterpolations: Interpolations;
export { dimensions, dimensionInterpolations };
