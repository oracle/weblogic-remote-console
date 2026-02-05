/* @oracle/oraclejet-preact: undefined */
'use strict';

var preact = require('preact');
var hooks = require('preact/hooks');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const RadioSetContext = preact.createContext({});
const useRadioSetContext = () => hooks.useContext(RadioSetContext);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const RadioItemContext = preact.createContext({});
const useRadioItemContext = () => hooks.useContext(RadioItemContext);

exports.RadioItemContext = RadioItemContext;
exports.RadioSetContext = RadioSetContext;
exports.useRadioItemContext = useRadioItemContext;
exports.useRadioSetContext = useRadioSetContext;
//# sourceMappingURL=RadioItemContext-3a86c17d.js.map
