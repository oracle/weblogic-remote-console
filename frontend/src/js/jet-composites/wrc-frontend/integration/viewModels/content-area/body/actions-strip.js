/**
 * @license
 * Copyright (c) 2023, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojhtmlutils',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/microservices/actions-management/declarative-actions-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils',
  'wrc-frontend/core/types',
  'ojs/ojlogger',
  'ojs/ojknockout'
],
  function (
    oj,
    ko,
    HtmlUtils,
    MessageDisplaying,
    DeclarativeActionsManager,
    ViewModelUtils,
    CoreUtils,
    CoreTypes,
    Logger
  ) {

    function ActionsStrip(viewParams) {
      const self = this;

      this.perspective = viewParams.perspective;

      this.i18n = {
        icons: {
          'sync': { iconFile: 'sync-off-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.sync.tooltip'),
            tooltipOn: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.sync.tooltipOn')
          },
        },
        messages: {
          'action': {
            'cannotPerform': {
              summary: oj.Translations.getTranslatedString('wrc-table-toolbar.messages.action.cannotPerform.summary'),
              detail: oj.Translations.getTranslatedString('wrc-table-toolbar.messages.action.cannotPerform.detail', '{0}', '{1}')
            }
          }
        }
      };

      this.actionButtons = {html: ko.observable({}), buttons: []};
      this.showActionsStrip = ko.observable(true);

      this.renderActionsStrip = function (visibility = true) {
        if (visibility) {
          const declarativeActions = viewParams.getDeclarativeActions();
          const results = DeclarativeActionsManager.createActionsButtons(declarativeActions);
          this.actionButtons.html({view: HtmlUtils.stringToNodeArray(results.html.innerHTML), data: this});
          this.actionButtons.buttons = results.buttons;
          visibility = declarativeActions.buttons.length > 0;
        }
        this.showActionsStrip(visibility);
      }.bind(this);

      this.handleActionButtonClickedReply = function (reply, options) {
        if (CoreUtils.isNotUndefinedNorNull(reply)) {
          if (CoreUtils.isNotUndefinedNorNull(options) &&
            CoreUtils.isNotUndefinedNorNull(options.isDownloadAction) &&
            options.isDownloadAction
          ) {
            if (reply.succeeded) {
              if (CoreUtils.isNotUndefinedNorNull(reply.messages)) {
                MessageDisplaying.displayMessagesAsHTML(
                  reply.messages,
                  oj.Translations.getTranslatedString('wrc-table-toolbar.prompts.download.value'),
                  'confirmation',
                  60000
                );
              }
            }
            else {
              MessageDisplaying.displayResponseMessages(reply.messages);
            }
          }
          else {
            if (CoreUtils.isNotUndefinedNorNull(reply.messages)) {
              if (CoreUtils.isNotUndefinedNorNull(reply.messages[0]) && (reply.messages[0].severity === 'info')) {
                MessageDisplaying.displayMessagesAsHTML(reply.messages, '', reply.messages[0].severity);
              }
              else {
                MessageDisplaying.displayResponseMessages(reply.messages);
              }
            }
            else {
              MessageDisplaying.displayMessage(reply.data, 5000);
            }
          }

          if (reply.succeeded) {
            viewParams.onActionInputFormCompleted(reply, options);
          }
        }

      };

      this.handleActionButtonClickedFailure = function (failure, options) {
        if (CoreUtils.isNotUndefinedNorNull(failure)) {
          if (CoreUtils.isNotUndefinedNorNull(failure.transport)) {
            if (failure.failureType === CoreTypes.FailureType.CBE_REST_API) {
              if (failure.transport.status !== 404) Logger.error(JSON.stringify(failure));
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            }
          }
          else if (CoreUtils.isNotUndefinedNorNull(failure.messages)) {
            MessageDisplaying.displayResponseMessages(failure.messages);
          }
          else {
            ViewModelUtils.failureResponseDefaultHandling(failure);
          }
        }

      };

      this.actionButtonClicked = function (event) {
        const options = {
          action: event.currentTarget.attributes['id'].value,
          label: event.currentTarget.innerText
        };
        options['isDownloadAction'] =
          (['downloadLogs', 'downloadSingleLog'].includes(options.action));
        options['isDeleteAction'] = (options.action === 'delete');

        viewParams.signaling.ancillaryContentItemCleared.dispatch('actions-strip');

        const pdjData = viewParams.parentRouter.data.pdjData();
        const rdjData = viewParams.parentRouter.data.rdjData();

        const hasActionInputForm = DeclarativeActionsManager.hasActionInputForm(rdjData.actions, options.action);

        if (hasActionInputForm) {
          const actionInputFormLabels = DeclarativeActionsManager.getActionInputFormLabels(pdjData, options.action);
          options['label'] = actionInputFormLabels.label;
          options['title'] = actionInputFormLabels.title;
          options['formLayout'] = DeclarativeActionsManager.getActionInputFormLayoutSettings(pdjData, options.action);
          viewParams.onActionInputButtonClicked(rdjData, options);
        }
        else {
          ViewModelUtils.setPreloaderVisibility(true);

          viewParams.onActionButtonClicked(options)
            .then(reply => {
              self.handleActionButtonClickedReply(reply, options);

              if (reply.succeeded) {
                const declarativeActions = viewParams.getDeclarativeActions();
                const actionPolling = DeclarativeActionsManager.getPDJActionPollingObject(rdjData, declarativeActions, options.action);

                if (CoreUtils.isNotUndefinedNorNull(options.pollingIntervalOverride)) {
                  actionPolling.interval = options.pollingIntervalOverride;
                }

                if (actionPolling.interval > 0) {
                  actionPolling['pollCount'] = 0;
                  viewParams.onActionPollingStarted(actionPolling);
                }

                // If the action was one that required only a single row to be selected
                // (e.g. 'Move up'/'Move down') then uncheck the row..
                // This optimizes for the case where a user 
                //  1. selects a row then performs an action,
                //  2. selects another row and performs possibly the same action
                // by obviating the need to deselect the initial row
                const button = declarativeActions.buttons.find(button => button.name === options.action);
                
                if (button && button.rows === DeclarativeActionsManager.RowSelectionType.ONE.name) {
                  declarativeActions.checkedRows.clear();
                }
                
                viewParams.onCheckedRowsRefreshed();
                viewParams.onActionButtonsRefreshed();
              }
            })
            .catch(failure => {
              self.handleActionButtonClickedFailure(failure, options);
            })
            .finally(() => {
              ViewModelUtils.setPreloaderVisibility(false);
            });
        }
      };

      this.launchActionMenu = function (event) {
        event.preventDefault();
        const menuId = event.target.id.replace('Launcher', '');
        document.getElementById(menuId).open(event);
      };

      this.actionMenuClickListener = function (event) {
        event.preventDefault();
        const fauxEvent = {
          currentTarget: {
            id: event.target.id,
            innerText: event.target.innerText,
            attributes: event.target.attributes
          }
        };
        self.actionButtonClicked(fauxEvent);
      };


    }

    return ActionsStrip;
  }
);