/**
 * @license
 * Copyright (c) 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils'
],
function (
  ViewModelUtils,
  CoreUtils
) {
    function DialogHelp(data) {
      this.providerHelpData = data;
    }

    function setDialogHelp(dialog) {
      /**
       *
       * @param {object} node
       * @param {{helpSummaryHTML: string, helpDetailHTML: string}} label
       * @private
       */
      function createLabelHelpAttributes(node, label) {
        node.setAttribute('help.definition', label.helpSummaryHTML);
        node.setAttribute('data-detailed-help', label.helpDetailHTML);
      }
      
      if (CoreUtils.isNotUndefinedNorNull(dialog)) {
        const providerType = dialog.attributes['data-provider-type'].value;
        const entry = this.providerHelpData.find(item => item.type === providerType);
        if (CoreUtils.isNotUndefinedNorNull(entry)) {
          const nodeList = dialog.querySelectorAll('[data-help-key]');

          if (nodeList !== null) {
            const arr = Array.from(nodeList);
            arr.forEach((node) => {
              const attr = node.attributes['data-help-key'];
              if (CoreUtils.isNotUndefinedNorNull(attr) && CoreUtils.isNotUndefinedNorNull(attr.value)) {
                const label = entry.help[attr.value];
                if (CoreUtils.isNotUndefinedNorNull(label)) {
                  createLabelHelpAttributes(node, label);
                }
              }
            });
          }
        }
      }
    }

    function clearDialogHelp(dialog) {
      function removeLabelHelpAttributes(node) {
        node.removeAttribute('help.definition');
        node.removeAttribute('data-detailed-help');
      }

      if (CoreUtils.isNotUndefinedNorNull(dialog)) {
        const providerType = dialog.attributes['data-provider-type'].value;
        const entry = this.providerHelpData.find(item => item.type === providerType);
        if (CoreUtils.isNotUndefinedNorNull(entry)) {
          const nodeList = dialog.querySelectorAll('[data-help-key]');
        
          if (nodeList !== null) {
            const arr = Array.from(nodeList);
            arr.forEach((node) => { removeLabelHelpAttributes(node); });
          }
        }
      }
    }

  //public:
    DialogHelp.prototype = {
      populate: function(dialog) {
        setDialogHelp.call(this, dialog);
      },
      clear: function(dialog) {
        clearDialogHelp.call(this, dialog);
      },
      display: function (event) {
        ViewModelUtils.helpIconClickListener(event);
      }
    };
  
    // Return the class constructor
    return DialogHelp;
  }
);