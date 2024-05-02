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
  'wrc-frontend/common/keyup-focuser',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/types',
  'wrc-frontend/core/utils',
  'ojs/ojknockout',
],
function (
  oj,
  ko,
  KeyUpFocuser,
  ViewModelUtils,
  Runtime,
  CoreTypes,
  CoreUtils
) {
    function ContentAreaHeaderToolbar(viewParams) {
      const self = this;

      this.i18n = {
        ariaLabel: {
          button: {
            home: { value: oj.Translations.getTranslatedString('wrc-content-area-header.ariaLabel.button.home.value')}
          }
        },
        buttons: {
          home: {
            id: 'home', iconFile: 'fa fa-home', disabled: ko.observable(false), visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label')
          }
        }
      };

      this.readonly = ko.observable();

      this.signalBindings = [];

      this.connected = function() {
        self.readonly(Runtime.isReadOnly());

        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          const disabled = ([CoreTypes.Console.RuntimeMode.DETACHED.name, CoreTypes.Console.RuntimeMode.UNATTACHED.name].includes(newMode));
          setToolbarButtonDisabledState('home', disabled);
          setToolbarButtonVisibility('home', !disabled);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setToolbarButtonDisabledState('home', true);

            setToolbarButtonVisibility('home', false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          self.canExitCallback = undefined;
          if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
            viewParams.parentRouter.go('home');
            viewParams.signaling.beanTreeChanged.dispatch({name: 'home', type: 'home', label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label'), provider: {id: dataProvider.id, name: dataProvider.name, type: dataProvider.type}});
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setToolbarButtonDisabledState('home', true);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        this.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeResized.add((source, newOffsetLeft, newOffsetWidth) => {
          setKeyUpFocusItems(getKeyUpFocusSelector());
        });

        self.signalBindings.push(binding);
      }.bind(this);

      this.disconnected = function () {
        let dispose = function (obj) {
          if (obj && typeof obj.dispose === 'function') {
            obj.dispose();
          }
        };

        // Detach all signal "add" bindings.
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];

      }.bind(this);

      this.onKeyUp = (event) => {
        if (event.key === 'ArrowLeft' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
          let ele = document.querySelector('#nav');
          if (ele === null) ele = document.querySelector('#navstrip');
          if (ele !== null) $(ele).focus();
        }
        else if (event.key === 'ArrowDown' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
          const result =  getKeyUpFocusSelector();
          if (CoreUtils.isNotUndefinedNorNull(result.selector)) {
            if (result.hasFocusIndexValue) {
              const rule = KeyUpFocuser.getLastExecutedRule(result.selector);
              if (rule.focusIndexValue === -1) {
                rule.focusIndexValue = 0;
                KeyUpFocuser.setLastExecutedRule(result.selector, {focusIndexValue: rule.focusIndexValue, key: event.key});
              }
              $(result.selector)[rule.focusIndexValue].focus();
            }
            else {
              $(result.selector).focus();
            }
          }
        }
      };

      this.setToolbarButtonVisibility = (buttonId, visible) => {
        setToolbarButtonVisibility(buttonId, visible);
      };

      /**
       * Called when user clicks a button in the content
       * area header's menubar
       * @param event
       */
      this.contentAreaHeaderButtonClickHandler = (event) => {
        if (event.currentTarget.id === 'home') {
          ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
            .then(reply => {
              if (reply) {
                if (!self.i18n.buttons.home.disabled()) {
                  // Attempt to get keyup focuser id that needs to be blurred.
                  const result =  getKeyUpFocusSelector();
                  if (CoreUtils.isNotUndefinedNorNull(result.selector)) {
                    // Treat clicking (or pressing the "Enter" key) on the
                    // "Home" button, like the user pressed the "Escape" key.
                    // Set that as the key for the last executed rule, and -1
                    // as the focusIndexValue. The KeyUpFocuser will increment
                    // an index set to -1, but it won't use for focus setting.
                    if (result.hasFocusIndexValue) {
                      KeyUpFocuser.setLastExecutedRule(result.selector, {focusIndexValue: 0, key: 'Tab', shiftKey: true});
                    }
                    // Do the same with the '.gallery-panel-card' KeyUpFocuser
                    // entry, if it exists.
                    KeyUpFocuser.setLastExecutedRule('.gallery-panel-card', {focusIndexValue: 0, key: 'Tab', shiftKey: true});
                  }
                  // Tell moduleConfig creator "Home" button was clicked
                  viewParams.onToolbarButtonClicked({id: 'home'});
                }
              }
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
      };

      function setKeyUpFocusItems(result) {
        if (CoreUtils.isNotUndefinedNorNull(result.selector)) {
          if (result.hasFocusIndexValue) {
            const rule = KeyUpFocuser.getLastExecutedRule(result.selector);
            if (rule.focusIndexValue !== -1 &&
              CoreUtils.isNotUndefinedNorNull($(result.selector)[rule.focusIndexValue])
            ) {
              KeyUpFocuser.setFocusItems(result.selector, {focusItems: []});
              $(result.selector)[rule.focusIndexValue].focus();
            }
          }
          else {
            $(result.selector).focus();
          }
        }
      }

      function getKeyUpFocusSelector() {
        const result = {selector: null, hasFocusIndexValue: false};

        let ele = document.querySelector('#breadcrumbs-container > ul > li');

        if (CoreUtils.isNotUndefinedNorNull(ele)) {
          result.selector = '#breadcrumbs-container > ul > li';
          if (document.querySelector('#breadcrumbs-container > ul > li oj-menu-button') !== null) {
            result.selector = '#breadcrumbs-container > ul > li oj-menu-button';
          }
        }
        else {
          ele = document.querySelector('.landing-page-panel-subtree-card');

          if (CoreUtils.isNotUndefinedNorNull(ele)) {
            result.selector = '.landing-page-panel-subtree-card';
            result.hasFocusIndexValue = true;
          }
          else {
            ele = document.querySelector('.landing-page-card');
            if (CoreUtils.isNotUndefinedNorNull(ele)) {
              result.selector = '.landing-page-card';
              result.hasFocusIndexValue = true;
            }
          }

          if (CoreUtils.isUndefinedOrNull(ele)) {
            ele = document.querySelector('.gallery-panel-card');
            if (CoreUtils.isNotUndefinedNorNull(ele)) {
              result.selector = '.gallery-panel-card';
              result.hasFocusIndexValue = true;
            }
          }
        }

        if (CoreUtils.isUndefinedOrNull(result.selector)) {
          switch (Runtime.getStartupTaskChooser()) {
            case 'use-dialog':
              result.selector = '.gallery-panel-card';
              result.hasFocusIndexValue = true;
              break;
            case 'use-cards':
              result.selector = '.startup-task-panel-card';
              result.hasFocusIndexValue = true;
              break;
          }
        }

        return result;
      }

      function setToolbarButtonDisabledState(buttonId, state) {
        self.i18n.buttons[buttonId].disabled(state);
      }

      function setToolbarButtonVisibility(buttonId, visible) {
        self.i18n.buttons[buttonId].visible(visible);
      }

    }

    return ContentAreaHeaderToolbar;
  }
);