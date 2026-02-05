/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Utility hook for consuming the TabBarContext
 *
 * @returns The value of TabBarContext provider
 */
declare function useTabBarContext(): import("./TabBarContext").TabBarContextProps<string | number>;
export { useTabBarContext };
