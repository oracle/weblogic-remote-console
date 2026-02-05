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
const CheckboxRadioContext = preact.createContext({});
const useCheckboxRadioContext = () => hooks.useContext(CheckboxRadioContext);

exports.CheckboxRadioContext = CheckboxRadioContext;
exports.useCheckboxRadioContext = useCheckboxRadioContext;
//# sourceMappingURL=CheckboxRadioContext-3b134bd1.js.map
