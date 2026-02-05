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
const RadioSetContext = createContext({});
const useRadioSetContext = () => useContext(RadioSetContext);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const RadioItemContext = createContext({});
const useRadioItemContext = () => useContext(RadioItemContext);

export { RadioSetContext as R, useRadioItemContext as a, RadioItemContext as b, useRadioSetContext as u };
//# sourceMappingURL=RadioItemContext-fe419b75.js.map
