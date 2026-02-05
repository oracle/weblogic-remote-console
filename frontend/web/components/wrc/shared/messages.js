define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSuccessful = isSuccessful;
    function isSuccessful(messageResponse) {
        if (!messageResponse)
            return false;
        const messages = messageResponse.messages || [];
        return !messages.some(m => ((m === null || m === void 0 ? void 0 : m.severity) || "").toUpperCase() === "ERROR");
    }
});
//# sourceMappingURL=messages.js.map