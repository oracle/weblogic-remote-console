/**
 * @license
 * Copyright (c) 2019 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export type FormatterFunc<V> = (value: V) => string;
export type ParserFunc<V> = (value: string) => V;
export type FormatObj<V> = {
    format: FormatterFunc<V>;
};
export type ParseObj<V> = {
    parse: ParserFunc<V>;
};
export type FormatParseErrorOptions = {
    cause?: {
        code: string;
        parameterMap?: Record<string, string | number>;
    };
};
export declare class FormatParseError extends Error {
    readonly cause: FormatParseErrorOptions['cause'];
    constructor(message?: string, options?: FormatParseErrorOptions);
}
