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

      const ITEM_SELECTED_BACKGROUND_COLOR = ViewModelUtils.getCustomCssProperty('ancillary-content-item-title-bkgd-color');

      this.i18n = {
        toolbar: {
          buttons: {
            home: {
              id: 'home', image: 'home-icon-blk_24x24', disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.toolbar.buttons.home.label')
            }
          },
          icons: {
            'recent': {
              id: 'recent-pages', iconFile: ko.observable('toggle-beanpath-history-on-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-common.tooltips.recentPages.value')
            },
            'providermanagement': {
              id: 'provider-management', iconFile: 'project-management-blk_24x24', disabled: ko.observable(false), visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.projectmanagement.label')
            },
            tips: {
              id: 'tips', iconFile: 'tips-icon-blk_24x24', disabled: ko.observable(false), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.tips.label')
            },
            ataglance: {
              id: 'ataglance', iconFile: 'ataglance-tabstrip-icon_24x24', disabled: ko.observable(true), visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.ataglance.label')
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

        binding = viewParams.signaling.ancillaryContentItemToggled.add((source, changedState) => {
          function handleIconItemChangedState(changedState) {
            const dialog = document.getElementById(`${changedState.id}-dialog`);

            if (dialog !== null) {
              setToolbarButtonToggleState(changedState);

              switch (changedState.state) {
                case 'opened':
                  removeDialogHeaderTitleNode(dialog);
                  setDialogPosition(dialog);
                  dialog.open(`#${changedState.id}-iconbar-icon`);
                  break;
                case 'closed':
                  dialog.close();
                  break;
              }
            }
          }

          handleIconItemChangedState(changedState);
        });

        self.signalBindings.push(binding);

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
          case 'home':
            ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
              .then(reply => {
                if (reply) {
                  if (!self.i18n.toolbar.buttons.home.disabled()) {
                    viewParams.onToolbarButtonClicked({id: 'home'});
                    // Go to "Home" page
                    viewParams.parentRouter.go('home');
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

      this.contentAreaHeaderIconClickHandler = (event) => {
        const iconId = event.currentTarget.id;
        switch (iconId) {
          case 'recent-pages-iconbar-icon':
          case 'provider-management-iconbar-icon':
          case 'tips-iconbar-icon':
          case 'ataglance-iconbar-icon':
            ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
              .then(reply => {
                if (reply) {
                  // Remove suffix from linkId used to ensure it
                  // is unique within the DOM.
                  const changedState = {id: iconId.replace('-iconbar-icon', '')};
                  // Get the toggled (not current) state for the
                  // iconbar icon.
                  const toggleState = getToolbarButtonToggleState(changedState.id);
                  // Only do something if toggleState.value is not undefined
                  if (CoreUtils.isNotUndefinedNorNull(toggleState.value)) {
                    // Update changedState with toggled state
                    changedState['state'] = toggleState.value;
                    // Need different handling if iconbar id is recent-pages
                    if (changedState.id === 'recent-pages') {
                      // Swap the iconFile to indicated the new
                      self.i18n.toolbar.icons.recent.iconFile(toggleState.value === 'visible' ? 'toggle-beanpath-history-off-blk_24x24' : 'toggle-beanpath-history-on-blk_24x24');
                      setToolbarButtonToggleState(changedState);
                      viewParams.onToolbarButtonToggled(changedState);
                    }
                    else {
                      viewParams.signaling.ancillaryContentItemSelected.dispatch('buttons-toolbar', changedState.id);
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

      function removeDialogHeaderTitleNode(dialog) {
        const nodeList = document.querySelectorAll(`#${dialog.id} > div.oj-dialog-container > div.oj-dialog-header`);
        if (nodeList !== null) {
          let arr = Array.from(nodeList);
          for (let i in arr.reverse()) {
            nodeList[i].remove();
          }
        }
      }

      function setDialogPosition(dialog) {
        dialog.setProperty('position.of', '#provider-management-iconbar-icon');
        dialog.setProperty('position.at.horizontal', 'right');
        dialog.setProperty('position.at.vertical', 'bottom');
        dialog.setProperty('position.my.vertical', 'top');
      }

      function setToolbarButtonDisabledState(buttonId, state) {
        self.i18n.toolbar.buttons[buttonId].disabled(state);
      }

      function setToolbarButtonVisibility(buttonId, visible) {
        self.i18n.toolbar.buttons[buttonId].visible(visible);
      }

      function setToolbarIconVisibility(buttonId, visible) {
        self.i18n.toolbar.icons[buttonId].visible(visible);
      }

      function getToolbarButtonToggleState(iconId) {
        const toggleState = {previousValue: undefined, value: undefined};
        const link = document.getElementById(`${iconId}-iconbar-icon`);
        if (link !== null) {
          toggleState.previousValue = link.getAttribute('data-state');
          if (iconId === 'recent-pages') {
            toggleState.value = (toggleState.previousValue === 'collapsed' ? 'expanded' : 'collapsed');
          }
          else {
            toggleState.value = (toggleState.previousValue === 'closed' ? 'opened' : 'closed');
          }
        }
        return toggleState;
      }

      function setToolbarButtonToggleState(changedState) {
        const link = document.getElementById(`${changedState.id}-iconbar-icon`);
        if (link !== null) {
          const toggleState = {value: link.getAttribute('data-state')};
          if (toggleState.value !== changedState.state) {
            link.setAttribute('data-state', changedState.state);
            link.style['background-color'] = (toggleState.value === 'closed' ? ITEM_SELECTED_BACKGROUND_COLOR : 'unset');
          }
        }
      }

    }

    return ContentAreaHeaderButtonsToolbar;
  }
);