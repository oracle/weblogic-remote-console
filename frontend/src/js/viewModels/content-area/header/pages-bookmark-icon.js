/**
 Copyright (c) 2025, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/

 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/utils'
  ],
  function (
      oj,
      ko,
      ViewModelUtils,
      Runtime,
      CoreUtils
    ) {
      function PagesBookmarkIcon(viewParams) {
        const self = this;

        this.i18n = {
          icons: {
            bookmarks: {
              id: 'pages-bookmark-menu-icon',
              iconFile: ko.observable('pages-bookmark-off_24x24'),
              visible: ko.observable(false),
              disabled: ko.observable(false),
              tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.pagesHistory.star.value')
            }
          }
        };

        this.signalBindings = [];

        this.connected = function() {
          let binding = viewParams.signaling.backendConnectionLost.add(() => {
            self.setIconbarIconVisibility('bookmarks', false);
          });

          self.signalBindings.push(binding);

          binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
            if (removedDataProvider.id === Runtime.getDataProviderId()) {
              self.setIconbarIconVisibility('bookmarks', false);
            }
          });

          self.signalBindings.push(binding);

          binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
            if (dataProvider.id === Runtime.getDataProviderId()) {
              self.setIconbarIconVisibility('bookmarks', false);
            }
          });

          self.signalBindings.push(binding);

          binding = viewParams.signaling.projectSwitched.add(() => {
            self.setIconbarIconVisibility('bookmarks', false);
          });

          self.signalBindings.push(binding);

          binding = viewParams.signaling.perspectiveSelected.add((newPerspective) => {
            self.setIconbarIconVisibility('bookmarks', true);
          });

          self.signalBindings.push(binding);

        }.bind(this);

        this.disconnected = function () {
          // Detach all signal "add" bindings.
          self.signalBindings.forEach(binding => { binding.detach(); });

          // Reinitialize module-scoped array for storing
          // signal "add" bindings, so it can be GC'd by
          // the JS engine.
          self.signalBindings = [];

        }.bind(this);

        this.setIconbarIconVisibility = (buttonId, visible) => {
          self.i18n.icons[buttonId].visible(visible);
        };

        this.pagesBookmarkIconClickListener = function (event) {
          const pagesHistoryViewModel = ko.dataFor(document.getElementById('beanpath-history-container'));
          if (pagesHistoryViewModel) {
            const fauxEvent = {target: {value: 'showBookmarks'}};
            pagesHistoryViewModel.pagesBookmarkMenuClickListener(fauxEvent);
          }
        };

      }

      return PagesBookmarkIcon;
    }
);