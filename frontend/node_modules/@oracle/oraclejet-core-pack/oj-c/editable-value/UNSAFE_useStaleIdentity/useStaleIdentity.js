define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useStaleIdentity = useStaleIdentity;
    /**
     * A custom hook that helps with managing identities that would help determine
     * whether an async process has gone stale or not.
     *
     * @returns An object that includes various operation related to managing stale identity
     */
    function useStaleIdentity() {
        const staleIdentityMap = (0, hooks_1.useRef)(new Map());
        const setStaleIdentity = (0, hooks_1.useCallback)(
        /**
         * A function that creates a new stale identity
         *
         * @param id A unique identifier for this staleIdentity (should start with the name of the hook that uses this)
         * @returns an object with helpers that would help determine if this has gone stale
         */
        (id) => {
            const localStaleIdentity = Symbol();
            staleIdentityMap.current.set(id, localStaleIdentity);
            // return a function that checks for the local stale determine
            // if this has gone stale
            return {
                isStale: () => localStaleIdentity !== staleIdentityMap.current.get(id)
            };
        }, []);
        // setStaleIdentity is guaranteed to be the same across rerenders
        return { setStaleIdentity };
    }
});
