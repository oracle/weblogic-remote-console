/* @oracle/oraclejet-preact: undefined */
/**
 * @license
 * Copyright (c) 2019 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
// Type of error thrown during format or parse.
class FormatParseError extends Error {
    constructor(message, options) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, FormatParseError.prototype);
        this.cause = options?.cause;
    }
}

export { FormatParseError as F };
//# sourceMappingURL=types-ad8fe56f.js.map
