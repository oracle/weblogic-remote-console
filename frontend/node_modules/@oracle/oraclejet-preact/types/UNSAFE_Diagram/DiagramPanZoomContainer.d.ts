import { ComponentChildren } from 'preact';
type Props = {
    centerX: number;
    centerY: number;
    zoom: number;
    width: number;
    height: number;
    children: ComponentChildren;
};
export declare function DiagramPanZoomContainer({ centerX, centerY, children, zoom, width, height }: Props): import("preact").JSX.Element;
export {};
