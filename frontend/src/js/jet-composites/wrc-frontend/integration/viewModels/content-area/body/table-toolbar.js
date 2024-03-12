/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'wrc-frontend/common/keyup-focuser',
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/types',
  'wrc-frontend/core/utils',
  'ojs/ojlogger',
  'ojs/ojknockout',
  'ojs/ojcheckboxset'
],
  function (
    oj,
    ko,
    KeyUpFocuser,
    PerspectiveMemoryManager,
    ViewModelUtils,
    Runtime,
    CoreTypes,
    CoreUtils,
    Logger
  ) {
    function TableToolbar(viewParams) {
      const self = this;

      // Need perspective declared here, because
      // expression in table.html refers to it
      this.perspective = viewParams.perspective;

      this.i18n = {
        buttons: {
          'new': { id: 'new', iconFile: 'new-icon-blk_24x24', disabled: false, visible: ko.observable(true),
            label: oj.Translations.getTranslatedString('wrc-table-toolbar.buttons.new.label')
          },
          'write': { id: 'write', iconFile: 'write-wdt-model-blk_24x24', disabled: false, visible: ko.observable(true),
            label: ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.write.label'))
          },
          'clone': { id: 'clone', iconFile: 'clone-icon-blk_24x24', disabled: true,
            label: oj.Translations.getTranslatedString('wrc-table-toolbar.buttons.clone.label')
          },
          'delete': { id: 'delete', iconFile: 'delete-icon-blk_24x24', disabled: true,
            label: oj.Translations.getTranslatedString('wrc-table-toolbar.buttons.delete.label')
          },
          'customize': { id: 'customize', iconFile: 'table-customizer-icon-blk_24x24',
            label: oj.Translations.getTranslatedString('wrc-table-toolbar.buttons.customize.label')
          },
          'dashboard': { id: 'dashboard', iconFile: 'custom-view-icon-blk_24x24', disabled: false, visible: ko.observable(false),
            label: ko.observable()
          }
        },
        icons: {
          'landing': { iconFile: 'landing-page-icon-blk_24x24', visible: ko.observable(Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name),
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.landing.tooltip')
          },
          'history': { iconFile: 'beanpath-history-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.history.tooltip')
          },
          'instructions': { iconFile: 'toggle-instructions-on-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.instructions.tooltip')
          },
          'help': { iconFile: 'toggle-help-on-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.help.tooltip')
          },
          'sync': { iconFile: ko.observable('sync-off-icon-blk_24x24'),
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.sync.tooltip'),
            tooltipOn: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.sync.tooltipOn')
          },
          'syncInterval': { iconFile: 'sync-interval-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.syncInterval.tooltip')
          },
          'separator': {
            iconFile: 'separator-vertical_10x24',
            tooltip: oj.Translations.getTranslatedString('wrc-perspective.icons.separator.tooltip')
          }
        },
        menus: {
          history: {
            'clear': {
              id: 'clear-history',
              iconFile: 'erase-icon-blk_24x24',
              disabled: false,
              value: oj.Translations.getTranslatedString('wrc-perspective.menus.history.clear.value'),
              label: oj.Translations.getTranslatedString('wrc-perspective.menus.history.clear.label')
            }
          }
        },
        instructions: {
          'selectItems': {
            value: oj.Translations.getTranslatedString('wrc-table-toolbar.instructions.selectItems.value', '{0}')
          }
        }
      };

      this.showHelp = ko.observable(false);

      // This instance-scope variable is used to determine which
      // sync-<state>-icon-blk_24x24.png is assigned to the
      // <img id="sync-icon">
      this.autoSyncEnabled = ko.observable(false);
      this.showAutoSyncIcons = ko.observable(true);

      // This instance-scope variable is used to remember and
      // recall the value of the auto-sync interval
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(self.perspective.id);
      this.showInstructions = ko.observable(true);
      this.showBeanPathHistory = ko.observable(this.perspectiveMemory.beanPathHistory.visibility);

      this.signalBindings=[];
      this.readonly = ko.observable();

      this.connected = function () {
        function setIsReadOnlyRuntimeProperty() {
          const rdjData = viewParams.parentRouter.data.rdjData();
          const isNonCreatableCollection = rdjData.self.kind === 'nonCreatableCollection';
          Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, isNonCreatableCollection || !['configuration','modeling','properties','security'].includes(viewParams.perspective.id));
          self.readonly(Runtime.isReadOnly());
        }

        setIsReadOnlyRuntimeProperty();

        const label = oj.Translations.getTranslatedString(`wrc-common.buttons.${ViewModelUtils.isElectronApiAvailable() ? 'savenow' : 'write'}.label`);
        self.i18n.buttons.write.label(label);
        self.i18n.buttons.write.visible(Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name && ['modeling','properties'].includes(self.perspective.id));
        self.i18n.buttons.new.visible(['configuration','modeling','security','properties'].includes(self.perspective.id));

        let binding = viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
        });

        self.signalBindings.push(binding);

        // Get auto-sync interval from perspectiveMemory
        const syncInterval = self.perspectiveMemory.contentPage.syncInterval;
        if (syncInterval !== null) {
          const ele = document.getElementById('sync-icon');
          if (ele !== null) ele.setAttribute('data-interval', syncInterval);
        }

        binding = viewParams.signaling.autoSyncCancelled.add(autoSyncCancelledCallback);

        self.signalBindings.push(binding);

        this.renderToolbarButtons();
      };

      this.disconnected = function () {
        KeyUpFocuser.unregister('.cfe-content-area-body-iconbar-icon');
        // autoSyncCancelled is for stopping auto-sync when the user presses the
        // "Disconnect" icon in the toolbar icon of domain.js, or
        // the CFE notices that the CBE process is stopped.
        viewParams.signaling.autoSyncCancelled.remove(autoSyncCancelledCallback);

        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });
        self.signalBindings = [];
      };

      this.registerTableIconbarIconsKeyUpFocuser = (id) => {
        let result = KeyUpFocuser.getKeyUpCallback(id);
    
        if (!result.alreadyRegistered) {
          result = KeyUpFocuser.register(
            id,
            {
              Enter: {key: 'Enter', action: 'select', callback: onKeyUpFocuserActionSelect}
            },
            {}
          );
        }
    
        return result.keyUpCallback;
      };
  
      function onKeyUpFocuserActionSelect(event) {
        function simulateHelpIconClickEvent(event) {
          const link = document.querySelector(`#${event.target.id} > a`);
          if (link !== null) {
            event.preventDefault();
            const event1 = new Event('click', {bubbles: true});
            link.dispatchEvent(event1);
          }
        }
  
        function simulateSyncIconClickEvent(node) {
          event.preventDefault();
          const attr = node.attributes['data-interval'];
          if (CoreUtils.isNotUndefinedNorNull(attr)) {
            handleSyncIconEvent(node);
          }
        }
  
        const firstElementChild = event.target.firstElementChild.firstElementChild;
        const iconId = firstElementChild.getAttribute('id');
    
        switch (iconId) {
          case 'landing-page-icon':
            self.landingPageClick(event);
            break;
          case 'toggle-history':
            self.toggleHistoryClick(event);
            break;
          case 'page-help-icon':
            simulateHelpIconClickEvent(event);
            break;
          case 'sync-icon':
            simulateSyncIconClickEvent(firstElementChild);
            break;
          case 'sync-interval-icon':
            self.syncIntervalClick(event);
            break;
        }
      }

      function resetIconsVisibleState(state) {
        self.showAutoSyncIcons(state);
      }

      this.isHistoryVisible = function() {
        return viewParams.isHistoryVisible();
      };
  
      this.renderToolbarButtons =  function () {
        const rdjData = viewParams.parentRouter?.data?.rdjData();
        const isDashboard = (self.perspective.id === 'monitoring' && CoreUtils.isNotUndefinedNorNull(rdjData?.dashboardCreateForm));
        if (isDashboard) {
          self.i18n.buttons.dashboard.label(rdjData?.dashboardCreateForm?.label);
        }
        self.i18n.buttons.dashboard.visible(isDashboard);
        resetIconsVisibleState(self.perspective.id === 'monitoring');
      }.bind(this);

      this.toggleHistoryClick = function (event) {
        const withHistoryVisible = !self.showBeanPathHistory();
        // Call function in table.js with negation of value
        // assigned to the knockout observable.
        viewParams.onBeanPathHistoryToggled(withHistoryVisible);
        // Set knockout observable to value returned from
        // onBeanPathHistoryToggled() function in table.js
        self.showBeanPathHistory(withHistoryVisible);
      };

      this.landingPageClick = function (event) {
        viewParams.onLandingPageSelected();
      };

      this.toggleInstructionsClick = function (event) {
        const instructionsVisible = !self.showInstructions();
        self.showInstructions(instructionsVisible);
        viewParams.onInstructionsToggled(instructionsVisible, self.showBeanPathHistory());
      };

      this.helpPageClick = function (event) {
        const helpVisible = !self.showHelp();
        self.showHelp(helpVisible);
        viewParams.onHelpPageToggled(helpVisible);
      };
  
      function handleSyncIconEvent(node) {
        const attr = node.attributes['data-interval'];
        if (CoreUtils.isNotUndefinedNorNull(attr)) {
          const autoSyncEnabled = self.autoSyncEnabled();
          let syncInterval = 0;
          if (CoreUtils.isNotUndefinedNorNull(attr.value)) {
            // Get sync interval from the "data-interval" attribute
            syncInterval = parseInt(attr.value);
          }
          if (syncInterval === 0) {
            // Just reload and ensure the sync state is not running
            if (autoSyncEnabled) {
              self.autoSyncEnabled(false);
            }
          }
          else {
            // Toggle the sync state and no interval when currently enabled
            self.autoSyncEnabled(!autoSyncEnabled);
            if (autoSyncEnabled) syncInterval = 0;
          }
          setAutoSyncIcon();
          viewParams.onSyncClicked(syncInterval);
        }
      }
  
      this.syncClick = function (event) {
        const attr = event.target.attributes['data-interval'];
        if (CoreUtils.isNotUndefinedNorNull(attr)) {
          handleSyncIconEvent(event.target);
        }
      };

      this.syncIntervalClick = function (event) {
        // Get <img id="sync-icon"> DOM element
        const ele = document.getElementById('sync-icon');
        // Get numeric representation of "data-interval"
        // attribute of DOM element.
        const currentValue = parseInt(ele.getAttribute('data-interval'));
        // Call function defined in table.js that returns a Promise, passing
        // in the numeric representation of current sync interval.
        viewParams.onSyncIntervalClicked(currentValue)
          .then((result) => {
            self.perspectiveMemory.contentPage.syncInterval = result.interval;
            // Update attributes of <img id="sync-icon"> DOM element
            ele.setAttribute('data-interval', result.interval);
            let syncInterval = parseInt(result.interval);
            if (syncInterval > 0) {
              self.autoSyncEnabled(true);
            }
            else {
              self.autoSyncEnabled(false);
            }
            setAutoSyncIcon();
          })
          .catch((cancel) => {
            // Change of the interval value was cancelled
            setAutoSyncIcon();
          });
      };

      function setAutoSyncIcon() {
        // Change tooltip to let end user know the state
        let syncIconElement = document.getElementById('sync-icon');
        if (syncIconElement !== null) {
          syncIconElement.setAttribute('title', (self.autoSyncEnabled() ? self.i18n.icons.sync.tooltipOn : self.i18n.icons.sync.tooltip));
          self.i18n.icons.sync.iconFile(self.autoSyncEnabled() ? 'bouncing-icon-blk_24x38' : 'sync-off-icon-blk_24x38');
        }
      }

      this.cancelAutoSync = function () {
        self.autoSyncEnabled(false);
        setAutoSyncIcon();
      }.bind(this);

      function autoSyncCancelledCallback(source, newSyncInterval) {
        if (self.autoSyncEnabled()) {
          viewParams.onSyncClicked(0);
        }
        self.autoSyncEnabled(false);
      }

      this.newAction = function (event) {
        if (self.showBeanPathHistory()) {
          const withHistoryVisible = viewParams.onBeanPathHistoryToggled(false);
          self.showBeanPathHistory(withHistoryVisible);
        }
        viewParams.newAction(event);
      };

      this.writeContentFileAction = function (event) {
        viewParams.onWriteContentFile('download');
      };

      this.customizeAction = (event) => {
        viewParams.onCustomizeButtonClicked(event);
      };

      this.dashboardAction = (event) => {
        if (self.showBeanPathHistory()) {
          const withHistoryVisible = viewParams.onBeanPathHistoryToggled(false);
          self.showBeanPathHistory(withHistoryVisible);
        }
        viewParams.onDashboardButtonClicked(event);
      };
    }

    return TableToolbar;
  }
);