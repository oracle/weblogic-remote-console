import Validator = require('ojs/ojvalidator');
import AsyncValidator = require('ojs/ojvalidator-async');
type ValidatorLike<V> = Validator<V> | AsyncValidator<V>;
/**
 * Props for the useDeferredValidators hook
 */
type UseDeferredValidatorsProps = {
    /**
     * The label hint of the component
     */
    labelHint?: string;
    /**
     * Flag to indicate if the field needs deferred required
     * validator
     */
    required?: boolean;
    /**
     * If the app wants to override the RequiredValidator's default message detail string
     * on a per component instance, then they would set this property to a translated string.
     */
    requiredMessageDetail?: string;
};
/**
 * A custom hook the creates deferred validators based on certain properties
 * of the component, e.g., the required property.
 *
 * @param param0 The props for the useDeferredValidators hook
 * @returns An array of deferred validators
 */
export declare function useDeferredValidators<V>({ labelHint, required, requiredMessageDetail: propRequiredMessageDetail }: UseDeferredValidatorsProps): ValidatorLike<V>[];
export {};
