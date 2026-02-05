/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLegendEventsHandler = void 0;
    const getLegendEventsHandler = (isHideShowOn, isHighlightOn, updateHidden, updateHighlighted, getDrillDetail, drilling = 'off', getItemDrilling, onOjDrill) => {
        const itemActionHandler = (detail) => {
            // Preact supports id as number or string while corepack processes ids into strings. see transformItem and transformSection in utils.ts
            if (typeof detail.itemId === 'string' && isHideShowOn) {
                updateHidden(detail.itemId);
            }
            const [sectionIdx, itemIdx] = (0, utils_1.parseItemIdx)(detail.itemId); //note: Corepack legend processes ids into strings
            if ((0, utils_1.isLegendItemDrillable)(drilling, getItemDrilling(itemIdx, sectionIdx)) !== 'off') {
                onOjDrill?.({ id: getDrillDetail([sectionIdx, itemIdx]) });
            }
        };
        const inputHandler = (detail) => {
            // Preact supports id as number or string while corepack processes ids into strings. see transformItem and transformSection in utils.ts
            if (typeof detail.itemId === 'string' && isHighlightOn) {
                updateHighlighted(detail.itemId);
            }
        };
        return {
            itemActionHandler,
            inputHandler
        };
    };
    exports.getLegendEventsHandler = getLegendEventsHandler;
});
