/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "ojs/ojkeyset"], function (require, exports, ojkeyset_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEqual = exports.getFirstKey = exports.isEmpty = exports.keysToKeySet = exports.keySetToKeys = void 0;
    /**
     * Helper to convert Keyset (legacy) to Keys (preact).
     * @param keyset
     * @returns keys
     */
    const keySetToKeys = (keySet) => {
        if (!keySet) {
            return { all: false, keys: new Set() };
        }
        let keys = {};
        if (keySet.isAddAll()) {
            const deletedValues = new Set(keySet.deletedValues());
            keys = { all: true, deletedKeys: deletedValues };
        }
        else if (!keySet.isAddAll()) {
            const values = new Set(keySet.values());
            keys = { all: false, keys: values };
        }
        return keys;
    };
    exports.keySetToKeys = keySetToKeys;
    /**
     * Helper to convert Keys (preact) to ImmutableKeySet (core pack).
     * @param keys
     * @returns KeySet
     */
    const keysToKeySet = (keys) => {
        let keySet;
        if (keys.all) {
            keySet = new ojkeyset_1.AllKeySetImpl();
            keySet = keySet.delete(new Set(keys.deletedKeys.values()));
        }
        else if (!keys.all) {
            keySet = new ojkeyset_1.KeySetImpl(new Set(keys.keys.values()));
        }
        return keySet;
    };
    exports.keysToKeySet = keysToKeySet;
    const isEmpty = (keys) => {
        if (keys.all) {
            return false;
        }
        else {
            return keys.keys.size === 0;
        }
    };
    exports.isEmpty = isEmpty;
    const getFirstKey = (keys, data) => {
        if (keys.all === false && keys.keys.size > 0) {
            const [first] = keys.keys;
            return first;
        }
        else if (data.length > 0) {
            return data[0];
        }
        return null;
    };
    exports.getFirstKey = getFirstKey;
    const isEqual = (key1, key2) => {
        if (key1 === key2) {
            return true;
        }
        if (key1.keys.all !== key2.keys.all) {
            return false;
        }
        const arr1 = key1.keys.all === true
            ? Array.from(key1.keys.deletedKeys.values())
            : Array.from(key1.keys.keys.values());
        const arr2 = key2.keys.all === true
            ? Array.from(key2.keys.deletedKeys.values())
            : Array.from(key2.keys.keys.values());
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };
    exports.isEqual = isEqual;
});
