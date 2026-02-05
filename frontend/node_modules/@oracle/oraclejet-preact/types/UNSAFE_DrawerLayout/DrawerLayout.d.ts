import { JSX, ComponentChildren } from 'preact';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
type Placement = 'start' | 'end' | 'bottom';
type OnCloseDetail = {
    placement: Placement;
    reason: 'escapeKey';
};
type OnTransitionEndDetail = {
    placement: Placement;
    value: boolean;
};
type DisplayMode = 'overlay' | 'reflow';
type Props = IntrinsicProps & {
    /**
     * The content node to be shown within the Start Drawer
     */
    startDrawer?: ComponentChildren;
    /**
     * The content node to be shown within the End Drawer
     */
    endDrawer?: ComponentChildren;
    /**
     * The content node to be shown within the Bottom Drawer
     */
    bottomDrawer?: ComponentChildren;
    /**
     * Specifies whether Start drawer is open.
     */
    isStartOpen?: boolean;
    /**
     * Specifies the display mode of the Start drawer.
     *
     * Supported values are:
     * <p><code>overlay</code>, <code>reflow</code></p>
     * Default is <code>undefined</code>.
     */
    startDisplay?: DisplayMode;
    /**
     * Specifies whether End drawer is open.
     */
    isEndOpen?: boolean;
    /**
     * Specifies the display mode of the End drawer.
     *
     * Supported values are:
     * <p><code>overlay</code>, <code>reflow</code></p>
     * Default is <code>undefined</code>.
     */
    endDisplay?: DisplayMode;
    /**
     * Specifies whether Bottom drawer is open.
     */
    isBottomOpen?: boolean;
    /**
     * Specifies the display mode of the Bottom drawer.
     *
     * Supported values are:
     * <p><code>overlay</code>, <code>reflow</code></p>
     * Default is <code>undefined</code>.
     */
    bottomDisplay?: DisplayMode;
    /**
     * Specifies callback triggered when a user tries to close a Drawer through UI interaction.
     * The parent should listen to this event and close the Drawer. If the parent fails to remove
     * the Popup, then no change will be done in the UI by the component.
     *
     * Supported detail values are:
     * <p><code>placement: start | end | bottom</code></p>
     * <p><code>reason: escapeKey</code></p>
     */
    onClose?: (detail: OnCloseDetail) => void;
    /**
     * Specifies callback triggered after the animation ends.
     *
     * Supported detail values are:
     * <p><code>placement: start | end | bottom</code></p>
     * <p><code>value: boolean</code></p>
     */
    onTransitionEnd?: (detail: OnTransitionEndDetail) => void;
} & TestIdProps;
/**
 * A drawer layout adds expandable side contents (drawers) alongside some primary content.
 *
 * These drawers automatically swap 'reflow' and 'overlay' display mode based on width of the page and can be placed at the 'start', 'end' or 'bottom' edge.
 */
export declare const DrawerLayout: ({ children, startDrawer, endDrawer, bottomDrawer, isStartOpen, isEndOpen, isBottomOpen, startDisplay, endDisplay, bottomDisplay, onClose, onTransitionEnd, testId }: Props) => JSX.Element;
export {};
