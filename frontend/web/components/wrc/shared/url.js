var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
define(["require", "exports", "preact/jsx-runtime", "./global"], function (require, exports, jsx_runtime_1, global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assetUrl = assetUrl;
    exports.AssetImg = AssetImg;
    exports.resolveAsset = resolveAsset;
    exports.requireAsset = requireAsset;
    exports.RequireImg = RequireImg;
    function isAbsoluteLike(url) {
        return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
    }
    function withTrailingSlash(href) {
        return href.endsWith("/") ? href : href + "/";
    }
    function getAppBaseHref() {
        const bp = global_1.Global.global.backendPrefix;
        try {
            if (bp) {
                const u = new URL(bp, window.location.href);
                return withTrailingSlash(u.href);
            }
        }
        catch (_a) {
        }
        try {
            const here = new URL(window.location.href);
            const dir = here.pathname.endsWith("/")
                ? here.pathname
                : here.pathname.replace(/[^/]+$/, "");
            const normalized = withTrailingSlash(`${here.origin}${dir}`);
            return normalized;
        }
        catch (_b) {
            return "/";
        }
    }
    function assetUrl(path) {
        if (!path)
            return path;
        if (isAbsoluteLike(path))
            return path;
        const base = getAppBaseHref();
        const relative = path.startsWith("/") ? path.slice(1) : path;
        try {
            return new URL(relative, base).toString();
        }
        catch (_a) {
            return base + relative;
        }
    }
    function AssetImg(props) {
        const { src } = props, rest = __rest(props, ["src"]);
        const resolved = assetUrl(src);
        return (0, jsx_runtime_1.jsx)("img", Object.assign({ src: resolved }, rest));
    }
    function resolveAsset(src) {
        return assetUrl(src);
    }
    function requireAsset(path) {
        try {
            const req = typeof require !== "undefined" ? require : undefined;
            if (req && typeof req.toUrl === "function") {
                const rel = path.startsWith("/") ? path.slice(1) : path;
                return req.toUrl(rel);
            }
        }
        catch (_a) {
        }
        return assetUrl(path);
    }
    function RequireImg(props) {
        const { src } = props, rest = __rest(props, ["src"]);
        const resolved = requireAsset(src);
        return (0, jsx_runtime_1.jsx)("img", Object.assign({ src: resolved }, rest));
    }
});
//# sourceMappingURL=url.js.map