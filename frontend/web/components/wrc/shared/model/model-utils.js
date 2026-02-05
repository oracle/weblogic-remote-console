define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractHelpData = void 0;
    exports.parseIfJson = parseIfJson;
    const extractHelpData = (everyField) => {
        return everyField.map((helpData) => {
            return {
                detailedHelpHTML: helpData.detailedHelpHTML,
                externalHelp: helpData.externalHelp,
                helpLabel: helpData.helpLabel,
                helpSummaryHTML: helpData.helpSummaryHTML
            };
        });
    };
    exports.extractHelpData = extractHelpData;
    function parseIfJson(input) {
        try {
            const parsed = JSON.parse(input);
            if (typeof parsed === "object" && parsed !== null) {
                return parsed;
            }
        }
        catch (_e) {
        }
        return input;
    }
});
//# sourceMappingURL=model-utils.js.map