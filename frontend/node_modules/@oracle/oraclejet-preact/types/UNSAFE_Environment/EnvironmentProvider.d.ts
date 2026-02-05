/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Environment, RootEnvironment } from './EnvironmentContext';
import { ComponentChildren } from 'preact';
export declare type ProviderProperties<Env extends RootEnvironment | Environment> = {
    environment?: Env;
    children?: ComponentChildren;
};
/**
 * The RootEnvironmentProvider component bootstraps essential services and
 * must be placed at the root of any application using components from '@oracle/oraclejet-preact'.
 * Minimally, the application must load the appropriate translation bundle for the user's locale
 * and set it on the RootEnvironmentProvider.
 */
export declare function RootEnvironmentProvider({ children, environment }: ProviderProperties<RootEnvironment>): import("preact").JSX.Element;
/**
 * The EnvironmentProvider is a component that should be used by the application when there is a need to overwrite
 * environment values for a subtree.
 * The component receives an Environment object that will be merged into the values provided by the nearest ancestor Provider.
 * The new environment will be passed to the component's children.
 * Note that some environment values cannot be overwritten. See the description of the Environment type for the list of values
 * that can be replaced.
 */
export declare function EnvironmentProvider({ children, environment }: ProviderProperties<Environment>): import("preact").JSX.Element;
