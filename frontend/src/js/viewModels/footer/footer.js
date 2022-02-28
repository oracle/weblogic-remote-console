/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/preferences/preferences', 'ojs/ojknockout', 'ojs/ojbinddom'],
  function(oj, ko, HtmlUtils, Runtime, Preferences) {
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
        setFooter(Preferences.general.themePreference());
      };

      /**
       * Render footer based on a given contrast theme
       * @param {string} theme String for the contrast theme being used. The possible choices are "light" (the default) and "dark"
       */
      function setFooter(theme) {
        let ele = document.querySelector('footer');
        if (ele !== null) {
          ele.style.backgroundColor = Runtime.getConfig().settings.themes[theme][0];
          switch (theme) {
            case 'light':
              ele.style.color = 'black';
              self.i18n.icons.builtWith.iconFile('oracle-jet-logo-blk_16x16');
              break;
            case 'dark':
              ele.style.color = 'white';
              self.i18n.icons.builtWith.iconFile('oracle-jet-logo-wht_16x16');
              break;
          }
        }
      }

      /**
       * Register interest in being notified when the contrast theme changes.
       */
      viewParams.signaling.themeChanged.add((newTheme) => {
        setFooter(newTheme);
      });

    }

    return FooterTemplate;
  }
);
