/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip"], function (require, exports, UNSAFE_useTooltip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useTooltip = void 0;
    /**
     * A hook with Redwood tooltip implementation.
     * Returns event handlers that can enhance the target element with a tooltip displayed
     * on hover and focus.
     *
     * @param text tooltip text
     * @param isDisabled determines if the tooltip is disabled
     * @returns an object with the 'tooltipContent' and 'tooltipProps' properties.
     */
    const useTooltip = ({ text, isDisabled = false }) => {
        const disabled = isDisabled || !text;
        const { tooltipContent, tooltipProps } = (0, UNSAFE_useTooltip_1.useTooltip)({
            isDisabled: disabled,
            text,
            position: 'top'
        });
        return {
            tooltipContent,
            tooltipProps
        };
    };
    exports.useTooltip = useTooltip;
});
