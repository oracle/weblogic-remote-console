/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ValueUpdateDetail } from '../utils/UNSAFE_valueUpdateDetail';
type RadioSetContextValue = {
    name: string;
    value?: string | number;
    onCommit?: (detail: ValueUpdateDetail<string | number | undefined>) => void;
};
declare const RadioSetContext: import("preact").Context<RadioSetContextValue>;
declare const useRadioSetContext: () => RadioSetContextValue;
export { RadioSetContext, useRadioSetContext };
