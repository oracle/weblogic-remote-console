/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps } from 'preact';
import { FormContextProps } from '@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext';
import type { TextArea } from 'oj-c/text-area';
type TextAreaProps = ComponentProps<typeof TextArea>;
type Props = {
    propContainerReadonly: TextAreaProps['containerReadonly'];
    propLabelWrapping: TextAreaProps['labelWrapping'];
    propReadonly: TextAreaProps['readonly'];
    propTextAlign?: TextAreaProps['textAlign'];
    propUserAssistanceDensity: TextAreaProps['userAssistanceDensity'];
};
/**
 * This hook merges values set via binding propagation with values propagated via form context.
 *
 * If we are in VDOM, form context is passed via Context and there is no binding propagation.
 * However, values may still be set directly on the component and should take precedence
 * if present.
 *
 * If we are in MVVM, binding propagation is in effect however there will still be values in
 * context because we create FormContext with defaults.
 *
 * Individual form components need to consume and then reprovide form context in order to achieve
 * mixed readonly. This is done by relying on the merged context produced by this hook. Additionally,
 * in order for things to work properly in both VDOM/MVVM we can no longer use property defaulting for
 * any props that are propagated, because the default value will always "win". This hook also
 * returns fallback values for certain props, which are used in lieu of defaults.
 *
 * @param propContainerReadonly The component's containerReadonly property
 * @param propLabelWrapping The component's labelWrapping property
 * @param propReadonly The component's readonly property
 * @param propTextAlign The component's textAlign property
 * @param propUserAssistanceDensity The component's userAssistanceDensity property
 * @returns
 */
export declare function useMergedFormContext({ propContainerReadonly, propLabelWrapping, propReadonly, propTextAlign, propUserAssistanceDensity }: Props): {
    containerProps: FormContextProps;
    readonlyValue: boolean | undefined;
    uadValue: import("@oracle/oraclejet-preact/UNSAFE_UserAssistance").UserAssistanceDensityType | undefined;
};
export {};
