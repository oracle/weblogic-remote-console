/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/microservices/actions-management/declarative-actions-manager', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojknockout'],
  function (oj, ko, HtmlUtils, MessageDisplaying, DeclarativeActionsManager, ViewModelUtils, CoreUtils, Logger) {

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
              MessageDisplaying.displayResponseMessages(reply.messages);
/*
//MLW
              if (reply.messages.length === 0) {
                MessageDisplaying.displayMessage({
                  severity: 'confirmation',
                  summary: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.actionSucceeded.summary', options.label)
                }, 2500);
              }
              else {
                 MessageDisplaying.displayResponseMessages(reply.messages);
              }
 */
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

      this.actionButtonClicked = function (event) {
        const options = {
          action: event.currentTarget.attributes['id'].value,
          label: event.currentTarget.innerText
        };
        options['isDownloadAction'] = (['downloadLogAsJson', 'downloadLogAsPlainText'].includes(options.action));

        viewParams.signaling.tabStripTabSelected.dispatch('actions-strip', 'shoppingcart', false);

        const pdjData = viewParams.parentRouter.data.pdjData();
        const rdjData = viewParams.parentRouter.data.rdjData();

        const hasActionInputForm = DeclarativeActionsManager.hasActionInputForm(rdjData.actions, options.action);

        if (hasActionInputForm) {
          const actionInputFormLabels = DeclarativeActionsManager.getActionInputFormLabels(pdjData, options.action);
          options['label'] = actionInputFormLabels.label;
          options['title'] = actionInputFormLabels.title;
          viewParams.onActionInputButtonClicked(rdjData, options);
        }
        else {
          ViewModelUtils.setPreloaderVisibility(true);

          viewParams.onActionButtonClicked(options)
            .then(reply => {
              self.handleActionButtonClickedReply(reply, options);

              if (reply.succeeded) {
                const declarativeActions = viewParams.getDeclarativeActions();
                const actionPolling = DeclarativeActionsManager.getPDJActionPollingObject(declarativeActions, options.action);
                if (actionPolling.interval > 0) {
                  actionPolling['pollCount'] = 0;
                  viewParams.onActionPollingStarted(actionPolling);
                }
                viewParams.onCheckedRowsRefreshed();
              }
            })
            .catch(failure => {
              if (CoreUtils.isNotUndefinedNorNull(failure.messages)) {
                MessageDisplaying.displayResponseMessages(failure.messages);
              }
              else {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              }
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