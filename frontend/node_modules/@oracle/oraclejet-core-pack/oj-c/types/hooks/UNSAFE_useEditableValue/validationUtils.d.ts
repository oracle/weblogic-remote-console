import { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import { SelectionRangeValidatorError } from 'oj-c/editable-value/UNSAFE_useSelectionRangeValidator/SelectionRangeValidatorError';
import type AsyncValidator = require('ojs/ojvalidator-async');
import type Validator = require('ojs/ojvalidator');
type ValidationSuccess = {
    result: 'success';
};
type ValidationFailure = {
    result: 'failure';
    errors: ComponentMessageItem[];
};
type ValidationResult = ValidationFailure | ValidationSuccess;
type ValidatorLike<V> = Validator<V> | AsyncValidator<V>;
type ValidatorErrorResult = {
    message: ComponentMessageItem;
    messageDisplayStrategy: SelectionRangeValidatorError['messageDisplayStrategy'];
};
type AsyncValidationResult = {
    errors: Array<ValidatorErrorResult>;
    maybeErrorPromises: Array<Promise<void | ValidatorErrorResult>>;
};
type ValidateSyncParams<V> = {
    /**
     * The value to be validated.
     */
    value: V;
    /**
     * The list of validators to be used for performing synchronous validation.
     */
    validators: Validator<V>[];
};
type ValidateAsyncParams<V> = {
    /**
     * The value to be validated.
     */
    value: V;
    /**
     * The list of validators to be used for performing validation, which may be
     * synchronous or asynchronous.
     */
    validators: ValidatorLike<V>[];
};
/**
 * Performs validation synchronously with synchronous validators.
 * This method is called by useEditableValue to run deferred validators.
 * @param param0 The input for performing the validation
 * @returns The validation result
 */
declare function validateSync<V>({ validators, value }: ValidateSyncParams<V>): ValidationResult;
/**
 * This method is called by useEditableValue to run full validation, which
 * may include a mix of both synchronous and asynchronous validators.
 * Any synchronous validation errors are returned as part of the validation result.
 * If there are asynchronous validators, they are returned as an Array of Promises
 * that resolve to (ValidatorErrorResult | void) when validation completes.
 * Calling code will need to await these promises and handle the results accordingly.
 * @param param0 The input for performing the validation
 * @returns The async validation result, which can include synchronous validation errors as well
 * as an array of promises for the async validations
 */
declare function validateAsync<V>({ validators, value }: ValidateAsyncParams<V>): AsyncValidationResult;
export { validateAsync, validateSync, type AsyncValidationResult, type ValidatorErrorResult };
