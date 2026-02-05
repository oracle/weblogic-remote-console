/**
 * A custom hook that helps with managing identities that would help determine
 * whether an async process has gone stale or not.
 *
 * @returns An object that includes various operation related to managing stale identity
 */
export declare function useStaleIdentity(): {
    setStaleIdentity: (id: `use${string}`) => {
        isStale: () => boolean;
    };
};
