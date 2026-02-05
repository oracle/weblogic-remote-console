define(["require", "exports", "preact/hooks", "../utils/utils"], function (require, exports, hooks_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCache = useCache;
    /**
     * A custom hook to cache individual properties in an object.
     */
    function useCache() {
        const cache = (0, hooks_1.useRef)(new Map());
        return (0, hooks_1.useCallback)((key, value, deps) => {
            // If the deps changed for the key, then update the cache and return the new value
            if (isChanged(cache.current, key, deps)) {
                cache.current.set(key, { value, deps });
                return value;
            }
            // otherwise return the value from the cache
            return cache.current.get(key).value;
        }, []);
    }
    const isChanged = (cache, key, deps) => {
        // if not found in cache, then we consider that as changed
        if (!cache.has(key))
            return true;
        // if found in cache, then check the deps
        const oldDeps = cache.get(key).deps;
        return (oldDeps.length !== deps.length || oldDeps.some((value, index) => !isEquals(value, deps[index])));
    };
    const isEquals = (value1, value2) => {
        if (value1 === value2)
            return true;
        // For time being we only care about Set and in the future we can add
        // support for more types.
        if (value1 instanceof Set && value2 instanceof Set) {
            return (0, utils_1.isSetEqual)(value1, value2);
        }
        // fallback to ===
        return value1 === value2;
    };
});
