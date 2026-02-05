import { Placement, Floating } from '../UNSAFE_Floating';
import { AnimationStatus, AnimationStatusProps, AnimationStates } from '../hooks/PRIVATE_useAnimationStatus';
import { ComponentProps } from 'preact';
/**
 * The placement and direction aware HTML element
 * The useAnimation hook do not allow to change dynamically the animation states,
 * but allows a function that returns animation states config. The function takes
 * the animated node of type <E extends HTMLElement> as an argument. This could be used
 * to extend HTMLElement with placement and direction.
 */
export type AnimationPopupElement = HTMLElement & {
    placement?: Placement;
    direction?: 'ltr' | 'rtl';
};
type PopupAnimationProps = Omit<AnimationStatusProps, 'animationStates'> & {
    /**
     * Specifies placement of the Popup relative to the anchor.
     */
    placement: Placement;
    /**
     * animationStates is the configuration of the animations, how the element should be animated
     */
    animationStates?: AnimationStates;
    /**
     * Triggered when placement or coordinates are changed after collision is detected
     */
    onPosition?: ComponentProps<typeof Floating>['onPosition'];
};
export declare function usePopupAnimation(props: PopupAnimationProps): {
    status: AnimationStatus;
    setAnimationElementRef: (node: HTMLElement | null) => void;
    onPosition: ComponentProps<typeof Floating>['onPosition'];
};
export {};
