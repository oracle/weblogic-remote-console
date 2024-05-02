/**
 * @license
 * Copyright (c) 2020, 2024, Oracle Corp and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojrouter',
  'ojs/ojarraydataprovider',
  'wrc-frontend/microservices/perspective/perspective-manager',
  'wrc-frontend/microservices/provider-management/data-provider-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils',
  'wrc-frontend/core/types',
  'ojs/ojknockout',
  'ojs/ojnavigationlist'
],
  function(
    oj,
    ko,
    Router,
    ArrayDataProvider,
    PerspectiveManager,
    DataProviderManager,
    ViewModelUtils,
    Runtime,
    CoreUtils,
    CoreTypes
  ){
    function NavStripTemplate(viewParams){
      var self = this;

      var builtIns = ko.observableArray();

      this.builtInsDataProvider = loadBuiltInPerspectives(Runtime.getDomainConnectState());

      function loadBuiltInPerspectives(connectState, dataProvider){
        let dataArray = [];
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          dataArray = dataProvider.beanTrees;
        }
        else {
          dataProvider = DataProviderManager.getLastActivatedDataProvider();
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            dataArray = dataProvider.beanTrees;
          }
        }

        // dataArray will be empty if:
        //
        //  1. There is no default project, or
        //  2. No dataProvider parameter was passed into this function, or
        //  3. The default project did not have any data providers

        if (dataArray.length > 0) {
          dataArray.forEach((beanTree) => {
            const perspective = PerspectiveManager.getByBeanTreeType(beanTree.type);
            if (connectState === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              beanTree['iconFile'] = perspective.iconFiles['light'];
            }
            else {
              beanTree['iconFile'] = perspective.iconFiles['greyed'];
            }
            beanTree['label'] = oj.Translations.getTranslatedString(`wrc-navstrip.icons.${beanTree.type}.tooltip`);
          });
        }

        builtIns(dataArray);

        if (CoreUtils.isUndefinedOrNull(self.builtInsDataProvider)) {
          return new ArrayDataProvider(
            builtIns, { keyAttributes: 'type' }
          );
        }
        else {
          return self.builtInsDataProvider;
        }
      }

      this.i18n = {
        'ariaLabel': {
          'navstrip': {
            'value': oj.Translations.getTranslatedString('wrc-navigation.ariaLabel.navstrip.value')
          }
        },
        icons: {
          'configuration': { iconFile: 'navstrip-icon-readwrite-configuration-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-navstrip.icons.configuration.tooltip')
          },
          'view': { iconFile: 'navstrip-icon-readonly-configuration-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-navstrip.icons.view.tooltip')
          },
          'monitoring': { iconFile: 'navstrip-icon-monitoring-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-navstrip.icons.monitoring.tooltip')
          },
          'security': { iconFile: 'navstrip-icon-security-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-navstrip.icons.security.tooltip')
          },
          'modeling': { iconFile: 'navstrip-icon-wdt-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-navstrip.icons.modeling.tooltip')
          },
          'composite': { iconFile: 'navstrip-icon-wdt-composite-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-navstrip.icons.composite.tooltip')
          },
          'properties': { iconFile: 'navstrip-icon-property-list-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-navstrip.icons.properties.tooltip')
          },
          'nodata': { iconFile: 'navstrip-icon-nodata-blk_48x48',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.noData.value')
          }
        }
      };

      this.builtInsSelectedItem = ko.observable(null);

      this.signalBindings = [];

      this.connected = function () {
        // Be sure to create a binding for any signaling add in
        // this module. In fact, the code for the add needs to
        // be moved here physically.

        let binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          clearNavStripIcons();
          clearBuiltInsSelection();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.galleryItemSelected.add((value) => {
          self.builtInsSelectedItem(value);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          self.canExitCallback = undefined;
          self.builtInsSelectedItem(null);
          self.builtInsDataProvider = loadBuiltInPerspectives(
            Runtime.getDomainConnectState(),
            dataProvider
          );
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((dataProvider) => {
          const beanTree = builtIns().find(item => item.provider.id === dataProvider.id);
          const clearNavstripIcons = (CoreUtils.isNotUndefinedNorNull(beanTree));
          if (clearNavstripIcons) {
            clearNavStripIcons();
            clearBuiltInsSelection();
            viewParams.onDataProviderRemoved(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderLoadFailed.add((dataProvider) => {
          const beanTree = builtIns().find(item => item.provider.id === dataProvider.id);
          const clearNavstripIcons = (CoreUtils.isNotUndefinedNorNull(beanTree));
          if (clearNavstripIcons) {
            clearNavStripIcons();
            clearBuiltInsSelection();
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          clearNavStripIcons();
          setNoDataIcon();
          clearBuiltInsSelection();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        self.signalBindings.push(binding);
      }.bind(this);

      this.disconnected = function() {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      this.onKeyUp = (event) => {
        if (event.key === 'ArrowRight' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
          let target = document.querySelector('#nav');
          if (target !== null) {
            $(target).focus();
          }
          else {
            target = document.querySelector('#home');
            if (target !== null) $(target).focus();
          }
        }
      };

      this.builtInsBeforeSelectEventHandler = function(event) {
        const connectState = Runtime.getDomainConnectState();
        if (connectState === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          event.preventDefault();
          return false;
        }
      };

      this.builtInsSelectedItemChanged = function(event) {
        const connectState = Runtime.getDomainConnectState();
        if (connectState === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          event.preventDefault();
          return false;
        }

        const beanTree = getSelectedBeanTree(event.detail.value);
        if (CoreUtils.isUndefinedOrNull(beanTree)) {
          event.preventDefault();
          return false;
        }

        ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
          .then(reply => {
            if (reply) {
              if (self.builtInsSelectedItem() !== null) {
                viewParams.signaling.beanTreeChanged.dispatch(beanTree);
                viewParams.signaling.appMenuChangeRequested.dispatch('gallery', 'disableMenu', beanTree.type !== 'configuration', {menuId: 'goMenu', menuItemId: 'shoppingCartDrawer'});
              }

              Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, CoreUtils.isUndefinedOrNull(beanTree.readOnly) ? false : beanTree.readOnly);
              viewParams.signaling.readonlyChanged.dispatch(Runtime.isReadOnly());

              builtInsSelected(beanTree);
            }
            else {
              self.builtInsSelectedItem(null);
            }
          })
          .catch(failure => {
            ViewModelUtils.failureResponseDefaultHandling(failure);
          });
      };

      function builtInsSelected(beanTree) {
        const newPerspective = PerspectiveManager.getByBeanTreeType(beanTree.type);
        if (CoreUtils.isNotUndefinedNorNull(newPerspective)) {
          // Signal that a new perspective was selected
          // from the builtIns navstrip
          viewParams.signaling.perspectiveSelected.dispatch(newPerspective);
          viewParams.signaling.perspectiveChanged.dispatch(newPerspective);

          switch (viewParams.parentRouter.stateId()) {
            case 'landing':
              viewParams.parentRouter.observableModuleConfig().params.ojRouter.parameters.perspectiveId(newPerspective.id);
            // Don't break, just fall through to case for "home" stateId
            case 'home':
              viewParams.parentRouter.go(`landing/${newPerspective.id}`);
              break;
            default:
              if (viewParams.parentRouter.stateId() !== newPerspective.id) {
                // Go to landing page for newPerspective.id
                viewParams.parentRouter.go(`landing/${newPerspective.id}`);
              }
              break;
          }
        }
      }

      function clearNavStripIcons() {
        builtIns.valueWillMutate();
        builtIns.removeAll();
        builtIns.valueHasMutated();
      }

      function setNoDataIcon() {
        const canvas = document.getElementById('nodata-canvas');
        if (canvas !== null) {
          canvas.setAttribute('title', '');
          const ctx = canvas.getContext('2d');
          const img = document.getElementById('nodata-icon');
          ctx.drawImage(img, 0, 0);
        }
      }

      function getSelectedBeanTree(beanTreeType) {
        let beanTree;
        const index = CoreUtils.getLastIndex(builtIns(), 'type', beanTreeType);
        if (index !== -1) beanTree = builtIns()[index];
        return beanTree;
      }

      function clearBuiltInsSelection(){
        self.builtInsSelectedItem(null);
      }

    }

    return NavStripTemplate;
  }
);