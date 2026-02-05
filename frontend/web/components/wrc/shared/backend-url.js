var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./global"], function (require, exports, global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBackendBase = getBackendBase;
    exports.buildUrl = buildUrl;
    function normalizeBase(base) {
        const t = base.trim();
        if (!t)
            return "";
        if (t === "/")
            return "/";
        return t.endsWith("/") ? t.slice(0, -1) : t;
    }
    function fromMeta() {
        var _a;
        try {
            const el = document.querySelector('meta[name="wrc-backend-url"]');
            const v = (_a = el === null || el === void 0 ? void 0 : el.content) === null || _a === void 0 ? void 0 : _a.trim();
            return v ? v : undefined;
        }
        catch (_b) {
            return undefined;
        }
    }
    function fromInlineJson() {
        try {
            const el = document.getElementById("wrc-config");
            if (!el)
                return undefined;
            const text = el.textContent || el.innerHTML || "";
            if (!text)
                return undefined;
            const parsed = JSON.parse(text);
            const v = parsed === null || parsed === void 0 ? void 0 : parsed.backendBaseUrl;
            return typeof v === "string" ? v : undefined;
        }
        catch (_a) {
            return undefined;
        }
    }
    function fromConfigJson() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield fetch("wrc-config.json", {
                    credentials: "same-origin",
                    cache: "no-cache",
                });
                if (res.status === 404)
                    return undefined;
                if (!res.ok)
                    return undefined;
                let data = undefined;
                const ct = ((_a = res.headers) === null || _a === void 0 ? void 0 : _a.get("content-type")) || "";
                if (ct.includes("application/json")) {
                    try {
                        data = yield res.json();
                    }
                    catch (_b) {
                        data = undefined;
                    }
                }
                else {
                    try {
                        const text = yield res.text();
                        data = text ? JSON.parse(text) : undefined;
                    }
                    catch (_c) {
                        data = undefined;
                    }
                }
                const v = data === null || data === void 0 ? void 0 : data.backendBaseUrl;
                return typeof v === "string" ? v : undefined;
            }
            catch (_d) {
                return undefined;
            }
        });
    }
    function fromEnv() {
        try {
            const env = process === null || process === void 0 ? void 0 : process.env;
            const v = env === null || env === void 0 ? void 0 : env.WRC_BACKEND_URL;
            return typeof v === "string" ? v : undefined;
        }
        catch (_a) {
            return undefined;
        }
    }
    function fromLocation() {
        try {
            const here = new URL(window.location.href);
            const dir = here.pathname.endsWith("/") ? here.pathname.slice(0, -1) : here.pathname.replace(/[^/]+$/, "");
            const joined = `${here.origin}${dir}`;
            return normalizeBase(joined);
        }
        catch (_a) {
            return "";
        }
    }
    let _resolvedBase;
    let _initPromise;
    function resolveOnce() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (_resolvedBase !== undefined)
                return _resolvedBase;
            const fromWindow = (_a = window === null || window === void 0 ? void 0 : window.WRC_CONFIG) === null || _a === void 0 ? void 0 : _a.backendBaseUrl;
            if (typeof fromWindow === "string" && fromWindow.trim()) {
                _resolvedBase = normalizeBase(fromWindow);
                return _resolvedBase;
            }
            const meta = fromMeta();
            if (meta) {
                _resolvedBase = normalizeBase(meta);
                return _resolvedBase;
            }
            const inlineJson = fromInlineJson();
            if (inlineJson) {
                _resolvedBase = normalizeBase(inlineJson);
                return _resolvedBase;
            }
            const cfg = yield fromConfigJson();
            if (cfg) {
                _resolvedBase = normalizeBase(cfg);
                return _resolvedBase;
            }
            const env = fromEnv();
            if (env) {
                _resolvedBase = normalizeBase(env);
                return _resolvedBase;
            }
            _resolvedBase = normalizeBase(fromLocation() || "");
            return _resolvedBase;
        });
    }
    function getBackendBase() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (_initPromise) {
                yield _initPromise;
                return _resolvedBase || "";
            }
            _initPromise = resolveOnce();
            try {
                yield _initPromise;
            }
            finally {
                _initPromise = undefined;
            }
            try {
                const gp = (_a = global_1.Global === null || global_1.Global === void 0 ? void 0 : global_1.Global.global) === null || _a === void 0 ? void 0 : _a.backendPrefix;
                if ((!_resolvedBase || _resolvedBase === "") && typeof gp === "string" && gp.trim()) {
                    _resolvedBase = normalizeBase(gp);
                }
            }
            catch (_b) {
            }
            const val = _resolvedBase || "";
            global_1.Global.global.backendPrefix = val;
            return val;
        });
    }
    function buildUrl(path, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let base = yield getBackendBase();
            try {
                const gp = (_a = global_1.Global === null || global_1.Global === void 0 ? void 0 : global_1.Global.global) === null || _a === void 0 ? void 0 : _a.backendPrefix;
                if (typeof gp === "string" && gp.trim()) {
                    base = normalizeBase(gp);
                }
            }
            catch (_b) {
            }
            const isAbs = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path);
            if (isAbs) {
                const u = new URL(path);
                return toRelativeIfSameOrigin(u);
            }
            const baseObj = base
                ? new URL(base, window.location.href)
                : new URL(window.location.origin + "/", window.location.href);
            let baseHref = baseObj.toString();
            if (!baseHref.endsWith("/"))
                baseHref += "/";
            const relPath = path.replace(/^\/+/, "");
            const u = new URL(relPath, baseHref);
            if (query) {
                for (const [k, v] of Object.entries(query)) {
                    if (v === undefined)
                        continue;
                    u.searchParams.set(k, String(v));
                }
            }
            return toRelativeIfSameOrigin(u);
        });
    }
    function toRelativeIfSameOrigin(u) {
        try {
            const sameOrigin = u.origin === window.location.origin;
            return sameOrigin ? u.pathname + u.search + u.hash : u.toString();
        }
        catch (_a) {
            return u.toString();
        }
    }
    void getBackendBase().catch(() => {
    });
});
//# sourceMappingURL=backend-url.js.map