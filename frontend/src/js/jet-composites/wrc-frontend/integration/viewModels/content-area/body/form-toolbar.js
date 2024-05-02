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
  'wrc-frontend/microservices/change-management/change-manager',
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
    ChangeManager,
    ViewModelUtils,
    Runtime,
    CoreTypes,
    CoreUtils,
    Logger
  ) {
    function FormToolbar(viewParams) {
      const self = this;

      this.perspective = viewParams.perspective;

      this.i18n = {
        ariaLabel: {
          icons: {
            landing: {value: oj.Translations.getTranslatedString('wrc-common.ariaLabel.icons.landing.value')}
          }
        },
        buttons: {
          'save': { id: 'save', iconFile: ko.observable('save-icon-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
            label: ko.observable(oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.save.label'))
          },
          'write': { id: 'write', iconFile: 'write-wdt-model-blk_24x24', disabled: false, visible: ko.observable(false),
            label: ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.write.label'))
          },
          'new': { id: 'new', iconFile: 'add-icon-blk_24x24', disabled: false,
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.new.label')
          },
          'delete': { id: 'delete', iconFile: 'remove-icon-blk_24x24', disabled: false,
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.delete.label')
          },
          'back': { id: 'back', iconFile: 'back-icon-blk_24x24', disabled: ko.observable(true),
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.back.label')
          },
          'next': { id: 'next', iconFile: 'next-icon-blk_24x24', disabled: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.next.label')
          },
          'finish': { id: 'finish', iconFile: 'add-icon-blk_24x24', disabled: ko.observable(true),
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.finish.label')
          },
          'cancel': { id: 'cancel', iconFile: 'cancel-icon-blk_24x24', disabled: false, visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
          },
          'customize': { id: 'customize', iconFile: 'table-customizer-icon-blk_24x24', disabled: false, visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.customize.label')
          },
          'dashboard': { id: 'dashboard', iconFile: 'custom-view-icon-blk_24x24', disabled: false, visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.dashboard.label')
          }
        },
        icons: {
          'save': { id: 'save', iconFile: 'save-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.save.tooltip')
          },
          'submit': { id: 'submit', iconFile: 'submit-changes-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.submit.value')
          },
          'write': { id: 'write', iconFile: 'write-wdt-model-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.write.value')
          },
          'create': { id: 'create', iconFile: 'add-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.create.tooltip')
          },
          'landing': { iconFile: 'landing-page-icon-blk_24x24', visible: ko.observable(Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name),
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.landing.tooltip')
          },
          'history': { iconFile: 'beanpath-history-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.history.tooltip')
          },
          'instructions': { iconFile: 'toggle-instructions-on-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.instructions.tooltip')
          },
          'help': { iconFile: 'toggle-help-on-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.help.tooltip')
          },
          'reset': { iconFile: 'action-reset-icon-blk_24x24', visible: ko.observable(false),
            tooltip: oj.Translations.getTranslatedString('wrc-common.ariaLabel.icons.reset.value')
          },
          'sync': { iconFile: ko.observable('sync-off-icon-blk_24x24'),
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.sync.tooltip'),
            tooltipOn: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.sync.tooltipOn')
          },
          'syncInterval': { iconFile: 'sync-interval-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.syncInterval.tooltip')
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
        }
      };

      this.showHelp = ko.observable(false);

      this.toolbarButton = '';
      this.isWizardForm = ko.observable(viewParams.isWizardForm());
      this.createFormMode = ko.observable(viewParams.createFormMode());

      // This instance-scope variable is used to determine which
      // sync-<state>-icon-blk_24x24.png is assigned to the
      // <img id="sync-icon">
      this.autoSyncEnabled = ko.observable(false);
      this.showAutoSyncIcons = ko.observable(true);

      // This instance-scope variable is used to remember and
      // recall the value of the auto-sync interval.
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(self.perspective.id);
      this.showInstructions = ko.observable(true);
      this.showBeanPathHistory = ko.observable(this.perspectiveMemory.beanPathHistory.visibility);

      this.signalBindings=[];
      this.readonly = ko.observable();
      this.sliceReadOnly = ko.observable();

      this.connected = function () {
        function setIsReadOnlyRuntimeProperty(pdjData) {
          const isReadOnly = !pdjData.createForm && (pdjData.sliceForm?.readOnly === true || pdjData.sliceTable !== undefined);
          self.sliceReadOnly(isReadOnly);
          Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, !['configuration','modeling','properties','security'].includes(self.perspective.id));
          self.readonly(Runtime.isReadOnly());
        }

        const pdjData = viewParams.parentRouter.data.pdjData();

        setIsReadOnlyRuntimeProperty(pdjData);
        const renderToolbarButtonsEventType = (!pdjData.createForm) ? 'sync' : 'create';

        const label = (ViewModelUtils.isElectronApiAvailable() ? 'savenow' : 'write');
        self.i18n.buttons.write.label(oj.Translations.getTranslatedString(`wrc-common.buttons.${label}.label`));

        let binding = viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          if (['modeling','properties','configuration','security'].includes(self.perspective.id)) {
            setToolbarButtonsVisibility('save', (!newRO ? 'inline-flex' : 'none'));
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.formSliceSelected.add((selectedSlice) => {
          if (self.perspective.id === 'monitoring') {
            let visible = false;

            if (CoreUtils.isNotUndefinedNorNull(selectedSlice.current)) {
              visible = (selectedSlice.current.selection() === 'Edit' || selectedSlice.current.selection() === 'Criteria' || selectedSlice.current.selection() === 'Filters');
            }
            self.sliceReadOnly(!visible);
            self.i18n.buttons.save.visible(visible);
            this.resetIconsVisibleState(!visible);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.nonwritableChanged.add((newRO) => {
          self.sliceReadOnly(newRO);
          if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name &&
            self.perspective.id !== 'modeling'
          ) {
            self.i18n.buttons.save.visible(!newRO);
          }
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

        // Get value of changeManager properties asynchronously.
        ChangeManager.getLockState()
          .then((data) => {
            self.renderToolbarButtons(renderToolbarButtonsEventType);
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          })
          .finally(() => {
            self.showBeanPathHistory(self.perspectiveMemory.beanPathHistory.visibility);
            self.showInstructions(self.perspectiveMemory.instructions.visibility);
          });
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

      this.registerFormIconbarIconsKeyUpFocuser = (id) => {
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

      this.resetIconKeyUp = (event) => {
        if (event.key === 'Enter') {
          simulateSyncIconClickEvent(event.currentTarget.firstElementChild);
        }
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

      this.resetIconsVisibleState = function(state) {
        self.showAutoSyncIcons(state);
      };

      this.isHistoryVisible = function() {
        return viewParams.isHistoryVisible();
      };

      this.resetButtonsDisabledState = function (buttons) {
        buttons.forEach((button) => {
          self.i18n.buttons[button.id].disabled(button.disabled);
        });
      };

      function simulateSyncIconClickEvent(node) {
        event.preventDefault();
        const attr = node.attributes['data-interval'];
        if (CoreUtils.isNotUndefinedNorNull(attr)) {
          handleSyncIconEvent(node);
        }
      }

      function resetSaveButtonDisplayState(buttons) {
        buttons.forEach((button) => {
          self.i18n.buttons.save.label(self.i18n.icons[button.id].tooltip);
          self.i18n.buttons.save.iconFile(self.i18n.icons[button.id].iconFile);
        });
      }

      this.renderToolbarButtons = async function (eventType, hasNonReadOnlyFields) {
        let buttonId;
        if ((['modeling','properties','configuration','security'].includes(self.perspective.id)) && !self.readonly()) {
          const renderingInfo = await viewParams.onToolbarRendering(eventType);
          buttonId = ((eventType === 'update' || renderingInfo.mode === 'save') && ['modeling','properties'].includes(self.perspective.id) ? 'write' : renderingInfo.mode);

          resetSaveButtonDisplayState([{id: buttonId}]);

          self.i18n.buttons.save.visible(buttonId !== 'write');
          self.i18n.buttons.cancel.visible(buttonId === 'create');
          self.i18n.buttons.write.visible(buttonId !== 'create' && ['modeling','properties'].includes(self.perspective.id) && Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name);

          toggleToolbarIconsVisibility(buttonId !== 'create');

          if (renderingInfo.kind === 'creatableOptionalSingleton') {
            if (eventType === 'create') {
              // "Save" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('save', (renderingInfo.formDataExists ? 'inline-flex' : 'none'));
              // "New" button is invalid for pendingEventType value, so hide it
              setToolbarButtonsVisibility('new', 'none');
              // "Delete" button is invalid for pendingEventType value, so hide it
              setToolbarButtonsVisibility('delete', 'none');
            }
            else if (eventType === 'discard') {
              // Need to show a blank form if discard happened after clicking the "New" button
              if (self.toolbarButton === 'new') showBlankForm();
              hasNonReadOnlyFields = (typeof hasNonReadOnlyFields !== 'undefined' ? hasNonReadOnlyFields : false);
              // "Save" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('save', (hasNonReadOnlyFields ? 'inline-flex' : 'none'));
              // "New" button is invalid for pendingEventType value, so hide it
              setToolbarButtonsVisibility('new', (!hasNonReadOnlyFields ? 'inline-flex' : 'none'));
              // "Delete" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('delete', (hasNonReadOnlyFields ? 'inline-flex' : 'none'));
              // Allow for the tab strip to be displayed again
              if (hasNonReadOnlyFields) allowTabStrip();
            }
            else if (eventType === 'commit') {
              hasNonReadOnlyFields = (typeof hasNonReadOnlyFields !== 'undefined' ? hasNonReadOnlyFields : false);
              // "Save" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('save', (hasNonReadOnlyFields ? 'inline-flex' : 'none'));
              // "New" button is invalid for pendingEventType value, so hide it
              setToolbarButtonsVisibility('new', (!hasNonReadOnlyFields ? 'inline-flex' : 'none'));
              // "Delete" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('delete', (hasNonReadOnlyFields ? 'inline-flex' : 'none'));
              // Allow for the tab strip to be displayed again
              if (hasNonReadOnlyFields) allowTabStrip();
            }
            else {
              // "Save" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('save', (renderingInfo.formDataExists ? 'inline-flex' : 'none'));
              // "New" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('new', (!renderingInfo.formDataExists ? 'inline-flex' : 'none'));
              // "Delete" button is valid for pendingEventType value, so show or hide it
              setToolbarButtonsVisibility('delete', (renderingInfo.formDataExists ? 'inline-flex' : 'none'));
              // Allow for the tab strip to be displayed again
              if (renderingInfo.formDataExists) allowTabStrip();
            }
          }
          else if (renderingInfo.kind === 'nonCreatableOptionalSingleton') {
            // "Save" button is valid for kind value, so show it only when there is RDJ data
            let display = 'inline-flex';
            if (CoreUtils.isUndefinedOrNull(viewParams.parentRouter.data.rdjData().data)) {
              display = 'none';
            }
            setToolbarButtonsVisibility('save', display);
            // "New" button is invalid for kind value, so hide it
            setToolbarButtonsVisibility('new', 'none');
            // "Delete" button is invalid for kind value, so hide it
            setToolbarButtonsVisibility('delete', 'none');
          }
          else {
            // "Save" button is valid for kind value, so show it
            setToolbarButtonsVisibility('save', 'inline-flex');
            // "New" button is invalid for kind value, so hide it
            setToolbarButtonsVisibility('new', 'none');
            // "Delete" button is invalid for kind value, so hide it
            setToolbarButtonsVisibility('delete', 'none');
          }

          if (eventType === 'delete') showBlankForm();
        }
        else if (self.perspective.id === 'monitoring') {
          const rdjData = viewParams.parentRouter?.data?.rdjData();
          const pdjData = viewParams.parentRouter?.data?.pdjData();
          if (CoreUtils.isNotUndefinedNorNull(rdjData?.dashboardCreateForm)) {
            if (CoreUtils.isNotUndefinedNorNull(pdjData?.sliceTable?.readOnly)) {
              self.i18n.buttons.dashboard.visible(pdjData.sliceTable.readOnly);
            }
            else if (CoreUtils.isNotUndefinedNorNull(pdjData?.sliceForm?.readOnly)) {
              self.i18n.buttons.dashboard.visible(pdjData.sliceForm.readOnly);
            }
            else {
              buttonId = 'save';
            }
          }
          else if (rdjData?.navigation === 'Dashboards' && eventType === 'create') {
            buttonId = 'create';
          }
          if (CoreUtils.isNotUndefinedNorNull(buttonId)) {
            showDashboardToolbarButtons(buttonId);
          }
        }

        this.resetIconsVisibleState(self.perspective.id === 'monitoring');
        showResetPageIcon(['configuration'].includes(self.perspective.id));

      }.bind(this);

      function showBlankForm(){
        const ele = document.getElementById('cfe-form');
        if (ele !== null) ele.style.display = 'none';
        viewParams.onBlankFormDisplayed();
      }

      function allowTabStrip(){
        const eleTabs = document.getElementById('cfe-form-tabstrip-container');
        if (eleTabs !== null) eleTabs.style = '';
      }

      function setToolbarButtonsVisibility(button, displayValue) {
        let ele = null;
        switch (button) {
          case 'save':
            ele = document.getElementById('form-toolbar-save-button');
            break;
          case 'new':
            ele = document.getElementById('form-toolbar-new-button');
            break;
          case 'delete':
            ele = document.getElementById('form-toolbar-delete-button');
            break;
        }
        if (ele !== null) ele.style.display = displayValue;
      }

      function showResetPageIcon(value) {
        self.i18n.icons.reset.visible(value);
      }

      function toggleToolbarButtonsVisibility(visible) {
        const ele = document.getElementById('form-toolbar-buttons');
        if (ele !== null) ele.style.display = (visible ? 'none' : 'inline-flex');
      }

      function toggleToolbarIconsVisibility(visible) {
        let ele = document.getElementById('form-toolbar-icons');
        if (ele !== null) ele.style.visibility = (visible ? 'visible' : 'hidden');
        ele = document.getElementById('page-help-toolbar-icon');
        if (ele !== null) ele.style.visibility = 'visible';
      }

      this.toggleHistoryClick = function (event) {
        const withHistoryVisible = !self.showBeanPathHistory();
        // Call function in form.js with negation of value
        // assigned to the knockout observable.
        viewParams.onBeanPathHistoryToggled(withHistoryVisible);
        // Set knockout observable to value returned from
        // onBeanPathHistoryToggled() function in form.js
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
        toggleToolbarButtonsVisibility(helpVisible);
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
        // attribute of DOM element
        const currentValue = parseInt(ele.getAttribute('data-interval'));
        // Call function defined in form.js that returns a Promise, passing
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
            // Change of the interval value was canceled
            setAutoSyncIcon();
          });
      };

      function setAutoSyncIcon() {
        // Change tooltip to let end user know the state
        let syncIconElement = document.getElementById('sync-icon');
        if (syncIconElement !== null) {
          syncIconElement.setAttribute('title', (self.autoSyncEnabled() ? self.i18n.icons.sync.tooltipOn : self.i18n.icons.sync.tooltip));
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

      function showDashboardToolbarButtons(buttonId) {
        resetSaveButtonDisplayState([{id: buttonId}]);
        self.i18n.buttons.save.visible(buttonId === 'create');
        self.i18n.buttons.cancel.visible(buttonId === 'create');
        toggleToolbarIconsVisibility(buttonId !== 'create');
      }

      function supportsDashboardCreation() {
        const rdjData = viewParams.parentRouter.data.rdjData();
        return (rdjData.navigation === 'Dashboards');
      }

      this.newAction = function (event) {
        self.toolbarButton = 'new';
        setToolbarButtonsVisibility('new', 'none');
        viewParams.newAction(event);
      };

      this.cancelAction = function (event) {
        viewParams.cancelAction('cancel');
        if (supportsDashboardCreation()) {
          self.i18n.buttons.save.visible(false);
          self.i18n.buttons.cancel.visible(false);
          toggleToolbarIconsVisibility(true);
          self.i18n.buttons.dashboard.visible(true);
          self.sliceReadOnly(false);
          showResetPageIcon(false);
        }
      };

      this.backAction = function (event) {
        self.toolbarButton = 'back';
        viewParams.rerenderAction(viewParams.parentRouter.data.pdjData(), viewParams.parentRouter.data.rdjData(), 'back');
      };

      this.nextAction = function (event) {
        self.toolbarButton = 'next';
        viewParams.rerenderAction(viewParams.parentRouter.data.pdjData(), viewParams.parentRouter.data.rdjData(), 'next');
      };

      this.finishAction = function (event) {
        self.toolbarButton = 'finish';
        viewParams.signaling.navtreeSelectionCleared.dispatch();
        return viewParams.finishedAction();
      };

      this.deleteAction = function (event) {
        self.toolbarButton = 'delete';
        // clear treenav selection
        viewParams.signaling.navtreeSelectionCleared.dispatch();
        // The "delete" toolbar button is only available for
        // a "creatableOptionalSingleton", so we need to use
        // viewParams.parentRouter.data.rdjData.self.resourceData
        // as the delete uri.
        const uri = viewParams.parentRouter.data.rdjData().self.resourceData;
        viewParams.deleteAction(uri);
      };

      this.dashboardAction = (event) => {
        if (self.showBeanPathHistory()) {
          const withHistoryVisible = viewParams.onBeanPathHistoryToggled(false);
          self.showBeanPathHistory(withHistoryVisible);
        }
        showDashboardToolbarButtons('create');
        self.i18n.buttons.dashboard.visible(false);
        self.sliceReadOnly(false);
        viewParams.onDashboardButtonClicked(event);
      };

      this.onSave = ko.observable(
        function (event) {
          // event.target.id;
          self.toolbarButton = 'save';
          viewParams.onSaveButtonClicked('update');
        }
      );

      this.onUpdateContentFile = ko.observable(
        function (event) {
          // event.target.id;
          self.toolbarButton = 'write';
          // clear treenav selection
          viewParams.onUpdateContentFile('download');
        }
      );

      this.customizeAction = (event) => {
        if (self.i18n.buttons.customize.visible()) viewParams.onCustomizeButtonClicked(event);
      };
    }

    return FormToolbar;
  }
);