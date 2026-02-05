define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.REFRESH_EVENT = void 0;
    exports.emitRefresh = emitRefresh;
    exports.subscribeToRefresh = subscribeToRefresh;
    exports.REFRESH_EVENT = "wrc:refresh";
    function emitRefresh(detail) {
        window.dispatchEvent(new CustomEvent(exports.REFRESH_EVENT, { detail: detail !== null && detail !== void 0 ? detail : {} }));
    }
    function subscribeToRefresh(callback) {
        const handler = (e) => {
            const detail = e.detail;
            callback(detail || {});
        };
        window.addEventListener(exports.REFRESH_EVENT, handler);
        return () => window.removeEventListener(exports.REFRESH_EVENT, handler);
    }
});
//# sourceMappingURL=refresh.js.map