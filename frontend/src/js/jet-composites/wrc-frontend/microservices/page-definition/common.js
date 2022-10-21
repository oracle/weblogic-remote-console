/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['wrc-frontend/core/utils'],
  function (CoreUtils) {

  //public:
    return {
      FIELD_DISABLED: Object.freeze('fieldDisabled_'),
      FIELD_UNSET: Object.freeze('fieldUnset_'),
      FIELD_MESSAGES: Object.freeze('fieldMessages_'),
      FIELD_SELECTDATA: Object.freeze('fieldSelectData_'),
      FIELD_VALUES: Object.freeze('fieldValues_'),
      FIELD_VALUE_FROM: Object.freeze('fieldValuesFrom_'),
      FIELD_VALUE_SET: Object.freeze('fieldValueSet_'),
      FIELD_HIGHLIGHT_CLASS: Object.freeze('cfe-field-highlight')
    };

  }
);
