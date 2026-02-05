var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../global", "wrc/integration/databus-accessor", "../refresh", "./model-utils", "../backend-url", "ojs/ojlogger"], function (require, exports, global_1, databus_accessor_1, refresh_1, model_utils_1, backend_url_1, Logger) {
    "use strict";
    var _a, _b, _c, _d;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stopStatusPolling = exports.startStatusPolling = exports.fetchServerStatus = exports.getDataComponent = exports.getDataComponentText = exports.getData = exports.doActionInput = exports.doAction = exports.doUpdate = exports._post = exports.fixOrigin = void 0;
    const _statusDataReporter = (response) => __awaiter(void 0, void 0, void 0, function* () {
        let clonedResponse;
        try {
            if (typeof (response === null || response === void 0 ? void 0 : response.clone) === "function") {
                clonedResponse = response.clone();
            }
        }
        catch (_e) {
            clonedResponse = undefined;
        }
        if (clonedResponse) {
            try {
                const responseWithStatusData = (yield clonedResponse.json());
                const bus = (0, databus_accessor_1.tryGetDatabus)();
                if ((responseWithStatusData === null || responseWithStatusData === void 0 ? void 0 : responseWithStatusData.statusData) && bus) {
                    bus.get().dispatch(responseWithStatusData.statusData);
                }
            }
            catch (_e) {
            }
        }
        return response;
    });
    const fixOrigin = (url) => {
        const backendPrefix = global_1.Global.global.backendPrefix;
        if (backendPrefix) {
            try {
                const parsedUrl = new URL(url, window.location.href);
                url = new URL(backendPrefix + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash).href;
            }
            catch (e) {
                if (e instanceof Error) {
                    Logger.error(e.message);
                }
                try {
                    Logger.error(JSON.stringify(e));
                }
                catch (_a) {
                    Logger.error(String(e));
                }
            }
        }
        return url;
    };
    exports.fixOrigin = fixOrigin;
    const _post = (url, body) => __awaiter(void 0, void 0, void 0, function* () {
        const headersTemplate = {
            Accept: "application/json",
            "Unique-Id": global_1.Global.global.unique || "",
        };
        const headers = new Headers(headersTemplate);
        if (!(body instanceof FormData)) {
            headers.append("Content-Type", "application/json");
        }
        const target = yield (0, backend_url_1.buildUrl)(url);
        return fetch(target, {
            method: "POST",
            credentials: "include",
            headers,
            body,
        })
            .then(_statusDataReporter);
    });
    exports._post = _post;
    const _delete = (url) => __awaiter(void 0, void 0, void 0, function* () {
        const headersTemplate = {
            Accept: "application/json",
            "Unique-Id": global_1.Global.global.unique || "",
        };
        const headers = new Headers(headersTemplate);
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify({});
        const target = yield (0, backend_url_1.buildUrl)(url);
        return fetch(target, {
            method: "DELETE",
            credentials: "include",
            headers,
            body,
        })
            .then(_statusDataReporter)
            .then((response) => {
            (0, refresh_1.emitRefresh)({ scope: { content: false, navtree: true } });
            return response;
        });
    });
    const _buildBodyWithOptionalFiles = (payload, files) => {
        if (files && Object.keys(files).length > 0) {
            const form = new FormData();
            const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
            form.append("requestBody", blob);
            for (const key of Object.keys(files)) {
                form.append(key, files[key]);
            }
            return form;
        }
        return JSON.stringify(payload);
    };
    const doUpdate = (rdjUrl, changes, files) => __awaiter(void 0, void 0, void 0, function* () {
        const body = _buildBodyWithOptionalFiles({ data: changes }, files);
        return (0, exports._post)(rdjUrl, body);
    });
    exports.doUpdate = doUpdate;
    const doAction = (actionUrl_1, action_1, ...args_1) => __awaiter(void 0, [actionUrl_1, action_1, ...args_1], void 0, function* (actionUrl, action, references = [], payloadOverride) {
        const urlObject = new URL(actionUrl, window.origin);
        const searchParams = new URLSearchParams(urlObject.search);
        if (!searchParams.has("action") && action) {
            searchParams.set("action", action.name);
            urlObject.search = searchParams.toString();
            actionUrl = urlObject.pathname + urlObject.search + urlObject.hash;
        }
        actionUrl = urlObject.pathname + urlObject.search + urlObject.hash;
        let values;
        if (references && references.length > 0 && typeof references[0] === "string")
            values = references.map((r) => {
                return { value: (0, model_utils_1.parseIfJson)(r) };
            });
        else
            values = references.map((r) => {
                return { value: { resourceData: r.resourceData } };
            });
        const payload = values.length > 0 ? { rows: { value: values } } : {};
        if ((action === null || action === void 0 ? void 0 : action.name) === "__DELETE") {
            let chainedDeletes;
            values.forEach((value) => {
                const deleteFunc = () => {
                    const url = value.value.resourceData;
                    if (url) {
                        return _delete(urlObject.origin + url);
                    }
                    else {
                        throw Error("missing resourceData");
                    }
                };
                if (chainedDeletes) {
                    chainedDeletes.then(deleteFunc);
                }
                else {
                    chainedDeletes = deleteFunc();
                }
            });
            if (!chainedDeletes) {
                throw new Error("nothing to delete");
            }
            return chainedDeletes;
        }
        if (payloadOverride !== undefined) {
            return (0, exports._post)(actionUrl, JSON.stringify(payloadOverride));
        }
        return (0, exports._post)(actionUrl, JSON.stringify(payload));
    });
    exports.doAction = doAction;
    const doActionInput = (url, changes, rows, files) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            data: changes,
        };
        if (rows)
            payload.rows = rows;
        const body = _buildBodyWithOptionalFiles(payload, files);
        return (0, exports._post)(url, body);
    });
    exports.doActionInput = doActionInput;
    const getData = (rdjUrl, pdjUrl, context) => __awaiter(void 0, void 0, void 0, function* () {
        if (rdjUrl.startsWith("file://")) {
            const fs = require("fs");
            const rdjData = JSON.parse(fs.readFileSync(new URL(rdjUrl), { encoding: "utf-8" }));
            let pdjData = rdjData.inlinePageDescription;
            if (pdjUrl) {
                pdjData = JSON.parse(fs.readFileSync(new URL(pdjUrl), { encoding: "utf-8" }));
            }
            return [rdjData, pdjData];
        }
        else {
            const rdjData = (yield (0, exports.getDataComponent)(rdjUrl, context));
            let pdjData = rdjData.inlinePageDescription;
            if (!pdjData && !pdjUrl) {
                pdjUrl = rdjData.pageDescription;
            }
            if (pdjUrl) {
                pdjData = (yield (0, exports.getDataComponent)(pdjUrl, context));
            }
            return [rdjData, pdjData];
        }
    });
    exports.getData = getData;
    const getDataComponentRaw = (url, context) => __awaiter(void 0, void 0, void 0, function* () {
        const headers = new Headers();
        headers.append("Unique-Id", global_1.Global.global.unique || "");
        let fixedUrl = yield (0, backend_url_1.buildUrl)(url);
        if (context) {
            const urlObject = new URL(fixedUrl, window.location.href);
            urlObject.searchParams.append("context", context);
            fixedUrl = urlObject.pathname + urlObject.search + urlObject.hash;
        }
        const res = yield fetch(fixedUrl, {
            credentials: "include",
            headers,
        }).then(_statusDataReporter);
        if (!res.ok) {
            let bodyText;
            try {
                bodyText = yield res.text();
            }
            catch (_e) {
                bodyText = undefined;
            }
            const err = new Error(`HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""} when fetching ${fixedUrl}`);
            err.status = res.status;
            if (bodyText)
                err.body = bodyText;
            throw err;
        }
        return res;
    });
    const getDataComponentText = (url, context) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield getDataComponentRaw(url, context)).text();
    });
    exports.getDataComponentText = getDataComponentText;
    const getDataComponent = (url, context) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield getDataComponentRaw(url, context)).json();
    });
    exports.getDataComponent = getDataComponent;
    const STATUS_URL = "/api/-current-/status";
    let _statusTimer;
    const fetchServerStatus = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const headers = new Headers();
            headers.append("Unique-Id", global_1.Global.global.unique || "");
            const target = yield (0, backend_url_1.buildUrl)(STATUS_URL);
            const res = yield fetch(target, {
                credentials: "include",
                headers,
            }).then(_statusDataReporter);
            return res;
        }
        catch (_e) {
        }
    });
    exports.fetchServerStatus = fetchServerStatus;
    const startStatusPolling = (intervalMs = 15000) => {
        (0, exports.stopStatusPolling)();
        (0, exports.fetchServerStatus)();
        _statusTimer = setInterval(exports.fetchServerStatus, intervalMs);
    };
    exports.startStatusPolling = startStatusPolling;
    const stopStatusPolling = () => {
        if (_statusTimer) {
            clearInterval(_statusTimer);
            _statusTimer = undefined;
        }
    };
    exports.stopStatusPolling = stopStatusPolling;
    const _isTestEnv = !!((_b = (_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.process) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.JEST_WORKER_ID) ||
        ((_d = (_c = globalThis === null || globalThis === void 0 ? void 0 : globalThis.process) === null || _c === void 0 ? void 0 : _c.env) === null || _d === void 0 ? void 0 : _d.NODE_ENV) === "test";
    if (typeof window !== "undefined" && !_isTestEnv) {
        try {
            (0, exports.startStatusPolling)();
        }
        catch (_e) {
        }
    }
});
//# sourceMappingURL=transport.js.map