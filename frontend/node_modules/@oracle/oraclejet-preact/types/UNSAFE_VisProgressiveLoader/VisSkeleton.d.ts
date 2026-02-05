import { Size } from "../utils/UNSAFE_size";
type Props = {
    /**
     * The visualization type.
     */
    type: 'bar' | 'area' | 'line' | 'combo' | 'pie';
    /**
     * The width of the skeleton.
     */
    width?: Size;
    /**
     * The height of the skeleton.
     */
    height?: Size;
};
/**
 * Skeleton loading for visualizations.
 */
export declare function VisSkeleton({ type, width, height }: Props): import("preact").JSX.Element;
export {};
