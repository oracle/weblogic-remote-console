/**
 * @license
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {

    function showPagesHistory(pagesHistoryDialog, i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', clearClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          resolve(reply);
        }

        function clearClickHandler(event) {
          onClose({exitButton: 'clear'});
          pagesHistoryDialog.close();
        }

        function cancelClickHandler() {
          onClose({exitButton: 'close'});
          pagesHistoryDialog.close();
        }

        function onKeyUp(event) {
          if (event.key === 'Escape'){
              // Treat pressing the "Escape" key as clicking the "Cancel" button
              cancelClickHandler();
          }
        }

        const okBtn = document.getElementById('dlgOkBtn24');
        okBtn.addEventListener('ojAction', clearClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn24');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        pagesHistoryDialog.open();
      });
    }

  //public:
    return {
      showPagesHistoryDialog: (i18n) => {
        const pagesHistoryDialog = document.getElementById('recentlyVisitedPagesDialog');
        return showPagesHistory(pagesHistoryDialog, i18n);
      }

    };

  }
);
