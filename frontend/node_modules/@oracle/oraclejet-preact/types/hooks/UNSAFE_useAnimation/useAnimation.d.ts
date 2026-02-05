import { UseAnimationCssProperties } from './animationUtils';
export type UseAnimationConfig<V extends string, E extends HTMLElement> = {
    animationStates: Partial<Record<AnimationStateKey<V>, ((node: E) => AnimationConfig) | AnimationConfig>>;
    isAnimatedOnMount?: boolean;
    onAnimationEnd?: ({ animationState }: {
        animationState: V;
    }) => void;
};
type AnimationStateKey<PA extends string> = ExtractAnimationStates<PA | `${PA} => ${PA}`>;
type ExtractAnimationStates<StateString extends string> = StateString extends `${infer From} => ${infer To}` ? KeyWithPreviousAndCurrentState<From, To> : StateString;
type KeyWithPreviousAndCurrentState<PreviousState extends string, CurrentState extends string> = {
    b: PreviousState;
} extends {
    b: CurrentState;
} ? never : `${PreviousState} => ${CurrentState}`;
type AnimationConfig = {
    from?: UseAnimationCssProperties;
    to: UseAnimationCssProperties;
    end?: UseAnimationCssProperties;
    options?: AnimationOptions;
};
type AnimationOptions = {
    delay?: number;
    duration?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | [number, number, number, number];
};
type PermittedAnimationState<V extends string> = Exclude<V, `${string}=>${string}`>;
/**
 * Hook to animate single components.
 * It allows n number of animation states.
 * @param animationState
 * @param animationConfig
 * @returns
 */
export declare function useAnimation<V extends string, E extends HTMLElement = HTMLElement>(animationState: PermittedAnimationState<V>, { animationStates, isAnimatedOnMount, onAnimationEnd }: UseAnimationConfig<PermittedAnimationState<V>, E>): {
    nodeRef: (node: E | null) => void;
    controller: {
        cancel: () => void;
    };
};
export {};
