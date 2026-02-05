/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type Validator = require('ojs/ojvalidator');
/**
 * A custom hook that combines multiple implicit validators to a single validator
 * for oj-c-input-date-picker. The returned combined validator will fail-fast. The
 * argument order will dictate the order in which the validators are executed.
 *
 * @param validators implicit validators
 * @returns a combined validator
 */
export declare const useCombinedImplicitValidators: <V>(...validators: (Validator<V> | undefined)[]) => Validator<V>;
