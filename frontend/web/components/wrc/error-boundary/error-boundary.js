var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ojs/ojvcomponent", "preact", "wrc/resource/resource", "ojs/ojlogger", "css!wrc/error-boundary/error-boundary-styles.css"], function (require, exports, ojvcomponent_1, preact_1, resource_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ErrorBoundary = void 0;
    let ErrorBoundary = class ErrorBoundary extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.state = { error: null };
        }
        componentDidCatch(error, _errorInfo) {
            try {
                Logger.error((error === null || error === void 0 ? void 0 : error.stack) || (error === null || error === void 0 ? void 0 : error.message) || String(error));
            }
            catch (_a) {
                Logger.error(String(error));
            }
            this.setState({ error: error.message });
            const ctx = this.context;
            if (ctx.context && ctx.context.broadcastMessage) {
                ctx.context.broadcastMessage({
                    severity: 'error',
                    summary: error.name,
                    detail: error.message
                });
            }
        }
        render() {
            return this.props.children;
        }
    };
    exports.ErrorBoundary = ErrorBoundary;
    ErrorBoundary.contextType = resource_1.UserContext;
    exports.ErrorBoundary = ErrorBoundary = __decorate([
        (0, ojvcomponent_1.customElement)("wrc-error-boundary")
    ], ErrorBoundary);
});
//# sourceMappingURL=error-boundary.js.map