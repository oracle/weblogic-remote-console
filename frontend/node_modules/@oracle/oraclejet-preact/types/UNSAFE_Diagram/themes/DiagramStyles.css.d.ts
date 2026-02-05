import { style } from '@vanilla-extract/css';
type DiagramStyles = typeof style;
declare const outerStyles: string;
declare const layerStyles: string;
declare const itemStyles: {
    nodeStyles: string;
    linkStyles: string;
    dimmedItemStyle: string;
};
declare const labelStyles: {
    labelStyle: string;
    labelBorderStyle: string;
};
declare const panZoomStyles: string;
declare const dimensionStyle: string;
export type { DiagramStyles };
export { outerStyles, layerStyles, itemStyles, panZoomStyles, labelStyles, dimensionStyle };
