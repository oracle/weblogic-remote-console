/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "../legend-item/legend-item", "../legend-section/legend-section"], function (require, exports, legend_item_1, legend_section_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDefaultSymbolDims = void 0;
    exports.getTextStyles = getTextStyles;
    exports.getSectionStyles = getSectionStyles;
    exports.isLegendInteractive = isLegendInteractive;
    exports.parseItemIdx = parseItemIdx;
    exports.transformItem = transformItem;
    exports.transformSection = transformSection;
    exports.isTreeDataProvider = isTreeDataProvider;
    exports.isLegendItemDrillable = isLegendItemDrillable;
    /**
     * Returns the text styles for linear and sectional legend.
     */
    function getTextStyles(styles) {
        return {
            textFontStyle: styles?.fontStyle,
            textFontSize: styles?.fontSize,
            textFontColor: styles?.color,
            textFontWeight: styles?.fontWeight,
            textDecoration: styles?.textDecoration,
            textFontFamily: styles?.fontFamily
        };
    }
    /**
     * Return the styles for the sectional legend titles.
     */
    function getSectionStyles(styles) {
        return {
            sectionTitleColor: styles?.color,
            sectionTitleFontFamily: styles?.fontFamily,
            sectionTitleFontSize: styles?.fontSize,
            sectionTitleFontStyle: styles?.fontStyle,
            sectionTitleFontWeight: styles?.fontWeight,
            sectionTitleTextDecoration: styles?.textDecoration
        };
    }
    /**
     * Checks if the legend is interactive.
     */
    function isLegendInteractive(drilling, hideAndShowBehavior, hoverBehavior, hasDrillableItem, isContextMenuEnabled) {
        return (drilling === 'on' ||
            hideAndShowBehavior === 'on' ||
            hoverBehavior === 'dim' ||
            hasDrillableItem ||
            isContextMenuEnabled);
    }
    /**
     * Parses preact id to corepack id.
     */
    function parseItemIdx(id) {
        return id.split(';').map((i) => parseInt(i, 10));
    }
    /**
     * Transforms the corepack legend item to preact legend item.
     * @param item The legend item
     * @param ariaLabelSuffix The suffix to add in the legend item aria label.
     * @returns
     */
    function transformItem(dataItem, sectionIndex, itemIndex, ariaLabelSuffix, drilling, hideAndShowBehavior, isContextMenuEnabled) {
        const item = { ...legend_item_1.LegendItemDefaults, ...dataItem };
        return {
            borderColor: item.borderColor,
            lineWidth: item.lineWidth,
            markerColor: item.markerColor || item.color || undefined, // preact default
            lineColor: item.color || undefined,
            markerShape: item.symbolType !== 'line' ? item.markerShape : 'none',
            lineStyle: item.symbolType !== 'marker' ? item.lineStyle : 'none',
            'aria-label': [item.shortDesc, ariaLabelSuffix].filter(Boolean).join(' ') || undefined,
            datatip: item.shortDesc,
            source: item.source,
            text: item.text,
            actionable: hideAndShowBehavior === 'on' || isContextMenuEnabled
                ? 'inherit'
                : isLegendItemDrillable(drilling, item.drilling),
            // ignore corepack ids as it can be string, int, even [undefined] depending on
            // dataprovider keyAttributes, childAttribute. Instead, we create simple string ids for preact.
            id: `${sectionIndex};${itemIndex}`
        };
    }
    /**
     * Transforms the corepack legend sections to the preact legend sections.
     * @param section The legend section
     * @param ariaLabelSuffix The suffix to add in the legend item aria-label.
     * @returns
     */
    function transformSection(dataSection, ariaLabelSuffix, sectionIndex, drilling) {
        const section = { ...legend_section_1.LegendSectionDefaults, ...dataSection };
        return {
            items: section.items.map((item, itemIndex) => transformItem(item, sectionIndex, itemIndex, ariaLabelSuffix, drilling)),
            title: section.text || section.title,
            id: `${sectionIndex}`
        };
    }
    /**
     * Checks if the given dataprovider is a treedataprovider.
     * @param dataprovider
     * @returns
     */
    function isTreeDataProvider(dataprovider) {
        if (dataprovider && dataprovider['getChildDataProvider']) {
            return true;
        }
        return false;
    }
    /**
     * Returns the symbolWidth and symbolHeight for the preact legend.
     */
    const getDefaultSymbolDims = (symbolHeight, symbolWidth) => {
        // if both are zero, default to preact dims
        if (!symbolHeight && !symbolWidth) {
            return { width: undefined, height: undefined };
        }
        if (!symbolHeight) {
            return { width: symbolWidth, height: symbolWidth };
        }
        if (!symbolWidth) {
            return { width: symbolHeight, height: symbolHeight };
        }
        return { width: symbolWidth, height: symbolHeight };
    };
    exports.getDefaultSymbolDims = getDefaultSymbolDims;
    function isLegendItemDrillable(drilling, itemDrilling) {
        let actionable = 'inherit';
        if (itemDrilling === 'on') {
            return actionable;
        }
        else if (itemDrilling === 'off') {
            actionable = 'off';
        }
        else {
            if (drilling === 'on') {
                actionable = 'inherit';
            }
            else if (drilling === 'off') {
                actionable = 'off';
            }
        }
        return actionable;
    }
});
