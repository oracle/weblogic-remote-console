/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPlotArea = getPlotArea;
    function getPlotArea(plotArea, yMajorTick, yMinorTick, xMajorTick, y2MajorTick, y2MinorTick) {
        return {
            color: plotArea?.backgroundColor,
            yMajorTick: yMajorTick?.rendered
                ? { isRendered: yMajorTick?.rendered !== 'off', ...yMajorTick }
                : yMajorTick,
            yMinorTick: yMinorTick?.rendered
                ? { isRendered: yMinorTick?.rendered && yMinorTick?.rendered !== 'off', ...yMinorTick }
                : yMinorTick,
            y2MajorTick: y2MajorTick?.rendered
                ? { isRendered: y2MajorTick?.rendered !== 'off', ...y2MajorTick }
                : y2MajorTick,
            y2MinorTick: y2MinorTick?.rendered
                ? { isRendered: y2MinorTick?.rendered && y2MinorTick?.rendered !== 'off', ...y2MinorTick }
                : y2MinorTick,
            xMajorTick: xMajorTick?.rendered
                ? { isRendered: xMajorTick?.rendered && xMajorTick?.rendered !== 'off', ...xMajorTick }
                : xMajorTick
        };
    }
});
