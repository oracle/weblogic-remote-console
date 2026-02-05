import { Props } from '../UNSAFE_CardFlexView';
type CardGridProps<K extends string | number, D> = Props<K, D> & {
    /**
     * Provide the number of columns to render. The number of columns is required for CardGridView component.
     * If the number of columns is not provided, please use CardFlexView component.
     */
    columns: number;
};
export declare function CardGridView<K extends string | number, D>(props: CardGridProps<K, D>): import("preact").JSX.Element;
export {};
