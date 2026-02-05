/* @oracle/oraclejet-preact: undefined */
'use strict';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Returns the angle in radians
 * @param angle The angle in degrees.
 * @returns The angle in radians.
 */
function toRad(angle) {
    return (angle * Math.PI) / 180;
}
/**
 * Returns equivalent angle between 0 and 360 (exclusive) corresponding to given angle.
 * @param angle The angle in degrees.
 * @returns Returns the posiive angle for a given angle.
 */
function getPositiveAngle(angle) {
    return (angle + 360) % 360;
}
/**
 * Returns the polar coordinate of point (x,y) relative to center (cx, cy)
 * @param cx The x coordinate of the center.
 * @param cy The y coordinate of the center.
 * @param x  The x coordinate of the point.
 * @param y  The y coordinate of the point.
 * @returns The polar coordinate of point (x,y) relative to center (cx, cy)
 */
function convertToPolar(cx, cy, x, y) {
    return {
        radius: Math.sqrt((x - cx) ** 2 + (y - cy) ** 2),
        angle: (Math.atan2(cy - y, x - cx) * 180) / Math.PI
    };
}
/**
 * Transforms the coordinate x, y in a unit square to the coordinates in given half sector. For eg, (0.5, 0.5) in full
 * unit square will be (0.5, 1) in top half and (0.5, 0) for bottom half.
 * @param x The x coordinate of the point.
 * @param y The y coordinate of the point.
 * @param sector The Sector to trasform
 * @returns The coordinate of point relative to center of the sector.
 */
function transformCoord(x, y, sector) {
    switch (sector) {
        case 'top':
            y = 2 * y;
            break;
        case 'bottom':
            y = 2 * y - 1;
            break;
        case 'left':
            x = 2 * x;
            break;
        case 'right':
            x = 2 * x - 1;
            break;
    }
    return { x, y };
}
/**
 * For a given angle and section, returns the relative coordinate of the point where the radius for
 * the angle intersects the bounding box.
 * @param angle The angle in degrees
 * @param section The section in which the meter circle lies.
 * @returns The relative coordinate of point of intersection of radius and bounding box.
 */
function getPolygonCoord(angle, section) {
    angle = getPositiveAngle(angle);
    let x, y;
    if (angle < 45) {
        y = 0.5 - 0.5 * Math.tan(toRad(angle));
        x = 1;
    }
    else if (angle < 135) {
        if (angle < 90) {
            x = 0.5 + 0.5 * Math.tan(toRad(90 - angle));
        }
        else {
            x = 0.5 - 0.5 * Math.tan(toRad(angle - 90));
        }
        y = 0;
    }
    else if (angle < 225) {
        if (angle < 180) {
            y = 0.5 - 0.5 * Math.tan(toRad(180 - angle));
        }
        else {
            y = 0.5 + 0.5 * Math.tan(toRad(angle - 180));
        }
        x = 0;
    }
    else if (angle < 315) {
        if (angle < 270) {
            x = 0.5 - 0.5 * Math.tan(toRad(270 - angle));
        }
        else {
            x = 0.5 + 0.5 * Math.tan(toRad(angle - 270));
        }
        y = 1;
    }
    else {
        x = 1;
        y = 0.5 + 0.5 * Math.tan(toRad(360 - angle));
    }
    return transformCoord(x, y, section);
}
/**
 * Returns the relative coordinate of the center of the half/full circle in which the meter circle lies.
 * @param sector The section in which the meter circle lies.
 * @returns The relative coordinate of the center.
 */
function getCenterCoord(sector) {
    return transformCoord(0.5, 0.5, sector);
}
/**
 * Returns whether the angle lies on top half of the circle
 * @param angle The angle in degrees
 * @returns Whether the angle lies on top half of the circle.
 */
function OnTopHalf(angle) {
    return angle <= 180;
}
/**
 * Returns whether the angle lies on right half of the circle
 * @param angle The angle in degrees
 * @returns Whether the angle lies on right half of the circle.
 */
function OnRightHalf(angle) {
    return angle <= 90 || angle >= 270;
}
/**
 * Returns whether the angle lies on left half of the circle
 * @param angle The angle in degrees
 * @returns Whether the angle lies on left half of the circle.
 */
function OnLeftHalf(angle) {
    return angle >= 90 && angle <= 270;
}
/**
 * Returns whether the angle lies on bottom half of the circle
 * @param angle The angle in degrees
 * @returns Whether the angle lies on bottom half of the circle.
 */
