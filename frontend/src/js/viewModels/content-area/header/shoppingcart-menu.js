/**
 Copyright (c) 2024, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/

 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'wrc-frontend/microservices/change-management/change-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils'
],
function (
  oj,
  ko,
  ChangeManager,
  ViewModelUtils,
  Runtime,
  CoreUtils
) {
    function ShoppingCartMenu(viewParams) {
      const self = this;

      this.i18n = {
        icons: {
          shoppingcart: {
            id: 'shoppingcart-menu-icon',
            iconFile: ko.observable('shopping-cart-non-empty-blk_24x24'),
            visible: ko.observable(false),
            disabled: ko.observable(false),
            tooltip: oj.Translations.getTranslatedString('wrc-content-area-header.icons.shoppingcart.tooltip')
          }
        },
        menus: {
          shoppingcart: {
            'view': {
              id: 'view-changes', iconFile: '', disabled: false, visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.menu.shoppingcart.view.label')
            },
            'discard': {
              id: 'discard', iconFile: 'oj-ux-ico-cart-abandon', disabled: ko.observable(false), visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.menu.shoppingcart.discard.label')
            },
            'commit': {
              id: 'commit', iconFile: 'oj-ux-ico-cart-add', disabled: ko.observable(false), visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-content-area-header.menu.shoppingcart.commit.label')
            }
          }
        }
      };

      this.changeManager = ko.observable({isLockOwner: false, hasChanges: false, supportsChanges: false});

      this.signalBindings = [];

      this.connected = function() {
        let binding = viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager) => {
          self.setIconbarIconFile(eventType, changeManager);
          if (eventType === 'discard') viewParams.onChangesDiscarded();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          self.setIconbarIconVisibility('shoppingcart', false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            self.setIconbarIconVisibility('shoppingcart', false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          if (dataProvider.id === Runtime.getDataProviderId()) {
            self.setIconbarIconVisibility('shoppingcart', false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add(() => {
          self.setIconbarIconVisibility('shoppingcart', false);
        });

        self.signalBindings.push(binding);

        // The establishment of this subscription will happen
        // BEFORE the Promise for ChangeManager.getLockState()
        // is resolved! The update of self.changeManager()
        // inside the Promise.then() block, will subsequently
        // trigger this subscription.
        this.changeManagerSubscription = this.changeManager.subscribe((newValue) => {
          ancillaryContentItemChanged('shoppingcart', newValue);
          self.i18n.menus.shoppingcart.commit.disabled(!newValue.hasChanges);
          self.i18n.menus.shoppingcart.discard.disabled(!newValue.hasChanges);
        });

      }.bind(this);

      this.disconnected = function () {
        let dispose = function (obj) {
          if (obj && typeof obj.dispose === 'function') {
            obj.dispose();
          }
        };

        dispose(this.changeManagerSubscription);

        this.changeManager.dispose();

        // Detach all signal "add" bindings.
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];

      }.bind(this);

      this.launchShoppingCartMenu = function(event) {
        event.preventDefault();
        document.getElementById('shoppingCartMenu').open(event);
      };

      this.shoppingCartMenuClickListener = (event) => {
        const value = event.target.value;
        if (value === 'view-changes') {
          viewParams.signaling.ancillaryContentItemSelected.dispatch('shoppingcart-menu', 'shoppingcart');
        }
        else {
          switch (value) {
            case 'commit':
              ViewModelUtils.setPreloaderVisibility(true);
              ChangeManager.commitChanges()
                .then(value => {
                  self.setIconbarIconFile('refresh', value);
                  viewParams.signaling.ancillaryContentItemCleared.dispatch('shoppingcart-menu');
                })
                .catch(response => {
                  ViewModelUtils.failureResponseDefaultHandling(response);
                })
                .finally(() => {
                  ViewModelUtils.setPreloaderVisibility(false);
                });
              break;
            case 'discard':
              ViewModelUtils.setPreloaderVisibility(true);
              ChangeManager.discardChanges()
                .then((changeManager) => {
                  self.setIconbarIconFile('refresh', changeManager);
                  viewParams.signaling.ancillaryContentItemCleared.dispatch('shoppingcart-menu');
                  viewParams.onChangesDiscarded();
                })
                .catch(response => {
                  ViewModelUtils.failureResponseDefaultHandling(response);
                })
                .finally(() => {
                  ViewModelUtils.setPreloaderVisibility(false);
                });
              break;
          }
        }
      };

      this.onBeanTreeChanged = (newBeanTree) => {
        if (newBeanTree.type !== 'home') {
          self.setIconbarIconVisibility('shoppingcart', newBeanTree.type === 'configuration');
          self.setIconbarIconFile('refresh');
        }
      };

      this.setIconbarIconVisibility = (buttonId, visible) => {
        if (Runtime.getProperty('features.iconbarIcons.relocated')) {
          self.i18n.icons[buttonId].visible(visible);
        }
      };

      this.setIconbarIconFile = (eventType, changeManager) => {
        switch (eventType) {
          case 'refresh':
            // Get value of changeManager properties asynchronously.
            ChangeManager.getLockState()
              .then((data) => {
                if (CoreUtils.isNotUndefinedNorNull(data)) {
                  self.changeManager(data.changeManager);
                }
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              });
            break;
          case 'sync':
            ChangeManager.getData()
              .then(data => {
                if (CoreUtils.isNotUndefinedNorNull(data)) {
                  changeManager.supportsChanges = data.changeManager.supportsChanges;
                  changeManager.isLockOwner = data.changeManager.isLockOwner;
                  changeManager.hasChanges = data.changeManager.hasChanges;
                  ChangeManager.putMostRecent(changeManager);
                  self.changeManager(changeManager);
                }
              });
            break;
          default:
            // For handling the "update", "commit" and "discard" event
            // type, which is one where the changeManager parameter is
            // an object that already came from the changeManager. In
            // that case, we don't need (or want) to make another call
            // on the ChangeManager.
            if (CoreUtils.isNotUndefinedNorNull(changeManager)) {
              // Just use the changeManager parameter to update our own
              // knockout observable.
              self.changeManager(changeManager);
            }
            break;
        }
      };

      function ancillaryContentItemChanged(buttonId, changeManager) {
        const iconFile = (changeManager.isLockOwner && changeManager.hasChanges ? 'shopping-cart-non-empty-tabstrip_24x24' : 'shopping-cart-empty-tabstrip_24x24');
        self.i18n.icons[buttonId].iconFile(iconFile);
      }

    }

    return ShoppingCartMenu;
  }
);