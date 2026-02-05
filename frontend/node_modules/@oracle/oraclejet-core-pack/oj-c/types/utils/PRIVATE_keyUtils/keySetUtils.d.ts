/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ImmutableKeySet } from 'ojs/ojkeyset';
import { Keys } from '@oracle/oraclejet-preact/utils/UNSAFE_keys';
/**
 * Helper to convert Keyset (legacy) to Keys (preact).
 * @param keyset
 * @returns keys
 */
export declare const keySetToKeys: <K>(keySet: ImmutableKeySet<K> | undefined) => Keys<K>;
/**
 * Helper to convert Keys (preact) to ImmutableKeySet (core pack).
 * @param keys
 * @returns KeySet
 */
export declare const keysToKeySet: <K>(keys: Keys<K>) => ImmutableKeySet<K>;
export declare const isEmpty: <K>(keys: Keys<K>) => boolean;
export declare const getFirstKey: <K, D>(keys: Keys<K>, data: D[]) => K | D | null;
export declare const isEqual: <K>(key1: ImmutableKeySet<K>, key2: ImmutableKeySet<K>) => boolean;
