define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAsync = validateAsync;
    exports.validateSync = validateSync;
    /**
     * Performs validation synchronously with synchronous validators.
     * This method is called by useEditableValue to run deferred validators.
     * @param param0 The input for performing the validation
     * @returns The validation result
     */
    function validateSync({ validators, value }) {
        const errors = [];
        for (const validator of validators) {
            try {
                validator.validate(value);
            }
            catch (error) {
                errors.push((0, utils_1.createMessageFromError)(error));
            }
        }
        if (errors.length) {
            return { result: 'failure', errors };
        }
        return { result: 'success' };
    }
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
    function validateAsync({ validators, value }) {
        const doValidate = (validator, value) => {
            try {
                const validateResult = validator.validate(value);
                // The api contract for an async validator's validate method is that it returns a Promise that
                // resolves to void if the validation passes or a Promise that rejects with an error if it fails.
                // The api contract for a sync validator's validate method is it returns void if the validation passes
                // or it throws an error if it fails. This method wraps the latter inside a promise as well.
                if (validateResult instanceof Promise) {
                    return validateResult.then(
                    // resolved promise is a successful validation, do not
                    // need to do anything here
                    () => { }, 
                    // rejected promise is a failed validation, construct and return
                    // back the ValidatorErrorResult
                    (error) => {
                        return {
                            message: (0, utils_1.createMessageFromError)(error),
                            messageDisplayStrategy: error?.messageDisplayStrategy
                        };
                    });
                }
            }
            catch (error) {
                return {
                    message: (0, utils_1.createMessageFromError)(error),
                    messageDisplayStrategy: error?.messageDisplayStrategy
                };
            }
            return;
        };
        const errors = [];
        const maybeErrorPromises = [];
        for (const validator of validators) {
            const maybeValidatorErrorResult = doValidate(validator, value);
            if (maybeValidatorErrorResult !== undefined) {
                if (maybeValidatorErrorResult instanceof Promise) {
                    // this could resolve to a ValidatorErrorResult or it could resolve to void.
                    maybeErrorPromises.push(maybeValidatorErrorResult);
                }
                else {
                    errors.push(maybeValidatorErrorResult);
                }
            }
        }
        return {
            errors,
            maybeErrorPromises
        };
    }
});
