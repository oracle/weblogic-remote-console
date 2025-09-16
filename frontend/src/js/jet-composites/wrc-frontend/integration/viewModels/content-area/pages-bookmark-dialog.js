/**
 * @license
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
    function (ko) {

      function showPagesBookmark(pagesBookmarkDialog, i18n, resetPagesBookmarkCallback) {
        return new Promise(function (resolve) {
          function onClose(reply) {
            resetBtn.removeEventListener('ojAction', resetClickHandler);
            applyBtn.removeEventListener('ojAction', applyClickHandler);
            cancelBtn.removeEventListener('ojAction', cancelClickHandler);
            resolve(reply);
          }

          function resetClickHandler(event) {
            resetPagesBookmarkCallback();
          }

          function applyClickHandler(event) {
            onClose({exitButton: 'apply'});
            pagesBookmarkDialog.close();
          }

          function cancelClickHandler() {
            onClose({exitButton: 'close'});
            pagesBookmarkDialog.close();
          }

          function onKeyUp(event) {
            if (event.key === 'Escape'){
              // Treat pressing the "Escape" key as clicking the "Cancel" button
              cancelClickHandler();
            }
          }

          const resetBtn = document.getElementById('dlgResetBtn25');
          resetBtn.addEventListener('ojAction', resetClickHandler);

          const applyBtn = document.getElementById('dlgApplyBtn25');
          applyBtn.addEventListener('ojAction', applyClickHandler);

          const cancelBtn = document.getElementById('dlgCancelBtn25');
          cancelBtn.addEventListener('ojAction', cancelClickHandler);

          pagesBookmarkDialog.open();
        });
      }

    //public:
      return {
        showPagesBookmarkDialog: (i18n, resetPagesBookmarkCallback) => {
          const pagesBookmarkDialog = document.getElementById('pagesBookmarkDialog');
          return showPagesBookmark(pagesBookmarkDialog, i18n, resetPagesBookmarkCallback);
        }

      };

    }
);
