/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'wrc-frontend/microservices/actions-management/declarative-actions-manager', 'wrc-frontend/microservices/page-definition/actions-input', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (oj, DeclarativeActionsManager, PageDefinitionActionsInput, MessageDisplaying, ViewModelUtils, CoreUtils, Logger) {

    function showConfirmDialogStyleActionsInput(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      confirmDialog.setAttribute('dialog-title', i18n.dialog.title());
      const span = document.getElementById('confirmDialogPrompt');
      span.innerHTML = i18n.dialog.prompt();
      const div = document.querySelector('.cfe-dialog-cancel');
      div.style.display = (i18n.buttons.cancel.visible() ? 'inline-flex' : 'none');
      return new Promise(function (resolve) {
        function onClose(reply) {
          yesBtn.removeEventListener('ojAction', yesClickHandler);
          noBtn.removeEventListener('ojAction', noClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function yesClickHandler(event) {
          onClose({exitButton: 'yes'});
          confirmDialog.close();
        }

        function noClickHandler() {
          onClose({exitButton: 'no'});
          confirmDialog.close();
        }

        function cancelClickHandler() {
          onClose({exitButton: 'cancel'});
          confirmDialog.close();
        }

        function onKeyUp(event) {
          switch (event.key){
            case 'Enter':
              // Treat pressing the "Enter" key as clicking the "OK" button
              yesClickHandler(event);
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event, so JET will update the knockout
              // observable associated with the <oj-input-text> element
              return false;
            case 'Escape':
              // Treat pressing the "Escape" key as clicking the "Cancel" button
              cancelClickHandler();
              break;
          }
        }

        const yesBtn = document.getElementById('dlgYesBtn');
        yesBtn.addEventListener('click', yesClickHandler);

        const noBtn = document.getElementById('dlgNoBtn');
        noBtn.addEventListener('click', noClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn');
        cancelBtn.addEventListener('click', cancelClickHandler);

        confirmDialog.addEventListener('keyup', onKeyUp);

        confirmDialog.open();
      });
    }

    function handleActionInputButtonClicked(self, viewParams, rdjData, actionInputFormConfig, childRouterName, submitActionsInputFormCallback, rowKeyName) {
      function processActionInputFormDataReply(reply, endpoint) {
        const pdjData = reply.body.data.get('pdjData');
        const rdjData = reply.body.data.get('rdjData');
        DeclarativeActionsManager.updatePDJTypesActionInputProperties(pdjData);
        const actionInputFormStyle = DeclarativeActionsManager.getActionInputFormStyle(pdjData);
        if (CoreUtils.isNotUndefinedNorNull(actionInputFormStyle)) {
          if (actionInputFormStyle === DeclarativeActionsManager.ActionInputFormStyle.ACTION_POPUP.name) {
            // Need to use regex scrub newlines and erroneous single-quote
            actionInputFormConfig['instructions'] = pdjData.introductionHTML.replace(/\r\n|\n|'\n|\r/gm, '');
            actionInputFormConfig['path'] = endpoint.resourceData;
            actionInputFormConfig['breadcrumbs'] = actionInputFormConfig.path;
            actionInputFormConfig['submitCallback'] = submitActionsInputFormCallback;
            actionInputFormConfig['iconFile'] = 'done-icon-blk_24x24';
            actionsInput.createOverlayFormDialogModuleConfig(viewParams, reply, actionInputFormConfig, childRouterName)
              .then(moduleConfig => {
                self.overlayFormDialogModuleConfig(moduleConfig);
              });
          }
          else if (actionInputFormStyle === DeclarativeActionsManager.ActionInputFormStyle.CONFIRM_DIALOG.name) {
            self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-actions-strip.dialogs.cannotBeUndone.title'));
            self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-actions-strip.dialogs.cannotBeUndone.prompt', '{0}').replace('{0}', actionInputFormConfig.title));
            self.i18n.buttons.cancel.visible(false);
            showConfirmDialogStyleActionsInput(self.i18n)
              .then(reply => {
                if (CoreUtils.isNotUndefinedNorNull(reply) &&
                  CoreUtils.isNotUndefinedNorNull(reply.exitButton) &&
                  reply.exitButton === 'yes'
                ) {
                  submitActionsInputFormCallback(rdjData, {data: {}}, actionInputFormConfig);
                }
              });
          }
        }
      }

      const actionsInput = new PageDefinitionActionsInput();
      const result = DeclarativeActionsManager.getActionInputFormRequest(rdjData, self.declarativeActions, actionInputFormConfig.action, rowKeyName);

      actionsInput.getActionInputFormData(result.endpoint.resourceData, result.dataPayload)
        .then(reply => {
          processActionInputFormDataReply(reply, result.endpoint);
        })
        .catch(response => {
          if (CoreUtils.isNotUndefinedNorNull(response.body) &&
            CoreUtils.isNotUndefinedNorNull(response.body.messages)
          ) {
            MessageDisplaying.displayResponseMessages(response.body.messages);
          }
          else {
            ViewModelUtils.failureResponseDefaultHandling(response);
          }
        });
    }

  //public:
    return {
      handleActionInputButtonClicked: (self, viewParams, rdjData, actionInputFormConfig, childRouterName, submitActionsInputFormCallback, rowKeyName) => {
        handleActionInputButtonClicked(self, viewParams, rdjData, actionInputFormConfig, childRouterName, submitActionsInputFormCallback, rowKeyName);
      }

    };

  }
);