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
    exports.getPreactAxisProps = void 0;
    const getPreactAxisProps = (axisProps, styleDefaults) => {
        const newProps = {};
        const { tickLabel, ...rest } = axisProps;
        if (tickLabel?.converter) {
            if (Array.isArray(tickLabel.converter)) {
                newProps['format'] = [
                    (value) => tickLabel.converter[0]?.format?.(new Date(value).toISOString()),
                    (value) => tickLabel.converter[1]?.format?.(new Date(value).toISOString())
                ];
            }
            else {
                newProps['format'] = (value) => tickLabel.converter?.format?.(axisProps['timeAxisType'] ? new Date(value).toISOString() : value);
            }
        }
        newProps['isRendered'] = tickLabel?.rendered != 'off';
        newProps['style'] = tickLabel?.style;
        newProps['rotation'] = tickLabel?.rotation != 'none' ? 'autoRotate' : 'none';
        const isGroupSepRendered = styleDefaults?.['groupSeparators'].rendered !== 'off';
        return {
            tickLabel: newProps,
            ...rest,
            groupSeparators: {
                isRendered: isGroupSepRendered,
                color: styleDefaults?.['groupSeparators'].color
            }
        };
    };
    exports.getPreactAxisProps = getPreactAxisProps;
});
