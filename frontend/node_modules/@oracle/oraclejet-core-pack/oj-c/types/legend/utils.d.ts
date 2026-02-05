/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Returns the text styles for linear and sectional legend.
 */
export declare function getTextStyles(styles?: Partial<CSSStyleDeclaration>): {
    textFontStyle: string | undefined;
    textFontSize: string | undefined;
    textFontColor: string | undefined;
    textFontWeight: string | undefined;
    textDecoration: string | undefined;
    textFontFamily: string | undefined;
};
/**
 * Return the styles for the sectional legend titles.
 */
export declare function getSectionStyles(styles?: Partial<CSSStyleDeclaration>): {
    sectionTitleColor: string | undefined;
    sectionTitleFontFamily: string | undefined;
    sectionTitleFontSize: string | undefined;
    sectionTitleFontStyle: string | undefined;
    sectionTitleFontWeight: string | undefined;
    sectionTitleTextDecoration: string | undefined;
};
/**
 * Checks if the legend is interactive.
 */
export declare function isLegendInteractive(drilling?: 'on' | 'off', hideAndShowBehavior?: 'on' | 'off', hoverBehavior?: 'dim' | 'none', hasDrillableItem?: boolean, isContextMenuEnabled?: boolean): boolean | undefined;
/**
 * Parses preact id to corepack id.
 */
export declare function parseItemIdx(id: string): number[];
/**
 * Transforms the corepack legend item to preact legend item.
 * @param item The legend item
 * @param ariaLabelSuffix The suffix to add in the legend item aria label.
 * @returns
 */
export declare function transformItem(dataItem: any, sectionIndex: number, itemIndex: number, ariaLabelSuffix: string, drilling?: 'on' | 'off', hideAndShowBehavior?: 'on' | 'off', isContextMenuEnabled?: boolean): {
    borderColor: any;
    lineWidth: any;
    markerColor: any;
    lineColor: any;
    markerShape: any;
    lineStyle: any;
    'aria-label': string | undefined;
    datatip: any;
    source: any;
    text: any;
    actionable: "inherit" | "off";
    id: string;
};
/**
 * Transforms the corepack legend sections to the preact legend sections.
 * @param section The legend section
 * @param ariaLabelSuffix The suffix to add in the legend item aria-label.
 * @returns
 */
export declare function transformSection(dataSection: any, ariaLabelSuffix: string, sectionIndex: number, drilling?: 'on' | 'off'): {
    items: any;
    title: any;
    id: string;
};
/**
 * Checks if the given dataprovider is a treedataprovider.
 * @param dataprovider
 * @returns
 */
export declare function isTreeDataProvider(dataprovider: any): boolean;
/**
 * Returns the symbolWidth and symbolHeight for the preact legend.
 */
export declare const getDefaultSymbolDims: (symbolHeight: number, symbolWidth: number) => {
    width: undefined;
    height: undefined;
} | {
    width: number;
    height: number;
};
export declare function isLegendItemDrillable(drilling?: 'on' | 'off', itemDrilling?: 'on' | 'off' | 'inherit'): string;
