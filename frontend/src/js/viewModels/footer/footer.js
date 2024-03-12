/**
 * @license
 * Copyright (c) 2021, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojhtmlutils',
  'ojs/ojknockout',
  'ojs/ojbinddom'
],
  function(
    oj,
    ko,
    HtmlUtils
  ) {
    function FooterTemplate(viewParams){
      // Declare reference to instance of the ViewModel that JET
      // creates/manages the lifecycle of. This reference is needed
      // (and used) inside closures.
      const self = this;

      // START: Declare instance variables used in the ViewModel's view
      this.i18n = {
        text: {
          copyrightLegal: oj.Translations.getTranslatedString('wrc-footer.text.copyrightLegal'),
          builtWith: oj.Translations.getTranslatedString('wrc-footer.text.builtWith')
        },
        icons: {
          builtWith: {iconFile: ko.observable('oracle-jet-logo-blk_16x16')}
        }
      };

      this.copyrightLegalHTML = ko.observable();
      // END: Declare instance variables used in the ViewModel's view

      /**
       * Callback for the JET lifecycle method that is called when the HTML (in the ViewModel's view, or generated programmatically) is added to the DOM
       */
      this.connected = function () {
        self.copyrightLegalHTML({ view: HtmlUtils.stringToNodeArray(self.i18n.text.copyrightLegal), data: self });
      };

    }

    return FooterTemplate;
  }
);