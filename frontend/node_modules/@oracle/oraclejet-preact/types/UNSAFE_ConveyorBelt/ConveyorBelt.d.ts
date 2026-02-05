import { ComponentChildren, Ref } from 'preact';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
export type ConveyorBeltProps = TestIdProps & {
    /**
     * ConveyorBelt Component content
     */
    children?: ComponentChildren;
    /**
     * Sets the number of pixels that an element's content is scrolled from its initial position.
     */
    scrollPosition?: number;
    /**
     * Callback that is executed every time conveyor belt is scrolled and the scroll position is changed.
     * @param value The value is the new scroll position of the conveyor belt.
     * @returns
     */
    onScrollPositionChanged?: (value?: number) => void;
    /**
     * Indicates whether overflow content arrows are visible or hidden.
     * "auto" show overflow arrows on desktop, hide on mobile.
     * "visible" always show overflow arrows.
     * "hidden" never show overflow arrows.
     */
    arrowVisibility?: 'auto' | 'visible' | 'hidden';
    /**
     * Specify the orientation of the conveyorBelt.
     * "horizontal" Orient the conveyorBelt horizontally.
     * "vertical" Orient the conveyorBelt vertically.
     */
    orientation?: 'horizontal' | 'vertical';
};
export type ScrollableHandle = {
    scrollElementIntoView: (element: HTMLElement) => void;
};
/**
 * The Conveyor belt component is a container element that manages
 * overflow for its child elements and allows scrolling among them
 */
export declare const ConveyorBelt: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<ConveyorBeltProps> & {
    ref?: Ref<ScrollableHandle> | undefined;
}>;
