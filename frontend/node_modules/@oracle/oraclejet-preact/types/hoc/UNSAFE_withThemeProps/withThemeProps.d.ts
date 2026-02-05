/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentType } from 'preact';
import { ThemeModifiers as Props } from "../../UNSAFE_Theme";
/**
 * Higher Order Component that allows you to wrap an existing component with an EnvironmentProvider
 * containing the desired colorScheme, scale, and density context. The returned component contains all the props
 * of the wrapped component with the addition of the `colorScheme`, `scale`, and `density` props.
 *
 * This should be used when nesting an alternate colorScheme (ie dark palette sub-form within a global light
 * palette). You can use this HOC instead of manually applying colorScheme classnames to DOM elements. This also
 * eliminates the need to add additional DOM wrapper elements.
 */
declare const withThemeProps: <T extends object>(WrappedComponent: ComponentType<T>) => import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<T & Partial<Props>> & {
    ref?: import("preact").Ref<unknown> | undefined;
}>;
export default withThemeProps;
