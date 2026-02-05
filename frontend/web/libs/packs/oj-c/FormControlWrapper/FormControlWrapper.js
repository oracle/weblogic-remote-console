define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_UserAssistance", "@oracle/oraclejet-preact/UNSAFE_Label", "@oracle/oraclejet-preact/UNSAFE_LabelValueLayout", "oj-c/hooks/UNSAFE_useEditableValue/index", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext"], function (require, exports, jsx_runtime_1, hooks_1, UNSAFE_useFormContext_1, ojvcomponent_1, UNSAFE_UserAssistance_1, UNSAFE_Label_1, UNSAFE_LabelValueLayout_1, index_1, useMergedFormContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormControlWrapper = FormControlWrapper;
    const messagesDefault = [];
    const displayOptions = {
        messages: 'display'
    };
    /**
     * A wrapper component for VComponent authors who wish to make their component
     * act like a form control.
     */
    function FormControlWrapper({ children, containerReadonly: propContainerReadonly, deferredValidators, disabled = false, labelHint, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, labelWrapping: propLabelWrapping, messagesCustom = messagesDefault, onLabelClick, onMessagesCustomChanged, onValidChanged, onValueChanged, readonly: propReadonly, required = false, userAssistanceDensity: propUserAssistanceDensity, value: propValue }) {
        const uniqueId = (0, hooks_1.useRef)((0, ojvcomponent_1.getUniqueId)());
        const labelId = `formControlWrapper-label-${uniqueId.current}`;
        const userAssistanceId = `formControlWrapper-ua-${uniqueId.current}`;
        // The wrapped VComponent either receives props through binding propagation (MVVM)
        // or FormContext (VDOM). However, form context is still defined when you're in MVVM,
        // it just contains default values. The useMergedFormContext hook correctly determines
        // which values to use.
        const { containerProps, uadValue, readonlyValue: readonly } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping,
            propReadonly,
            propUserAssistanceDensity
        });
        const { methods: editableValueMethods, textFieldProps, value } = (0, index_1.useEditableValue)({
            defaultDisplayValue: undefined,
            deferredValidators,
            disabled,
            displayOptions,
            messagesCustom,
            onMessagesCustomChanged,
            onValidChanged,
            onValueChanged,
            readonly,
            value: propValue
        });
        const { messages, onCommit } = textFieldProps;
        // propLabelEdge and propLabelStartWidth may be set via binding propagation or directly
        // on the component. If unset, use the defaults from the form context.
        const { labelEdge: formLabelEdge, labelStartWidth: formLabelStartWidth } = containerProps;
        const labelEdge = propLabelEdge ?? formLabelEdge;
        const labelStartWidth = propLabelStartWidth ?? formLabelStartWidth;
        // We don't currently support compact, so remap it.
        const userAssistanceDensity = uadValue !== 'compact' ? uadValue : 'reflow';
        const hasNoValue = value === null ||
            value === undefined ||
            (typeof value === 'string' && value === '') ||
            (Array.isArray(value) && value.length === 0);
        const requiredShown = required && hasNoValue;
        const inlineUserAssistance = disabled || readonly ? (
        // Save space for user assistance if density is 'efficient', even though we don't
        // (currently) render user assistance for disabled or readonly fields.
        userAssistanceDensity !== 'efficient' ? undefined : ((0, jsx_runtime_1.jsx)(UNSAFE_UserAssistance_1.InlineUserAssistance, { id: userAssistanceId, userAssistanceDensity: userAssistanceDensity }))) : ((0, jsx_runtime_1.jsx)(UNSAFE_UserAssistance_1.InlineUserAssistance, { fieldLabel: labelHint, id: userAssistanceId, messages: messages, isRequiredShown: requiredShown, userAssistanceDensity: userAssistanceDensity }));
        const { showMessages, validate } = editableValueMethods;
        const rendererContext = {
            isReadonly: readonly,
            labelId,
            userAssistanceId,
            onCommit,
            showMessages,
            validate
        };
        // We need to provide the merged form context in order to support mixed readonly
        // as well as to propagate labelWrapping. The labelEdge, labelStartWidth, and
        // userAssistanceDensity are passed directly as props.
        return ((0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsxs)(UNSAFE_LabelValueLayout_1.LabelValueLayout, { hasTopUserAssistance: false, label: (0, jsx_runtime_1.jsx)(UNSAFE_Label_1.Label, { id: labelId, isRequiredShown: requiredShown, onClick: onLabelClick, parentComponentVariant: "formComponentWrapper", userAssistanceDensity: userAssistanceDensity, variant: labelEdge, children: labelHint }), labelEdge: labelEdge, labelStartWidth: labelStartWidth, parentComponentVariant: "formComponentWrapper", children: [children(rendererContext), inlineUserAssistance] }) }));
    }
});
