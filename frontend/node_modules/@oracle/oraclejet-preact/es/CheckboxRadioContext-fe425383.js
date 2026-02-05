/* @oracle/oraclejet-preact: undefined */
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const CheckboxRadioContext = createContext({});
const useCheckboxRadioContext = () => useContext(CheckboxRadioContext);

export { CheckboxRadioContext as C, useCheckboxRadioContext as u };
//# sourceMappingURL=CheckboxRadioContext-fe425383.js.map