function OnBottomHalf(angle) {
    return angle >= 180 || angle === 0;
}
/**
 * Returns the Sector the meter circle lies on.
 * @param startAngle The start angle.
 * @param angleExtent The angle extent.
 * @param isRtl If the reading mode is rtl
 * @returns Which half the meter circle lies on.
 */
function getCircleSection(startAngle, angleExtent, isRtl) {
    if (angleExtent > 180) {
        return 'full';
    }
    const meanAngle = getPositiveAngle(startAngle + (isRtl ? 0.5 : -0.5) * angleExtent);
    const endAngle = getPositiveAngle(startAngle + (isRtl ? 1 : -1) * angleExtent);
    if (OnTopHalf(startAngle) && OnTopHalf(meanAngle) && OnTopHalf(endAngle)) {
        return 'top';
    }
    else if (OnRightHalf(startAngle) && OnRightHalf(meanAngle) && OnRightHalf(endAngle)) {
        return 'right';
    }
    else if (OnLeftHalf(startAngle) && OnLeftHalf(meanAngle) && OnLeftHalf(endAngle)) {
        return 'left';
    }
    else if (OnBottomHalf(startAngle) && OnBottomHalf(meanAngle) && OnBottomHalf(endAngle)) {
        return 'bottom';
    }
    return 'full';
}
/**
 * Returns the clip polygon for given startAngle and angleExtent.
 * @param startAngle The start angle of arc in degrees.
 * @param angleExtent The angle extent of arc in degrees.
 * @param isRtl  The reading mode of the document.
 * @param section The Sector circular meter lies on.
 * @returns The clippath for given startAngle and angleExtent
 */
function getClipPath(startAngle, angleExtent, isRtl, section) {
    let start = isRtl ? startAngle + angleExtent : startAngle;
    const firstVertexCoords = getPolygonCoord(start, section);
    let clipPath = `${firstVertexCoords.x * 100}% ${firstVertexCoords.y * 100}%`;
    let nextVertex, nextVertexCoords;
    do {
        nextVertex = Math.max(start - angleExtent, 45 * (Math.ceil(start / 45) - 1));
        nextVertexCoords = getPolygonCoord(nextVertex, section);
        clipPath += `, ${nextVertexCoords.x * 100}% ${nextVertexCoords.y * 100}%`;
        angleExtent = angleExtent - (start - nextVertex);
        start = nextVertex;
    } while (nextVertex > start - angleExtent);
    const centerVertex = getCenterCoord(section);
    // close the polygon with a vertex in center to get the radial clipping
    return `polygon(${clipPath}, ${centerVertex.x * 100}% ${centerVertex.y * 100}%)`;
}
/**
 * Returns the clip polygon for given percentage.
 * @param percentage The percentage of the circle the clipPath covers.
 * @returns The clippath for given percentage it covers
 */
function getProgressClipPath(percentage) {
    let tangent;
    if (percentage < 0.125) {
        tangent = _calculateTangent(percentage) + 50;
        return `polygon(50% 0, ${tangent}% 0, 50% 50%)`;
    }
    else if (percentage < 0.375) {
        if (percentage < 0.25) {
            tangent = 50 - _calculateTangent(0.25 - percentage);
        }
        else {
            tangent = _calculateTangent(percentage - 0.25) + 50;
        }
        return `polygon(50% 0, 100% 0, 100% ${tangent}%, 50% 50%)`;
    }
    else if (percentage < 0.625) {
        if (percentage < 0.5) {
            tangent = 50 + _calculateTangent(0.5 - percentage);
        }
        else {
            tangent = 50 - _calculateTangent(percentage - 0.5);
        }
        return `polygon(50% 0, 100% 0, 100% 100%, ${tangent}% 100%, 50% 50%)`;
    }
    else if (percentage < 0.875) {
        if (percentage < 0.75) {
            tangent = 50 + _calculateTangent(0.75 - percentage);
        }
        else {
            tangent = 50 - _calculateTangent(percentage - 0.75);
        }
        return `polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% ${tangent}%, 50% 50%)`;
    }
    tangent = 50 - _calculateTangent(1 - percentage);
    return `polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% 0%, ${tangent}% 0%, 50% 50%)`;
}
function _calculateTangent(percentage) {
    return 50 * Math.tan(percentage * 2 * Math.PI);
}

exports.convertToPolar = convertToPolar;
exports.getCenterCoord = getCenterCoord;
exports.getCircleSection = getCircleSection;
exports.getClipPath = getClipPath;
exports.getPositiveAngle = getPositiveAngle;
exports.getProgressClipPath = getProgressClipPath;
//# sourceMappingURL=circleUtils-4af93948.js.map
