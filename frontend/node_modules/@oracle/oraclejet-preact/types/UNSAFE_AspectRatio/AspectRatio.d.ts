import { VNode } from 'preact';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import { ratios } from './AspectRatioStyles.css';
type Ratio = (typeof ratios)[number];
declare const dimensions: readonly ["maxWidth", "minWidth", "width"];
type Dimension = (typeof dimensions)[number];
type StyleInterpolationProps = Pick<DimensionProps, Dimension>;
type AspectRatioProps = StyleInterpolationProps & {
    /**
     * The box’s preferred aspect ratio is the specified ratio of width / height. When ratio is 1/1
     * it is a square.
     */
    ratio?: Ratio;
    /**
     * The child.
     */
    children: VNode<any>;
};
/**
 * The AspectRatio component displays its content with a certain ratio based on the dimension
 * properties. Overflow content is hidden.
 *
 * It uses a common padding-bottom hack to do this. In future versions it will
 * be implemented using the CSS's aspect-ratio property when the browsers we need to support
 * all have it. For example, Safari 15 has it, but we won't drop Safari 14 until jet 14.
 *
 */
declare function AspectRatio({ children, ratio, ...props }: AspectRatioProps): import("preact").JSX.Element;
export { ratios, AspectRatio };
