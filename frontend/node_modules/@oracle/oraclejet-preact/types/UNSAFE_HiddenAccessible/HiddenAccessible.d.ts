import { ComponentChildren } from 'preact';
type HiddenAccessibleProps = {
    /**
     * Specifies the ComponentChildren
     */
    children?: ComponentChildren;
    /**
     * HTML id for the rendered element
     */
    id?: string;
    /**
     * Specifies whether the element is hidden to the screen readers by default.
     * However, one can override it using aria-describedby/aria-labelledby. This is
     * useful when the content should be read only as a description for another content
     * and not as a content of the container.
     */
    isHidden?: boolean;
};
/**
 * HiddenAccessible is a helper component that hides its children visually,
 * but keeps them visible to screen readers.
 *
 */
declare function HiddenAccessible({ children, id, isHidden }: HiddenAccessibleProps): import("preact").JSX.Element;
export { HiddenAccessible };
