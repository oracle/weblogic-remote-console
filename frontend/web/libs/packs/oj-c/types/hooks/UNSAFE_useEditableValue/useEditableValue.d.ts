import type { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import { ConversionResult } from './converterUtils';
import type { Optional, TranslateParseErrorFunc, ValidState } from './types';
import type { ValueUpdateDetail } from '@oracle/oraclejet-preact/utils/UNSAFE_valueUpdateDetail';
import type { Converter } from './types';
import type Validator = require('ojs/ojvalidator');
import type AsyncValidator = require('ojs/ojvalidator-async');
type UseEditableValueProps<V, DV> = {
    addBusyState?: (desc?: string) => () => void;
    ariaDescribedBy?: string;
    converter?: Converter<V, DV>;
    defaultDisplayValue: DV;
    deferredValidators?: Validator<V>[];
    disabled?: boolean;
    displayOptions?: {
        messages?: 'display' | 'none';
    };
    messagesCustom?: ComponentMessageItem[];
    onDisplayValueChanged?: () => void;
    onMessagesCustomChanged?: (messagesCustom?: ComponentMessageItem[]) => void;
    onRawValueChanged?: (rawValue: DV) => void;
    onTransientValueChanged?: (transientValue: V) => void;
    onValidChanged?: (valid: ValidState) => void;
    onValueChanged?: (value: V) => void;
    translateConverterParseError?: TranslateParseErrorFunc;
    readonly?: boolean;
    validators?: (AsyncValidator<V> | Validator<V>)[];
    value?: V;
};
/**
 * A custom hook to handle value and value based life cycle of an editable component.
 * This uses a reducer to handle form component states like value, displayValue, valid, etc.
 */
export declare function useEditableValue<V = string, DV = V>({ addBusyState, ariaDescribedBy, converter, defaultDisplayValue, deferredValidators, disabled, displayOptions, messagesCustom, onDisplayValueChanged, onMessagesCustomChanged, onRawValueChanged, onTransientValueChanged, onValidChanged: propOnValidChanged, onValueChanged, translateConverterParseError, readonly, validators, value }: UseEditableValueProps<V, DV>): {
    value: Optional<V>;
    addMessage: (message: ComponentMessageItem) => void;
    clearInteractionFlags: () => void;
    displayValue: DV | undefined;
    formatValue: (value: Optional<V>) => DV | undefined;
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    onCommitValue: (value: Optional<V>, doCommitOnValid?: boolean) => Promise<boolean>;
    parseValue: (value: DV) => ConversionResult<V>;
    refreshDisplayValue: (value: Optional<V>) => true;
    setDisplayValue: (value: Optional<DV>) => void;
    setTransientValue: (transientValue: Optional<V>) => void;
    setValue: (value: Optional<V>) => void;
    textFieldProps: {
        'aria-describedby': string | undefined;
        messages: ComponentMessageItem[] | undefined;
        onCommit: ({ value }: ValueUpdateDetail<DV>) => Promise<boolean>;
        onInput: ({ value }: ValueUpdateDetail<DV>) => void;
        value: DV | undefined;
    };
    validateValueOnExternalChange: (value: Optional<V>) => true;
};
export {};
