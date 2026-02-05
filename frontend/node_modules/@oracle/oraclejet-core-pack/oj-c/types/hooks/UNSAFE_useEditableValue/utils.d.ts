import type { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import type { ConverterError, ValidatorError } from 'ojs/ojvalidation-error';
import type Converter = require('ojs/ojconverter');
/**
 * Creates a component message for the provided error
 *
 * @param error The error object
 * @returns The component message for the error provided
 */
declare const createMessageFromError: (error: Error | ValidatorError | ConverterError) => ComponentMessageItem;
/**
 * Treats the value for `null` and replaces it with the provided defaultValue
 * or undefined.
 *
 * @param value The value that needs to be treated
 * @param defaultValue The value to used when the provided value is null
 * @returns the null treated value
 */
declare const treatNull: <T>(value?: T | null, defaultValue?: T) => T | undefined;
/**
 * Normalizes an empty string to null.
 * @param value
 * @returns null if the value is an empty string
 */
declare const normalizeValue: <T>(value?: T) => T | null | undefined;
/**
 * Shallow compares two arrays.
 *
 * @param a The first array
 * @param b The second array
 * @returns Result of the shallow compare
 */
declare const isShallowEqual: <T>(a: T[], b: T[]) => boolean;
/**
 * Return true if there are any messsages with "error" severity.
 * @param messages
 * @returns True if there are any messages with "error" severity
 */
declare const hasErrorMessages: (messages?: ComponentMessageItem[]) => boolean;
/**
 * If there is a converter and the converter's resolvedOptions have a virtualKeyboardHint
 * property, return the virtualKeyboardHint. Otherwise return 'text'.
 * @param converter
 * @returns The virtual keyboard hint from the converter or 'text'
 */
declare const getVirtualKeyboardHintFromConverter: <V>(converter?: Converter<V> | null) => any;
export { createMessageFromError, getVirtualKeyboardHintFromConverter, hasErrorMessages, isShallowEqual, normalizeValue, treatNull };
