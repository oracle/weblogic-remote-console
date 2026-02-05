var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./transport"], function (require, exports, transport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor(rdj, pdj) {
            this.canSaveToCart = true;
            this.canSaveNow = false;
            this.canDownload = false;
            this.canSupportTokens = false;
            this.pollingDisabled = false;
            this.pollingRunning = false;
            this.rdj = rdj;
            this.pdj = pdj;
        }
        getActions() {
            var _a, _b;
            return (_b = (_a = this.pdj) === null || _a === void 0 ? void 0 : _a.sliceForm) === null || _b === void 0 ? void 0 : _b.actions;
        }
        invokeAction(action, references) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const url = ((_d = (_c = (_b = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.actions) === null || _b === void 0 ? void 0 : _b[action.name]) === null || _c === void 0 ? void 0 : _c.invoker) === null || _d === void 0 ? void 0 : _d.resourceData) ||
                ((_h = (_g = (_f = (_e = this.rdj) === null || _e === void 0 ? void 0 : _e.actions) === null || _f === void 0 ? void 0 : _f[action.name]) === null || _g === void 0 ? void 0 : _g.inputForm) === null || _h === void 0 ? void 0 : _h.resourceData) ||
                this.rdjUrl;
            return (0, transport_1.doAction)(url, action, references);
        }
        invokeActionInputAction(changes, rows, files) {
            var _a, _b, _c;
            if (!((_a = this.rdj) === null || _a === void 0 ? void 0 : _a.invoker)) {
                throw new Error("No invoker defined for ActionInputForm");
            }
            return (0, transport_1.doActionInput)(((_c = (_b = this.rdj) === null || _b === void 0 ? void 0 : _b.invoker) === null || _c === void 0 ? void 0 : _c.resourceData) || '', changes, rows, files);
        }
        getActionFormInput(action) {
            var _a, _b, _c, _d;
            return (_d = (_c = (_b = (_a = this.rdj) === null || _a === void 0 ? void 0 : _a.actions) === null || _b === void 0 ? void 0 : _b[action.name]) === null || _c === void 0 ? void 0 : _c.inputForm) === null || _d === void 0 ? void 0 : _d.resourceData;
        }
        getBreadcrumbs() {
            var _a, _b;
            const crumbs = [];
            if (Array.isArray((_a = this.rdj) === null || _a === void 0 ? void 0 : _a.breadCrumbs))
                crumbs.push(...this.rdj.breadCrumbs);
            if ((_b = this.rdj) === null || _b === void 0 ? void 0 : _b.self)
                crumbs.push(this.rdj.self);
            return crumbs;
        }
        getLinks() {
            var _a;
            return (((_a = this.rdj) === null || _a === void 0 ? void 0 : _a.links) || []);
        }
        refresh() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        isPolling() {
            return this.pollingRunning;
        }
        startPolling(pollingState, callback) {
            let attempts = 0;
            const timerFunc = () => {
                if (this.pollingDisabled)
                    return;
                this.refresh().then(() => {
                    attempts++;
                    if (attempts < pollingState.maxAttempts) {
                        window.setTimeout(timerFunc, pollingState.reloadSeconds * 1000);
                    }
                    else {
                        this.pollingRunning = false;
                    }
                    callback();
                });
            };
            this.pollingRunning = true;
            this.pollingDisabled = false;
            window.setTimeout(timerFunc, pollingState.reloadSeconds * 1000);
        }
        stopPolling() {
            this.pollingRunning = false;
            this.pollingDisabled = true;
        }
        getPageTitle() {
            var _a, _b, _c;
            return ((_a = this.pdj) === null || _a === void 0 ? void 0 : _a.helpPageTitle) || ((_c = (_b = this.rdj) === null || _b === void 0 ? void 0 : _b.self) === null || _c === void 0 ? void 0 : _c.label);
        }
    }
    exports.Model = Model;
});
//# sourceMappingURL=common.js.map