/* @oracle/oraclejet-preact: undefined */
/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Clones the given dimension.
 */
function cloneDimension(dims) {
    return {
        x: dims.x,
        y: dims.y,
        height: dims.height,
        width: dims.width
    };
}
function getSectionDims(availSpace, position, width, height) {
    if (position === 'left') {
        return {
            x: availSpace.x,
            width: height,
            height: width,
            y: availSpace.y
        };
    }
    else if (position === 'top') {
        return {
            x: availSpace.x,
            width: width,
            height: height,
            y: availSpace.y
        };
    }
    else if (position === 'bottom') {
        return {
            x: availSpace.x,
            y: availSpace.y + availSpace.height - height,
            height: height,
            width: width
        };
    }
    else {
        return {
            x: availSpace.x + availSpace.width - height,
            y: availSpace.y,
            width: height,
            height: width
        };
    }
}

export { cloneDimension as c, getSectionDims as g };
//# sourceMappingURL=dimensionUtils-6d5dac30.js.map
