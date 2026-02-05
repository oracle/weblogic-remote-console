/*******************
 * Component Styles
 *******************/
import { ComponentThemeType } from '../../UNSAFE_Theme';
type WindowOverlayStyles = typeof styles;
type WindowOverlayTheme = ComponentThemeType<WindowOverlayVariants, WindowOverlayStyles>;
type WindowOverlayVariants = typeof variants;
/*******************
 * Component Styles
 *******************/
export declare const windowOverlayStyles: {
    readonly notificationPosition: string;
    readonly top: string;
    readonly "top-left": string;
    readonly bottom: string;
    readonly "bottom-left": string;
    readonly "top-right": string;
    readonly "bottom-right": string;
    readonly right: string;
    readonly left: string;
    readonly 'left-top': string;
    readonly 'left-bottom': string;
    readonly 'right-top': string;
    readonly 'right-bottom': string;
};
declare const baseStyle: string;
declare const styles: {
    baseStyle: string;
    placementStyles: {
        center: string;
        top: string;
        'top-end': string;
        'top-right': string;
        'top-start': string;
        'top-left': string;
        'top-end-corner': string;
        'top-start-corner': string;
        end: string;
        'end-top': string;
        'end-bottom': string;
        'end-top-corner': string;
        'end-bottom-corner': string;
        bottom: string;
        'bottom-end': string;
        'bottom-right': string;
        'bottom-start': string;
        'bottom-left': string;
        'bottom-end-corner': string;
        'bottom-start-corner': string;
        start: string;
        'start-top': string;
        'start-bottom': string;
        'start-top-corner': string;
        'start-bottom-corner': string;
    };
    windowOverlayStyles: {
        readonly notificationPosition: string;
        readonly top: string;
        readonly "top-left": string;
        readonly bottom: string;
        readonly "bottom-left": string;
        readonly "top-right": string;
        readonly "bottom-right": string;
        readonly right: string;
        readonly left: string;
        readonly 'left-top': string;
        readonly 'left-bottom': string;
        readonly 'right-top': string;
        readonly 'right-bottom': string;
    };
    gridStyles: string;
};
/*******************
 * Component Variants
 *******************/
declare const variants: {};
export type { WindowOverlayTheme, WindowOverlayStyles };
export { baseStyle, styles, variants };
