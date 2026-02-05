/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var MessagesContext = require('./MessagesContext-4e939750.js');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Uses the MessagesContext if one is available.
 *
 * @returns The context from the closes provider
 */
function useMessagesContext() {
    return hooks.useContext(MessagesContext.MessagesContext);
}

exports.useMessagesContext = useMessagesContext;
//# sourceMappingURL=useMessagesContext-23d62331.js.map
