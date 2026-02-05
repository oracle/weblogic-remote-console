/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export declare const ZOOM_INCREMENT = 0.05;
export declare const zoom: (nextZoom: number, zoom: number, minZoom: number, maxZoom: number, onZoomChange?: (detail: {
    zoomValue: number;
}) => void) => void;
