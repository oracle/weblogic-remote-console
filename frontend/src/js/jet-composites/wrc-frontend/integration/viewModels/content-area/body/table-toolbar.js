/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/change-management/change-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojcheckboxset'],
  function (oj, ko, HtmlUtils, MessageDisplaying, Runtime, ChangeManager, PerspectiveMemoryManager, PageDefinitionUtils, ViewModelUtils, CoreTypes, CoreUtils, Logger) {
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
          'customView': { id: 'customView', iconFile: 'custom-view-icon-blk_24x24', disabled: false, visible: ko.observable(false),
            label: ko.observable()
          }
        },
        icons: {
          'landing': { iconFile: 'landing-page-icon-blk_24x24',
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
          'sync': { iconFile: 'sync-off-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.sync.tooltip'),
            tooltipOn: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.sync.tooltipOn')
          },
          'syncInterval': { iconFile: 'sync-interval-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.syncInterval.tooltip')
          },
          'shoppingcart': { iconFile: 'commit-to-cart-icon_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-table-toolbar.icons.shoppingcart.tooltip')
          }
        },
        menus: {
          shoppingcart: {
            'view': { id: 'view', iconFile: '', disabled: false, visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-table-toolbar.menu.shoppingcart.view.label')
            },
            'discard': { id: 'discard', iconFile: 'discard-changes-blk_24x24', disabled: false, visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-table-toolbar.menu.shoppingcart.discard.label')
            },
            'commit': { id: 'commit', iconFile: 'commit-changes-blk_24x24', disabled: false, visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-table-toolbar.menu.shoppingcart.commit.label')
            }
          }
        },
        instructions: {
          'selectItems': {
            value: oj.Translations.getTranslatedString('wrc-table-toolbar.instructions.selectItems.value', '{0}')
          }
        },
        messages: {
          'action': {
            'cannotPerform': {
              summary: oj.Translations.getTranslatedString('wrc-table-toolbar.messages.action.cannotPerform.summary'),
              detail: oj.Translations.getTranslatedString('wrc-table-toolbar.messages.action.cannotPerform.detail', '{0}', '{1}')
            }
          }
        },
        labels: {
          start: {value: oj.Translations.getTranslatedString('wrc-table-toolbar.labels.start.value')},
          resume: {value: oj.Translations.getTranslatedString('wrc-table-toolbar.labels.resume.value')},
          suspend: {value: oj.Translations.getTranslatedString('wrc-table-toolbar.labels.suspend.value')},
          shutdown: {value: oj.Translations.getTranslatedString('wrc-table-toolbar.labels.shutdown.value')},
          restartSSL: {value: oj.Translations.getTranslatedString('wrc-table-toolbar.labels.restartSSL.value')},
          stop: {value: oj.Translations.getTranslatedString('wrc-table-toolbar.labels.stop.value')}
        }
      };

      this.showHelp = ko.observable(false);

      // This instance-scope variable is used to determine which
      // sync-<state>-icon-blk_24x24.png is assigned to the
      // <img id="sync-icon">
      this.autoSyncEnabled = ko.observable(false);
      this.showAutoSyncIcons = ko.observable(true);

      // Need initial values because table-toolbar.html has binding
      // expressions that reference changeManager
      this.changeManager = ko.observable({isLockOwner: false, hasChanges: false, supportsChanges: false});

      // This instance-scope variable is used to remember and
      // recall the value of the auto-sync interval
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(self.perspective.id);
      this.showInstructions = ko.observable(true);
      this.showBeanPathHistory = ko.observable(this.perspectiveMemory.beanPathHistory.visibility);

      // This instance-scope variable is used to hold the
      // HTML for dynamic toolbar buttons
      this.actionButtons = {html: ko.observable({}), buttons: [], visible: ko.observable(self.perspective.id === 'monitoring')};

      this.signalBindings=[];
      this.readonly = ko.observable();

      this.connected = function () {
        const rdjData = viewParams.parentRouter.data.rdjData();

        const isNonCreatableCollection = rdjData.self.kind === 'nonCreatableCollection';

        Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, isNonCreatableCollection || !['configuration','modeling','properties','security'].includes(self.perspective.id));
        self.readonly(Runtime.isReadOnly());

        let binding = viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          self.i18n.menus.shoppingcart.discard.visible(!newRO);
          self.i18n.menus.shoppingcart.commit.visible(!newRO);
          updateActionButtonsState(newRO);
        });

        const label = oj.Translations.getTranslatedString(`wrc-common.buttons.${ViewModelUtils.isElectronApiAvailable() ? 'savenow' : 'write'}.label`);
        self.i18n.buttons.write.label(label);
        self.i18n.buttons.write.visible(Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name && ['modeling','properties'].includes(self.perspective.id));
        self.i18n.buttons.new.visible(['configuration','modeling','security','properties'].includes(self.perspective.id));

        self.signalBindings.push(binding);

        // Get auto-sync interval from perspectiveMemory
        const syncInterval = self.perspectiveMemory.contentPage.syncInterval;
        if (syncInterval !== null) {
          const ele = document.getElementById('sync-icon');
          if (ele !== null) ele.setAttribute('data-interval', syncInterval);
        }

        binding = viewParams.signaling.autoSyncCancelled.add(autoSyncCancelledCallback);

        self.signalBindings.push(binding);

        binding = viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager) => {
          // For refresh event, issue a request to check then set the current state
          if (eventType === 'refresh') {
            ChangeManager.getLockState()
              .then((data) => {
                self.changeManager(data.changeManager);
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              });
            return;
          }

          // Handle the event based on the supplied changeManager
          Logger.log(`[TABLE-TOOLBAR] self.changeManager()=${self.changeManager()}`);
          changeManager.supportsChanges = self.changeManager().supportsChanges;
          if (!CoreUtils.isEquivalent(self.changeManager(), changeManager)) {
            ChangeManager.putMostRecent(changeManager);
            self.changeManager(changeManager);
            if (eventType === 'discard') viewParams.onShoppingCartDiscarded();
          }
        });

        self.signalBindings.push(binding);

        // The establishment of this subscription will happen
        // BEFORE the Promise for ChangeManager.getLockState()
        // is resolved! The update of self.changeManager()
        // inside the Promise.then() block, will subsequently
        // trigger this subscription
        this.changeManager.subscribe((newValue) => {
          shoppingCartContentsChanged(newValue);
        });

        // Get value of changeManager properties asynchronously
        ChangeManager.getLockState()
          .then((data) => {
            self.changeManager(data.changeManager);
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          })
          .then(() => {
            self.renderToolbarButtons();
            self.showBeanPathHistory(self.perspectiveMemory.beanPathHistory.visibility);
            self.showInstructions(self.perspectiveMemory.instructions.visibility);
            viewParams.onConnected(self.perspectiveMemory.beanPathHistory.visibility);
          });

      };

      this.disconnected = function () {
        // autoSyncCancelled is for stopping auto-sync when the user presses the
        // "Disconnect" icon in the toolbar icon of domain.js, or
        // the CFE notices that the CBE process is stopped.
        viewParams.signaling.autoSyncCancelled.remove(autoSyncCancelledCallback);

        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });
        self.signalBindings = [];
      };

      this.launchShoppingCartMenu = function(event) {
        event.preventDefault();
        document.getElementById('shoppingCartMenu').open(event);
      };

      this.shoppingCartMenuClickListener = function (event) {
        if (event.target.value === 'view') {
          viewParams.signaling.tabStripTabSelected.dispatch('table-toolbar', ChangeManager.Entity.SHOPPING_CART.name, true);
        }
        else {
          switch (event.target.value){
            case 'commit':
              ViewModelUtils.setPreloaderVisibility(true);
              ChangeManager.commitChanges()
                .then((changeManager) => {
                  self.changeManager(changeManager);
                  viewParams.signaling.tabStripTabSelected.dispatch('table-toolbar', ChangeManager.Entity.SHOPPING_CART.name, false);
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
                  self.changeManager(changeManager);
                  viewParams.signaling.tabStripTabSelected.dispatch('table-toolbar', ChangeManager.Entity.SHOPPING_CART.name, false);
                  viewParams.onShoppingCartDiscarded();
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

      }.bind(this);

      function resetIconsVisibleState(state) {
        self.showAutoSyncIcons(state);
      }

      this.isShoppingCartVisible = function() {
        // Default to false
        let visible = false;
        // The console extension is installed, but the
        // shopping cart icon may be hidden for the
        // current perspective.
        if (self.perspective.id === 'configuration') {
          // The console extension isn't installed, but
          // there is one perspective where still showing
          // the shopping cart icon is required. That's
          // the configuration perspective.
          visible = viewParams.isShoppingCartVisible();
        }
        return visible;
      };

      function shoppingCartContentsChanged(changeManager) {
        let ele = document.getElementById('shoppingCartImage');
        if (ele !== null) {
          ele.src = 'js/jet-composites/wrc-frontend/1.0.0/images/shopping-cart-' + (changeManager.isLockOwner && changeManager.hasChanges ? 'non-empty' : 'empty') + '-tabstrip_24x24.png';
        }
      }

      this.renderToolbarButtons = function () {
        const pageDefinitionActions = viewParams.pageDefinitionActions();
        const results = pageDefinitionActions.createActionsButtons();
        Logger.log(results.html.innerHTML);
        self.actionButtons.html({ view: HtmlUtils.stringToNodeArray(results.html.innerHTML), data: self });
        self.actionButtons.buttons = results.buttons;
        updateActionButtonsState(self.readonly());
        const rdjData = viewParams.parentRouter?.data?.rdjData();
        const isCustomView = (self.perspective.id === 'monitoring' && CoreUtils.isNotUndefinedNorNull(rdjData?.dashboardCreateForm));
        if (isCustomView) {
          self.i18n.buttons.customView.label(rdjData?.dashboardCreateForm?.label);
        }
        self.i18n.buttons.customView.visible(isCustomView);
        resetIconsVisibleState(self.perspective.id === 'monitoring');
      }.bind(this);

      function updateActionButtonsState(isReadOnly) {
        const pageDefinitionActions = viewParams.pageDefinitionActions();

        if (isReadOnly) {
          self.actionButtons.buttons = pageDefinitionActions.disableAllActionsButtons(self.actionButtons.buttons);
        }
        else {
          self.actionButtons.buttons = pageDefinitionActions.populateActionsButtonsStates(self.actionButtons.buttons);
        }

        self.actionButtons.buttons = pageDefinitionActions.populateActionsButtonsStates(self.actionButtons.buttons);
      }

      this.toggleHistoryClick = function (event) {
        const withHistoryVisible = viewParams.onBeanPathHistoryToggled(!self.showBeanPathHistory());
        // Call function in table.js assigned to the
        // onBeanPathHistoryToggled field in viewParams
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
        viewParams.onHelpPageToggled(helpVisible, self.showBeanPathHistory());
      };

      this.syncClick = function (event) {
        const autoSyncEnabled = self.autoSyncEnabled();
        let syncInterval = parseInt(event.target.attributes['data-interval'].value);
        if (syncInterval === 0) {
          // Just reload and ensure the sync state is not running.
          if (autoSyncEnabled) {
            self.autoSyncEnabled(false);
            updateActionButtonsState();
          }
        }
        else {
          // Toggle the sync state and no interval when currently enabled
          self.autoSyncEnabled(!autoSyncEnabled);
          if (autoSyncEnabled) syncInterval = 0;
        }
        setAutoSyncIcon();
        viewParams.onSyncClicked(syncInterval);
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
        if ((typeof syncIconElement !== 'undefined') && (syncIconElement !== null))
          syncIconElement.setAttribute('title', (self.autoSyncEnabled() ? self.i18n.icons.sync.tooltipOn : self.i18n.icons.sync.tooltip));
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

      this.customViewAction = (event) => {
        if (self.showBeanPathHistory()) {
          const withHistoryVisible = viewParams.onBeanPathHistoryToggled(false);
          self.showBeanPathHistory(withHistoryVisible);
        }
        viewParams.onCustomViewButtonClicked(event);
      };

      this.actionsDialogButtonClicked = function (result) {
        Logger.log('[TABLE] okBtn was clicked, or ENTER key was pressed!');
      };

      this.actionButtonClicked = function (event) {
        const label = self.i18n.labels[event.currentTarget.attributes['data-action'].value].value;
        const dialogParams = {
          id: event.currentTarget.id,
          action: event.currentTarget.attributes['data-action'].value,
          title: label,
          instructions: self.i18n.instructions.selectItems.value.replace('{0}', label),
          label: label,
          isReadOnly: false
        };

        viewParams.signaling.tabStripTabSelected.dispatch('table-toolbar', 'shoppingcart', false);
        const detail = self.i18n.messages.action.cannotPerform.detail.replace('{0}', dialogParams.label);
        if (self.autoSyncEnabled()) {
          MessageDisplaying.displayMessage({
            severity: 'confirmation',
            summary: self.i18n.messages.action.cannotPerform.summary,
            detail:  detail.replace('{1}', self.i18n.icons.sync.tooltip)
          }, 3000);
          return false;
        }

        viewParams.onActionButtonClicked(dialogParams)
          .then((result) => {
            ViewModelUtils.setPreloaderVisibility(true);
            const pageDefinitionActions = viewParams.pageDefinitionActions();
            pageDefinitionActions.performActionOnChosenItems(result.chosenItems, result.urls)
              .then(replies => {
                replies.forEach((reply) => {
                  if (reply.succeeded) {
                    Logger.log(`[TABLETOOLBAR] actionUrl=${reply.data.actionUrl}`);
                  }
                  else {
                    if (CoreUtils.isNotUndefinedNorNull(reply.messages)) {
                      MessageDisplaying.displayResponseMessages(reply.messages);
                    }
                    else {
                      MessageDisplaying.displayMessage(reply.data, 5000);
                    }
                  }
                }); // end-of forEach
                const successes = replies.filter(reply => reply.succeeded);
                if (successes.length > 0 && self.actionButtons.buttons[dialogParams.action].asynchronous) {
                  self.syncClick({target: {attributes: {'data-interval': {
                          value: '10'
                        }}}});
                }
                else {
                  self.syncClick({target: {attributes: {'data-interval': {
                          value: '0'
                        }}}});
                }
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              })
              .finally(() => {
                ViewModelUtils.setPreloaderVisibility(false);
              });

          });
      };

      this.launchActionMenu = function(event) {
        event.preventDefault();
        const menuId = event.target.id.replace('Launcher', '');
        document.getElementById(menuId).open(event);
      };

      this.actionMenuClickListener = function (event) {
        event.preventDefault();
        const fauxEvent = {
          currentTarget: {
            id:  event.target.id,
            innerText: event.target.innerText,
            attributes: event.target.attributes
          }
        };
        self.actionButtonClicked(fauxEvent);
      };
    }

    return TableToolbar;
  }
);