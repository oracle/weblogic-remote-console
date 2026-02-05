/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCombinedImplicitValidators = void 0;
    /**
     * A custom hook that combines multiple implicit validators to a single validator
     * for oj-c-input-date-picker. The returned combined validator will fail-fast. The
     * argument order will dictate the order in which the validators are executed.
     *
     * @param validators implicit validators
     * @returns a combined validator
     */
    const useCombinedImplicitValidators = (...validators) => (0, hooks_1.useMemo)(() => ({
        validate(value) {
            for (const validator of validators) {
                validator?.validate(value);
            }
        }
    }), 
    // eslint-disable-next-line
    [...validators]);
    exports.useCombinedImplicitValidators = useCombinedImplicitValidators;
});
