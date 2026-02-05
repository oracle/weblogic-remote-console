import { ComponentChildren } from 'preact';
type ConveyorBeltItemProps = {
    /**
     * The ConveyorBeltItem content
     */
    children?: ComponentChildren;
    /**
     * Specifies the current item which should be scrolled into view
     */
    isCurrent?: boolean;
};
/**
 * A wrapper component for one conveyor belt item/child element.
 * It takes care of correctly mark the child components as conveyor belt items.
 * @param param0 ConveyorBeltItemProps
 * @returns
 */
export declare const ConveyorBeltItem: ({ children, isCurrent }: ConveyorBeltItemProps) => import("preact").JSX.Element;
export {};
