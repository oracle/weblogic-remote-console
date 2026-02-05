import type { Dispatch } from 'preact/hooks';
import type { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import type { Optional, ValidState } from './types';
import type { Converter } from './types';
import type Validator = require('ojs/ojvalidator');
import type AsyncValidator = require('ojs/ojvalidator-async');
export type Callbacks<V, DV> = {
    onMessagesCustomChanged?: (messagesCustom?: ComponentMessageItem[]) => void;
    onRawValueChanged?: (rawValue: DV) => void;
    onTransientValueChanged?: (transientValue: V) => void;
    onValidChanged?: (valid: ValidState) => void;
    onValueChanged?: (value: V) => void;
};
type UpdateDisplayValueAction<DV> = {
    type: 'UPDATE_DISPLAY_VALUE';
    payload: DV;
};
type UpdateValueAction<V> = {
    type: 'UPDATE_VALUE';
    payload: Optional<V>;
};
type UpdateTransientValueAction<V> = {
    type: 'UPDATE_TRANSIENT_VALUE';
    payload: Optional<V>;
};
type UpdateValidAction = {
    type: 'UPDATE_VALID';
    payload: ValidState;
};
type UpdateComponentMessagesAction = {
    type: 'UPDATE_COMPONENT_MESSAGES';
    payload: ComponentMessageItem[];
};
type UpdateCustomMessagesAction = {
    type: 'UPDATE_CUSTOM_MESSAGES';
    payload: ComponentMessageItem[];
};
type UpdateHiddenMessagesAction = {
    type: 'UPDATE_HIDDEN_MESSAGES';
    payload: ComponentMessageItem[];
};
type ShowHiddenMessagesAction = {
    type: 'SHOW_HIDDEN_MESSAGES';
    payload?: never;
};
type ClearAllMessagesAction = {
    type: 'CLEAR_ALL_MESSAGES';
    payload?: never;
};
type AddComponentMessageAction = {
    type: 'ADD_COMPONENT_MESSAGE';
    payload: ComponentMessageItem;
};
type AddHiddenMessageAction = {
    type: 'ADD_HIDDEN_MESSAGE';
    payload: ComponentMessageItem;
};
type UpdatePreviousConverterAction<V, DV> = {
    type: 'UPDATE_PREVIOUS_CONVERTER';
    payload?: Converter<V, DV>;
};
type UpdatePreviousDeferredValidatorsAction<V> = {
    type: 'UPDATE_PREVIOUS_DEFERRED_VALIDATORS';
    payload?: Validator<V>[];
};
type UpdatePreviousDisabledAction = {
    type: 'UPDATE_PREVIOUS_DISABLED';
    payload?: boolean;
};
type UpdatePreviousReadonlyAction = {
    type: 'UPDATE_PREVIOUS_READONLY';
    payload?: boolean;
};
type UpdatePreviousValidatorsAction<V> = {
    type: 'UPDATE_PREVIOUS_VALIDATORS';
    payload?: (AsyncValidator<V> | Validator<V>)[];
};
type UpdatePreviousValueAction<V> = {
    type: 'UPDATE_PREVIOUS_VALUE';
    payload: Optional<V>;
};
type Action<V, DV> = AddComponentMessageAction | AddHiddenMessageAction | ClearAllMessagesAction | ShowHiddenMessagesAction | UpdateDisplayValueAction<DV> | UpdateValueAction<V> | UpdateTransientValueAction<V> | UpdateValidAction | UpdateComponentMessagesAction | UpdateCustomMessagesAction | UpdateHiddenMessagesAction | UpdatePreviousConverterAction<V, DV> | UpdatePreviousDeferredValidatorsAction<V> | UpdatePreviousDisabledAction | UpdatePreviousReadonlyAction | UpdatePreviousValidatorsAction<V> | UpdatePreviousValueAction<V>;
type State<V, DV> = Readonly<{
    customMessages?: ComponentMessageItem[];
    componentMessages: ComponentMessageItem[];
    hiddenMessages: ComponentMessageItem[];
    shownMessages: ComponentMessageItem[];
    displayValue?: DV;
    value?: Optional<V>;
    valid?: ValidState;
    previousConverter?: Converter<V, DV>;
    previousDeferredValidators?: Validator<V>[];
    previousDisabled?: boolean;
    previousReadonly?: boolean;
    previousValidators?: (AsyncValidator<V> | Validator<V>)[];
    previousValue?: Optional<V>;
    transientValue?: Optional<V>;
}>;
/**
 * Reducer which manages state for useEditableValue hook.
 * @param state
 * @param action
 * @returns
 */
declare function reducer<V, DV>(state: State<V, DV>, action: Action<V, DV>): State<V, DV>;
declare function updateDisplayValue<V, DV>(dispatch: Dispatch<Action<V, DV>>, displayValue: DV, { onRawValueChanged }: Callbacks<V, DV>): void;
declare function updateValidStatus<V, DV>(dispatch: Dispatch<Action<V, DV>>, state: ValidState, { onValidChanged }: Callbacks<V, DV>): void;
declare function updateValue<V, DV>(dispatch: Dispatch<Action<V, DV>>, value: V, { onValueChanged }: Callbacks<V, DV>): void;
declare function updateTransientValue<V, DV>(dispatch: Dispatch<Action<V, DV>>, transientValue: V, { onTransientValueChanged }: Callbacks<V, DV>): void;
declare function updateComponentMessages<V, DV>(dispatch: Dispatch<Action<V, DV>>, messages: ComponentMessageItem[]): void;
declare function updateHiddenMessages<V, DV>(dispatch: Dispatch<Action<V, DV>>, messages: ComponentMessageItem[]): void;
declare function updateCustomMessages<V, DV>(dispatch: Dispatch<Action<V, DV>>, messages: ComponentMessageItem[]): void;
declare function updatePreviousValue<V, DV>(dispatch: Dispatch<Action<V, DV>>, value: V): void;
declare function updatePreviousConverter<V, DV>(dispatch: Dispatch<Action<V, DV>>, converter?: Converter<V, DV>): void;
declare function updatePreviousDeferredValidators<V, DV>(dispatch: Dispatch<Action<V, DV>>, validators?: Validator<V>[]): void;
declare function updatePreviousDisabled<V, DV>(dispatch: Dispatch<Action<V, DV>>, disabled?: boolean): void;
declare function updatePreviousReadonly<V, DV>(dispatch: Dispatch<Action<V, DV>>, readonly?: boolean): void;
declare function updatePreviousValidators<V, DV>(dispatch: Dispatch<Action<V, DV>>, validators?: (AsyncValidator<V> | Validator<V>)[]): void;
declare function clearAllMessages<V, DV>(dispatch: Dispatch<Action<V, DV>>, _value: any, { onMessagesCustomChanged }: Callbacks<V, DV>): void;
declare function showHiddenMessages<V, DV>(dispatch: Dispatch<Action<V, DV>>): void;
declare function addComponentMessage<V, DV>(dispatch: Dispatch<Action<V, DV>>, message: ComponentMessageItem): void;
declare function addHiddenMessage<V, DV>(dispatch: Dispatch<Action<V, DV>>, message: ComponentMessageItem): void;
export { reducer, Action, State, addComponentMessage, addHiddenMessage, clearAllMessages, showHiddenMessages, updateComponentMessages, updateCustomMessages, updateDisplayValue, updateHiddenMessages, updatePreviousConverter, updatePreviousDeferredValidators, updatePreviousDisabled, updatePreviousReadonly, updatePreviousValidators, updatePreviousValue, updateTransientValue, updateValidStatus, updateValue };
