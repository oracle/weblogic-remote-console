/**
 * @license
 * Copyright (c) 2021, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojknockout'],
  function (oj, ko, ViewModelUtils, Runtime, CoreTypes, CoreUtils) {
    function ContentAreaHeaderButtonsToolbar(viewParams) {
      const self = this;

      this.i18n = {
        toolbar: {
          buttons: {
            home: {
              id: 'home', image: 'home-icon-blk_24x24', disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label')
            }
          },
          icons: {
            tips: {id: 'tips', iconFile: ko.observable('tips-icon-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.tips.label')
            },
            projectmanagement: {id: 'projectmanagement', iconFile: ko.observable('project-management-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.projectmanagement.label')
            },
            shoppingcart: {
              id: 'shoppingcart', iconFile: ko.observable('shopping-cart-non-empty-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.shoppingcart.label')
            },
            recent: {
              id: 'recent', iconFile: ko.observable('toggle-beanpath-history-on-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.recent.label')
            }
          }
        }
      };

      this.signalBindings = [];

      this.connected = function() {
        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          const disabled = (newMode === CoreTypes.Console.RuntimeMode.DETACHED.name);
          setToolbarButtonDisabledState('home', disabled);
          setToolbarButtonVisibility('home', !disabled);

          setToolbarIconVisibility('recent', disabled);
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
          viewParams.signaling.beanTreeChanged.dispatch({name: 'home', type: 'home', label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label'), provider: {id: dataProvider.id, name: dataProvider.name, type: dataProvider.type}});
          $('#home').click();
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

      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      this.setToolbarButtonVisibility = (buttonId, visible) => {
        setToolbarButtonVisibility(buttonId, visible);
      };

      /**
       * Called when user clicks a button in the content
       * area header's menubar
       * @param event
       */
      this.contentAreaHeaderButtonClickHandler = (event) => {
        switch(event.currentTarget.id) {
          case 'home': {
            if (!self.i18n.toolbar.buttons.home.disabled()) {
              viewParams.onToolbarButtonClicked({id: 'home'});
              // Go to "Home" page
              viewParams.parentRouter.go('home');
            }
          }
            break;
          default:
            break;
        }
      };

      this.contentAreaHeaderIconClickHandler = (event) => {
        const options = {id: event.currentTarget.id};
        switch(options.id) {
          case 'tips-iconbar-icon':
          case 'recent-iconbar-icon':
          case 'projectmanagement-iconbar-icon':
          case 'shoppingcart-iconbar-icon':
            ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
              .then(reply => {
                if (reply) {
                  if (options.id === 'recent-iconbar-icon') {
                    const toggleState = toggleToolbarButtonState(options.id);
                    if (CoreUtils.isNotUndefinedNorNull(toggleState)) {
                      options['data-state'] = toggleState;
                      const iconId = options.id.replace('-iconbar-icon', '');
                      self.i18n.toolbar.icons[iconId].iconFile(toggleState === 'expanded' ? 'toggle-beanpath-history-off-blk_24x24' : 'toggle-beanpath-history-on-blk_24x24');
                      viewParams.onToolbarButtonToggled(options);
                    }
                  }
                }
              })
              .catch(failure => {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              });
            break;
          default:
            break;
        }
      };

      function setToolbarButtonDisabledState(buttonId, state) {
        self.i18n.toolbar.buttons[buttonId].disabled(state);
      }

      function setToolbarButtonVisibility(buttonId, visible) {
        self.i18n.toolbar.buttons[buttonId].visible(visible);
      }

      function setToolbarIconVisibility(buttonId, visible) {
        self.i18n.toolbar.icons[buttonId].visible(visible);
      }

      function toggleToolbarButtonState(id) {
        let toggleState;
        const ele = document.getElementById(id);
        if (ele !== null) {
          toggleState = ele.getAttribute('data-state');
          toggleState = (toggleState === 'collapsed' ? 'expanded' : 'collapsed');
          ele.setAttribute('data-state', toggleState);
        }
        return toggleState;
      }

    }

    return ContentAreaHeaderButtonsToolbar;
  }
);