/**
 * @license
 * Copyright (c) 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    'ojs/ojcontext',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/microservices/preferences/preferences-manager',
    'wrc-frontend/core/runtime',
    'ojs/ojlogger',
    'ojs/ojmenuselectmany'
  ],
  function(
    oj,
    ko,
    Context,
    ViewModelUtils,
    PreferencesManager,
    Runtime,
    Logger
  ) {
    function AppThemeTemplate(viewParams){
      const self = this;
  
      this.i18n = {
        icons: {
          theme: {id: 'theme', iconFile: 'oj-ux-ico-circle-half', visible: ko.observable(!Runtime.getProperty('features.theme.disabled')),
            tooltip: oj.Translations.getTranslatedString('wrc-header.icons.theme.tooltip')
          }
        },
        menus: {
          theme: {
            light: {id: 'light-theme', iconFile: 'oj-ux-ico-brightness-high', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-header.menus.theme.light.value')
            },
            dark: {id: 'dark-theme', iconFile: 'oj-ux-ico-brightness-high', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-header.menus.theme.dark.value')
            }
          }
        }
      };

      // Initialize instance-scope variables used in header.html
      this.themeSelectedItem = ko.observable([]);

      this.launchThemeMenu = (event) => {
        event.preventDefault();
        // Close any drawer that may be opened
        viewParams.signaling.ancillaryContentItemCleared.dispatch('header');
        // Open (i.e. launch) the popup containing the menu
        document.getElementById('themeMenu').open(event);
      };

      this.themeMenuAction = (event) => {
        // Get value of menu item selected
        const value = event.detail.selectedValue;
        setThemePreference(value);
      };

      function setThemePreference(theme) {
        function setThemeCSSVariables(theme) {
          ViewModelUtils.setCustomCssProperty('--preferences-theme-invert-filter', ViewModelUtils.getCustomCssProperty(`--preferences-theme-${theme}-invert-filter`));
          ViewModelUtils.setCustomCssProperty('--preferences-theme-background-color', ViewModelUtils.getCustomCssProperty(`--preferences-theme-${theme}-background-color`));
        }

        // We should be the only code setting the runtime
        // value for the current theme. Don't bother persisting
        // anything, unless the argument is different from the
        // current runtime property.
        if (theme !== Runtime.getProperty(Runtime.PropertyName.CFE_CURRENT_THEME)) {
          // Persist theme choice
          PreferencesManager.general.saveThemePreference(theme)
            .then(() => {
              // Update runtime property for CFE_CURRENT_THEME
              Runtime.setProperty(Runtime.PropertyName.CFE_CURRENT_THEME, theme);
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }

        // Update custom CSS variables being used in
        // filter: invert(amount) CSS styles, regardless
        // of whether theme is changing. Be mindful, that
        // filter: invert() works like a toggle.
        setThemeCSSVariables(theme);
        // We're making an "oj-menu-select-many" behave
        // like the non-existent "oj-menu-select-one", so
        // we need to set self.themeSelectedItem observable
        // driving the menu item that is checked.
        self.themeSelectedItem([theme]);
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(() => {
          // Retrieve persisted theme choice for user. Uses "light",
          // if there was no persisted choice.
          PreferencesManager.general.loadThemePreference()
            .then(reply => {
              // Set runtime property for current theme, to the
              // persisted value.
              Runtime.setProperty(Runtime.PropertyName.CFE_CURRENT_THEME, reply.body.data.preferences.theme);
              // Call routine that sets the theme based on the value
              // of the runtime property, we just set.
              setThemePreference(reply.body.data.preferences.theme);
            })
            .catch((err) => {
              Logger.error(err);
            });

        });
    }

    return AppThemeTemplate;
  }
);