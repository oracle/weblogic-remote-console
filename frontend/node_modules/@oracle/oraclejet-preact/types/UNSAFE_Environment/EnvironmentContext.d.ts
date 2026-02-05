/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Theme, ThemeModifiers } from '../UNSAFE_Theme';
/**
 * Defines user specific environment
 */
type User = {
    locale: string;
    direction: 'rtl' | 'ltr';
    forcedColors: 'none' | 'active';
};
/**
 * Defines translation bundle type.
 */
export type TranslationBundle = Record<string, (...args: any[]) => string>;
/**
 * Defines a type for translation property which is an object where
 * - key - string - bundle id
 * - value - object - strings to functions of the type (options?: object)=>string
 *
 * Translation bundle example:
 * const bundle = {
 *  @oracle/oracle-preact-bundle: {
 *      welcome: () => 'bienvenido',
 *      success: () => 'éxito'
 *  }
 * }
 */
type Translations = {
    [bundleId: string]: TranslationBundle;
};
/**
 * Defines the mode in which the application is running. For "test" mode, UNSAFE_useTestId hook will
 * return a set of attributes to be rendered on the component DOM for testing purposes. Default is
 * "production"
 */
type Mode = 'test' | 'production';
/**
 * Environment specified at the root level
 */
export type RootEnvironment = Partial<ThemeModifiers> & {
    /**
     * user - supports user preferences
     */
    user?: Partial<User>;
    /**
     * theme - supports theme settings
     */
    theme?: Theme;
    /**
     * translations - supports translation bundles
     */
    translations?: Translations;
    /**
     * mode - the application's configured mode
     */
    mode?: Mode;
};
/**
 * Environment specified at the component level
 */
export type Environment = Partial<ThemeModifiers> & {
    translations?: Translations;
};
export type CompleteEnvironmentType = ThemeModifiers & {
    user: User;
    theme: Theme;
    translations?: Translations;
    mode: Mode;
};
/**
 * Default environment created for the application
 */
export declare const DefaultEnvironment: CompleteEnvironmentType;
export declare const EnvironmentContext: import("preact").Context<CompleteEnvironmentType>;
export {};
