define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.format = format;
    exports.parse = parse;
    /**
     * Parses the raw value from the UI to the internal value of the component
     * using the converter provided.
     * @param displayValue The raw value from the UI that needs to be parsed
     * @param converter The converter to be used for parsing
     * @param translateConverterParseError Function used to replace the converter error with a user-friendly message.
     * @returns The result of the conversion
     */
    function parse(displayValue, converter, translateConverterParseError) {
        if (displayValue === undefined) {
            // If displayValue is undefined, return null as the value.
            return { result: 'success', value: null };
        }
        if (shouldSkipParse(displayValue)) {
            // If displayValue is '' or null, we don't parse it.
            return { result: 'success', value: displayValue };
        }
        try {
            return {
                result: 'success',
                value: converter.parse(displayValue)
            };
        }
        catch (error) {
            // Replace converter error with a user friendly error if needed.
            const message = translateConverterParseError?.(error) ?? (0, utils_1.createMessageFromError)(error);
            return {
                result: 'failure',
                error: message
            };
        }
    }
    /**
     * Formats the component value to a display value that will be shown in the UI
     * @param value The component value to be formatted to show in the UI
     * @param defaultValue The default value that needs to be shown in some cases
     * @param converter The converter to be used for formatting
     * @returns The result of the conversion
     */
    function format(value, defaultValue, converter) {
        if (shouldSkipFormat(value)) {
            return { result: 'success', value: defaultValue };
        }
        try {
            return {
                result: 'success',
                value: converter.format(value)
            };
        }
        catch (error) {
            return {
                result: 'failure',
                error: (0, utils_1.createMessageFromError)(error)
            };
        }
    }
    /**
     * Determines if the converter's parse should be skipped for this value.
     * parse gets called to parse the user's input.
     * If the user clears the field, the displayed value is '', and we want to push null to the value, not ''.
     * The component code may normalize the value from '' to null before calling parse, so we also skip for null.
     * See useEditable#normalizeAndParseValue.
     *
     * @param value The value to be tested
     * @returns boolean result
     */
    function shouldSkipParse(value) {
        return value === '' || value === null;
    }
    /**
     * Determines if the converter's format should be skipped for this value.
     * format gets called to format the component's model value to display to the user.
     * As per the most strict converter contract we could have,
     *   format(value:V) : {string}
     *   parse(value:string) : {(V)}
     * format will not expect null, so if model value is null, we skip calling the converter's format.
     * We do not skip formatting ''. If the model value is '', and the converter does not allow to format strings, the
     * converter will throw an error.
     *
     * @param value The value to be tested
     * @returns boolean result
     */
    function shouldSkipFormat(value) {
        return value === null;
    }
});
