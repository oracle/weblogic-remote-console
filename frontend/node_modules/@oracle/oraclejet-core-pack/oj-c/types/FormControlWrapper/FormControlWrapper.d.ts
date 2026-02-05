/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import type { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { type ValidState } from 'oj-c/hooks/UNSAFE_useEditableValue/index';
import type { ValueUpdateDetail } from '@oracle/oraclejet-preact/utils/UNSAFE_valueUpdateDetail';
import Validator = require('ojs/ojvalidator');
type ContentRendererContext<V> = {
    /**
     * Whether the wrapped component is readonly. It is the responsibility of the calling code
     * to actually render correctly for this case.
     */
    isReadonly: boolean;
    /**
     * The id of the generated label. Can be used with aria-labelledby on the wrapped component.
     */
    labelId: string;
    /**
     * The id of the user assistance, including messages.
     * Can be used with aria-describedby on the wrapped component.
     */
    userAssistanceId: string;
    /**
     * Call this in order to commit a new value for the wrapped component.
     */
    onCommit: (detail: ValueUpdateDetail<V | undefined>) => Promise<boolean>;
    /**
     * Form component 'showMessages' method.
     */
    showMessages: () => void;
    /**
     * Form component 'validate' method.
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
type FormControlWrapperProps<V> = {
    /**
     * A render function for rendering the wrapped content.
     */
    children: (rendererContext: ContentRendererContext<V>) => ComponentChildren;
    /**
     * Whether the parent container is readonly.
     * This property is used solely for binding propagation.
     */
    containerReadonly?: boolean;
    /**
     * Custom validators used for deferred validation (i.e. required validation).
     */
    deferredValidators?: Validator<V>[];
    /**
     * Specifies whether the component is disabled.
     */
    disabled?: boolean;
    /**
     * Specifies the component's label.
     */
    labelHint: string;
    /**
     * Specifies where the label is positioned relative to the field.
     */
    labelEdge?: 'start' | 'top' | 'inside';
    /**
     * Specifies the width of the label when <code>labelEdge</code> is <code>"start"</code>.
     */
    labelStartWidth?: Size;
    /**
     * Should the label wrap or truncate when there is not enough available space.
     * @deprecated Since 18.0.0. Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: 'truncate' | 'wrap';
    /**
     * Messages to show on screen that are associated with the component.
     */
    messagesCustom?: ComponentMessageItem[];
    /**
     * Specifies whether the component is readonly.
     */
    readonly?: boolean;
    /**
     * Specifies whether the component is required.
     */
    required?: boolean;
    /**
     * Specifies the density of the user assistance presentation.
     * NOTE: compact is currently not supported and will be remapped to reflow.
     */
    userAssistanceDensity?: 'reflow' | 'efficient' | 'compact';
    /**
     * The component's value.
     */
    value?: V;
    /**
     * Called when the label is clicked. This can be used to set focus on the wrapped component.
     */
    onLabelClick?: (e: MouseEvent) => void;
    /**
     * Called when messagesCustom is changed during the form component lifecycle.
     */
    onMessagesCustomChanged?: (messagesCustom: ComponentMessageItem[] | undefined) => void;
    /**
     * Called when valid is changed during the form component lifecycle.
     */
    onValidChanged?: (valid: ValidState) => void;
    /**
     * Called when value is changed during the form component lifecycle.
     */
    onValueChanged?: (value: V | undefined) => void;
};
/**
 * A wrapper component for VComponent authors who wish to make their component
 * act like a form control.
 */
declare function FormControlWrapper<V>({ children, containerReadonly: propContainerReadonly, deferredValidators, disabled, labelHint, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, labelWrapping: propLabelWrapping, messagesCustom, onLabelClick, onMessagesCustomChanged, onValidChanged, onValueChanged, readonly: propReadonly, required, userAssistanceDensity: propUserAssistanceDensity, value: propValue }: FormControlWrapperProps<V>): import("preact").JSX.Element;
export type { ContentRendererContext, FormControlWrapperProps, ValidState };
export { FormControlWrapper };
