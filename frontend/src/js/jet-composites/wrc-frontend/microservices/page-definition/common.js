/**
 * @license
 * Copyright (c) 2022, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['wrc-frontend/core/utils'],
  function (CoreUtils) {
  
    function setFocusFormElement(selectOnly = false) {
      let nodeList;
      const formElement = document.getElementById('wlsform');
      if (formElement !== null) {
        nodeList = formElement.querySelectorAll('oj-text-area.oj-textarea, oj-select-single.oj-text-field, oj-input-text.oj-text-field, oj-combobox-one.oj-text-field');
        if (!selectOnly) {
          if (nodeList !== null) {
            const arr = Array.from(nodeList);
            const index = arr.map(node => node.readonly).indexOf(false);
            if (index !== -1) arr[index].focus();
          }
        }
      }
      return {formElement: formElement, nodeList: nodeList};
    }

    function setPasswordOnInputHandler(selector, callbackFunction) {
      if (typeof selector === 'string') {
        const nodeList = document.querySelectorAll(selector);
        if (nodeList !== null) {
          $(selector).on('input', null, null, callbackFunction);
        }
      }
    }

    function setTextAreaResizeCSSValue(selectors) {
      if (Array.isArray(selectors) && typeof selectors[0] === 'string') {
        // selectors[0] is the 'textarea' tag name
        let nodeList = document.querySelectorAll(selectors[0]);
        if (nodeList !== null) {
          nodeList.forEach((node) => {
            // Safari requires that resize be set to 'both'
            node.style.resize = 'both';
          });
        }
  
        // selectors[1] is the '.oj-text-field-container' CSS class
        nodeList = document.querySelectorAll(selectors[1]);
        if (nodeList !== null) {
          nodeList.forEach((node) => {
            // Safari requires that resize be unset
            node.style.resize = 'unset';
          });
        }
      }
    }

    function setFormLayoutColumnCountCSSVariable(formLayout, signal) {
      if (formLayout !== null) {
        const maxColumns = formLayout.getAttribute('max-columns');
        if (maxColumns > 0) {
          document.documentElement.style.setProperty('--form-layout-column-count', maxColumns);
          signal.dispatch(maxColumns);
        }
      }
    }

  //public:
    return {
      FIELD_DISABLED: Object.freeze('fieldDisabled_'),
      FIELD_UNSET: Object.freeze('fieldUnset_'),
      FIELD_MESSAGES: Object.freeze('fieldMessages_'),
      FIELD_SELECTDATA: Object.freeze('fieldSelectData_'),
      FIELD_VALUES: Object.freeze('fieldValues_'),
      FIELD_VALUE_FROM: Object.freeze('fieldValuesFrom_'),
      FIELD_VALUE_SET: Object.freeze('fieldValueSet_'),
      FIELD_HIGHLIGHT_CLASS: Object.freeze('cfe-field-highlight'),
      setFocusFormElement: setFocusFormElement,
      setPasswordOnInputHandler: setPasswordOnInputHandler,
      setTextAreaResizeCSSValue: setTextAreaResizeCSSValue,
      setFormLayoutColumnCountCSSVariable: setFormLayoutColumnCountCSSVariable
    };

  }
);
