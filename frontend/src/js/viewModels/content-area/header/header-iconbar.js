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
    'wrc-frontend/microservices/perspective/perspective-memory-manager',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/types',
    'wrc-frontend/core/utils',
    'ojs/ojknockout'
  ],
  function (
    oj,
    ko,
    PerspectiveMemoryManager,
    ViewModelUtils,
    Runtime,
    CoreTypes,
    CoreUtils
  ) {
    function ContentAreaHeaderIconbar(viewParams) {
      const self = this;

      const ITEM_SELECTED_BACKGROUND_COLOR = ViewModelUtils.getCustomCssProperty('ancillary-content-item-title-bkgd-color');

      this.i18n = {
        icons: {
          'providermanagement': {
            id: 'provider-management', iconFile: 'project-management-blk_24x24', disabled: ko.observable(false), visible: ko.observable(true),
            label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.projectmanagement.label')
          },
          ataglance: {
            id: 'ataglance', iconFile: 'ataglance-tabstrip-icon_24x24', disabled: ko.observable(false), visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.ataglance.label')
          }
        },
        shortcuts: {
          dashboards: {
            id: 'dashboards', iconFile: 'dashboards-tabstrip-icon_24x24', disabled: ko.observable(false), visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.dashboards.label')
          }
        }
      };

      this.readonly = ko.observable();
      this.perspectiveMemory = undefined;

      this.signalBindings = [];

      this.connected = function () {
        self.readonly(Runtime.isReadOnly());

        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          const disabled = ([CoreTypes.Console.RuntimeMode.DETACHED.name, CoreTypes.Console.RuntimeMode.UNATTACHED.name].includes(newMode));
        });

        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.backendConnectionLost.add(() => {
          self.setShortcutIconVisibility('dashboards', false);
        });
  
        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            self.setShortcutIconVisibility('dashboards', false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });
        
        this.signalBindings.push(binding);
        
        binding = viewParams.signaling.ancillaryContentItemToggled.add((source, changedState, options) => {
          function handleIconItemChangedState(changedState) {
            const dialog = document.getElementById(`${changedState.id}-dialog`);
            
            if (dialog !== null) {
              setIconbarIconToggleState(changedState);
              
              switch (changedState.state) {
                case 'opened':
                  removeDialogHeaderTitleNode(dialog);
                  setDialogPosition(dialog, options);
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
        
        binding = viewParams.signaling.navtreeRootNodeAdded.add((rootNode, beanTree) => {
          const visible = (rootNode.name === 'Dashboards' && rootNode.expandable);
          
          self.setShortcutIconVisibility('dashboards', visible);
          
          if (visible) {
            const ele = document.getElementById('dashboards-iconbar-icon');
            if (ele !== null) {
              ele.setAttribute('data-resource-data', rootNode.resourceData.resourceData);
              ele.setAttribute('data-beantree-type', beanTree.type);
            }
          }
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
        self.signalBindings.forEach(binding => {
          binding.detach();
        });
        
        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
        
      }.bind(this);
      
      this.contentAreaHeaderIconClickHandler = (event) => {
        const iconId = event.currentTarget.id;
        switch (iconId) {
          case 'provider-management-iconbar-icon':
          case 'ataglance-iconbar-icon':
            ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
              .then(reply => {
                if (reply) {
                  const changedState = {id: iconId.replace('-iconbar-icon', '')};
                  viewParams.signaling.ancillaryContentItemSelected.dispatch('buttons-toolbar', changedState.id, {stealthEnabled: false});
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

      this.contentAreaHeaderShortcutClickHandler = (event) => {
        const iconId = event.currentTarget.id;
        if (iconId === 'dashboards-iconbar-icon') {
          onDashboardShortcutClicked(event);
        }
      };

      this.setIconbarIconVisibility = (iconId, visible) => {
        self.i18n.icons[iconId].visible(visible);
      };

      this.setShortcutIconVisibility = (iconId, visible) => {
        self.i18n.shortcuts[iconId].visible(visible);
      };
  
      function getIconbarIconToggleState(iconId) {
        const toggleState = {previousValue: undefined, value: undefined};
        const link = document.getElementById(`${iconId}-iconbar-icon`);
        if (link !== null) {
          toggleState.previousValue = link.getAttribute('data-state');
          toggleState.value = (toggleState.previousValue === 'closed' ? 'opened' : 'closed');
        }
        return toggleState;
      }
  
      function setIconbarIconToggleState(changedState) {
        const link = document.getElementById(`${changedState.id}-iconbar-icon`);
        if (link !== null) {
          const toggleState = {value: link.getAttribute('data-state')};
          if (toggleState.value !== changedState.state) {
            link.setAttribute('data-state', changedState.state);
            link.style['background-color'] = (toggleState.value === 'closed' ? ITEM_SELECTED_BACKGROUND_COLOR : 'unset');
          }
        }
      }

      function onDashboardShortcutClicked(event) {
        const resourceData = event.currentTarget.attributes['data-resource-data'].value;
        const beanTreeType = event.currentTarget.attributes['data-beantree-type'].value;
        const path = encodeURIComponent(resourceData);
        ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/${beanTreeType}/${path}`, self.canExitCallback);
      }

      function removeDialogHeaderTitleNode(dialog) {
        const nodeList = document.querySelectorAll(`#${dialog.id} > div.oj-dialog-container > div.oj-dialog-header`);
        if (nodeList !== null) {
          let arr = Array.from(nodeList);
          for (let i in arr.reverse()) {
            nodeList[i].remove();
          }
        }
      }

      function setDialogPosition(dialog, options) {
        const dataPositionOf = (CoreUtils.isNotUndefinedNorNull(options) && CoreUtils.isNotUndefinedNorNull(options.positionOf) ? options.positionOf : '#provider-management-iconbar-icon');
        dialog.setProperty('position.of', dataPositionOf);
        dialog.setProperty('position.at.horizontal', 'right');
        dialog.setProperty('position.at.vertical', 'bottom');
        dialog.setProperty('position.my.vertical', 'top');
      }

    }

    return ContentAreaHeaderIconbar;
  }
);