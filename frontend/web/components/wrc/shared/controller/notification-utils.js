define(["require", "exports", "ojs/ojhtmlutils"], function (require, exports, HtmlUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.broadcastMessageResponse = exports.broadcastErrorMessage = void 0;
    const broadcastErrorMessage = (ctx, err) => {
        if ((ctx === null || ctx === void 0 ? void 0 : ctx.context) && ctx.context.broadcastMessage) {
            ctx.context.broadcastMessage({
                severity: "error",
                summary: err.name,
                detail: err.message,
            });
        }
    };
    exports.broadcastErrorMessage = broadcastErrorMessage;
    const broadcastMessageResponse = (ctx, messageResponse) => {
        var _a, _b;
        if ((messageResponse === null || messageResponse === void 0 ? void 0 : messageResponse.messages) && (ctx === null || ctx === void 0 ? void 0 : ctx.context) && ctx.context.broadcastMessage) {
            const overallSeverity = ((_a = messageResponse.messages.find((message) => message.severity)) === null || _a === void 0 ? void 0 : _a.severity) ||
                "info";
            const html = "<ul>" +
                messageResponse.messages.map((message) => "<li>" + (message.detail || message.message) + "</li>");
            ("</ul>");
            const untypedBroadcastMessageFunc = (_b = ctx.context) === null || _b === void 0 ? void 0 : _b.broadcastMessage;
            untypedBroadcastMessageFunc({
                html: { view: HtmlUtils.stringToNodeArray(html), string: html },
                severity: overallSeverity.toLowerCase(),
            });
        }
    };
    exports.broadcastMessageResponse = broadcastMessageResponse;
});
//# sourceMappingURL=notification-utils.js.map