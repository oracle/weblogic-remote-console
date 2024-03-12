/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojhtmlutils',
  'wrc-frontend/common/keyup-focuser',
  'wrc-frontend/microservices/perspective/perspective-manager',
  './startup-tasks-dialog',
  './content-area/ancillary/provider-management',
  'wrc-frontend/microservices/task/startup-task-manager',
  'wrc-frontend/core/runtime',
  'ojs/ojcontext',
  'wrc-frontend/core/utils',
  'ojs/ojknockout',
  'ojs/ojmodule-element',
  'ojs/ojmodule',
  'ojs/ojradioset',
  'ojs/ojbinddom'
],
  function (
    oj,
    ko,
    HtmlUtils,
    KeyUpFocuser,
    PerspectiveManager,
    StartupTasksDialog,
    ProviderManagement,
    StartupTaskManager,
    Runtime,
    Context,
    CoreUtils
  ) {
    function StartupTasks(viewParams) {
      const self = this;

      this.i18n = {
        'buttons': {
          'ok': { disabled: ko.observable(false),
            'label': ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'))
          },
          'cancel': { disabled: false,
            'label': oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
          }
        },
        'dialog': {
          'title': ko.observable(''),
          'instructions': ko.observable(''),
          'nameLabel': ko.observable(''),
          'fileLabel': ko.observable(''),
          'iconFile': ko.observable(''),
          'tooltip': ko.observable('')
        }
      };

      function DialogFields() {
        return {
          addField: function(name, value) {
            if (typeof value === 'number') value = value.toString();
            this.putValue(name, value || '');
          },
          putValue: function(name, value) {
            this[name] = value;
          }
        }
      }

      this.dialogFields = ko.observable({});
      this.startupTaskItems = ko.observableArray();

      this.signalBindings = [];

      this.connected = function () {
        self.startupTaskItems(loadStartupTaskItems());
      };

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      };

      function loadStartupTaskItems() {
        const dataArray = StartupTaskManager.getAll();

        dataArray.forEach((task) => {
          task['label'] = oj.Translations.getTranslatedString(`wrc-startup-tasks.cards.${task.id}.label`);
          task['iconFile'] = task.iconFiles['light'];
          task['content'] = { view: HtmlUtils.stringToNodeArray(oj.Translations.getTranslatedString(`wrc-startup-tasks.cards.${task.id}.description`))};
        });

        return dataArray;
      }

      /**
       * Returns the NLS translated string for the tooltip of a navstrip item.
       * <p>It allows us to do two main things:
       * <ol>
       *   <li>Avoid putting oj.Translations.getTranlatedString() functions in the .html</li>
       *   <li>To restrict the use of the oj.Translations.getTranlatedString() function to the i18n object</li>
       * </ol>
       * @param {string} id
       * @returns {string}
       */
      this.getTooltip = (id) => {
        return oj.Translations.getTranslatedString(`wrc-startup-tasks.cards.${id}.label`);
      };
  
      this.onBlurSection = (event) => {
        console.log('[STARTUP-TASKS] onBlurSection was called!');
        KeyUpFocuser.setLastExecutedRule('.startup-task-panel-card', {key: 'Escape'});
      };

      this.registerKeyUpFocuser = (id) => {
        let result = KeyUpFocuser.getKeyUpCallback(id);
    
        if (!result.alreadyRegistered) {
          const options = {
            focusItems: self.startupTaskItems().map(({id}) => id)
          };
      
          result = KeyUpFocuser.register(
            id,
            {
              Escape: {key: 'Escape', selector: '#provider-management-iconbar-icon', isArray: false},
              Tab: {key: 'Shift+Tab', action: 'navigate'},
              ArrowRight: {key: 'ArrowRight', action: 'navigate'},
              ArrowLeft: {key: 'ArrowLeft', action: 'navigate'}
            },
            options
          );
        }

        return result.keyUpCallback;
      };
  
      /**
       * Called when user clicks icon or label of sideways tabstrip item
       * @param event
       */
      this.startupTaskPanelClickHandler = (event) => {
        let value = event.currentTarget.children[0].id;
  
        if (CoreUtils.isUndefinedOrNull(value)) {
          return;
        }
  
        // Strip '-startup-task-panel-card' suffix from value
        value = value.replace('-startup-task-panel-card', '');

        chooseStartupTask(value);
      };

      this.showStartupTasks = function (options = {chooser: StartupTasks.prototype.Chooser.USE_DIALOG.name}) {
        if (options.chooser === StartupTasks.prototype.Chooser.USE_DIALOG.name) {
          chooseStartupTask('');
        }
        else if (options.chooser === StartupTasks.prototype.Chooser.USE_CARDS.name) {
          const section = document.getElementById('startup-task-container');
          if (section !== null) {
            section.style.display = 'inline-flex';
//MLW            KeyUpFocuser.setLastExecutedRule('.startup-task-panel-card', {focusIndexValue: 0, key: 'ShiftTab'});
          }
        }
      };

      function chooseStartupTask(startupTask = Runtime.getProperty(Runtime.PropertyName.CFE_STARTUP_TASK)) {
        const startupTasks = [
          {id: 'addAdminServer', value: ProviderManagement.prototype.Actions.connections.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.connections.add.value')},
          {id: 'addWdtModel', value: ProviderManagement.prototype.Actions.models.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.add.value')},
          {id: 'addWdtComposite', value: ProviderManagement.prototype.Actions.composite.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.composite.add.value')},
          {id: 'addPropertyList', value: ProviderManagement.prototype.Actions.proplist.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.add.value')},
          {id: 'createWdtModel', value: ProviderManagement.prototype.Actions.models.new.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.new.value')},
          {id: 'createPropertyList', value: ProviderManagement.prototype.Actions.proplist.new.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.new.value')},
          {id: 'importProject', value: ProviderManagement.prototype.Actions.project.import.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.project.import.value')}
        ];

        if (startupTask !== '' && startupTask !== 'none') {
          // There is a setting in console-frontend-jet.yaml, but we
          // still need to see if it a valid value.
          const result = startupTasks.find(task => task.id === startupTask);
          // Set startupTask to an empty string, if the settings value
          // was invalid.
          if (CoreUtils.isNotUndefinedNorNull(result)) {
            // startupTask needs to be converted to the menu
            // item id, which is the result.value value.
            startupTask = result.value;
          }
          else {
            // The setting in console-frontend.yaml is either
            // missing or invalid. Set startupTask to an empty
            // string, so the StartupTaskChooser dialog is shown.
            startupTask = '';
          }
        }

        if (startupTask !== '') {
          // We have a valid startup task, so just use it.
          useChosenStartupTask(startupTask);
        }
        else {
          const dialogParams = {};
          const entryValues = new DialogFields();
          entryValues.putValue('startupTask', ProviderManagement.prototype.Actions.connections.add.id);
          entryValues.putValue('startupTasks', startupTasks);
          self.dialogFields(entryValues);

          // There was no settings value, or it was invalid.
          // In both cases, we need to show the provider type
          // chooser dialog.
          self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-data-providers.titles.startup.task.value'));
          self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.task.startup.value'));
          self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.choose.label'));

          StartupTasksDialog.showStartupTaskChooserDialog(dialogParams, self.i18n)
            .then(reply => {
              if (reply) {
                useChosenStartupTask(self.dialogFields().startupTask);
              }
            });
        }
      }

      function useChosenStartupTask(startupTask) {
        viewParams.signaling.startupTaskChosen.dispatch(startupTask, {chooser: Runtime.getStartupTaskChooser()});
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(() => {
          self.showStartupTasks({chooser: Runtime.getStartupTaskChooser()});
        });
    }

    StartupTasks.prototype.Chooser = Object.freeze({
      USE_DIALOG: {name: 'use-dialog'},
      USE_CARDS: {name: 'use-cards'}
    });

    return StartupTasks;
  }
);