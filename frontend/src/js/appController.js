/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    'ojs/ojmodule-element-utils',
    'ojs/ojrouter',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',
    'ojs/ojhtmlutils',
    'wrc-frontend/common/controller',
    './app-resizer',
    'wrc-frontend/core/runtime',
    'ojs/ojcontext',
    'wrc-frontend/microservices/app-profile/app-profile-manager',
    'wrc-frontend/microservices/provider-management/data-provider-manager',
    'wrc-frontend/microservices/perspective/perspective-manager',
    'wrc-frontend/microservices/perspective/perspective-memory-manager',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/core/utils',
    'wrc-frontend/core/types',
    'ojs/ojlogger',
    'wrc-frontend/common/panel_resizer',
    'ojs/ojarraydataprovider',
    'ojs/ojknockout',
    'ojs/ojmodule-element',
    'ojs/ojmessages',
    'ojs/ojbinddom',
    'cfe-navtree/loader'
  ],
  function (
    oj,
    ko,
    ModuleElementUtils,
    Router,
    ResponsiveUtils,
    ResponsiveKnockoutUtils,
    HtmlUtils,
    Controller,
    AppResizer,
    Runtime,
    Context,
    AppProfileManager,
    DataProviderManager,
    PerspectiveManager,
    PerspectiveMemoryManager,
    ViewModelUtils,
    CoreUtils,
    CoreTypes,
    Logger
  ) {
    function ControllerViewModel() {
      const self = this;
      
      this.i18n = {
        'ariaLabel': {
          'panelResizer': {
            'value': oj.Translations.getTranslatedString('wrc-navigation.ariaLabel.panelResizer.value')
          }
        },
        buttons: {
          yes: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.yes.label')
          },
          no: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.no.label')
          },
          ok: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.ok.label')
          },
          cancel: {
            disabled: false,
            visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
          }
        },
        images: {
          preloader: {
            iconFile: 'preloader-rounded-blocks-grn_12x64x64',
            label: oj.Translations.getTranslatedString('wrc-common.tooltips.preloader.value')
          }
        },
        dialog: {
          title: ko.observable(''),
          instructions: ko.observable(''),
          prompt: ko.observable('')
        }
      };
      
      // Media queries for responsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
      
      this.appResizer = new AppResizer('#globalBody');
      
      this.beanTree = ko.observable();
      this.navtree = {html: ko.observable({})};
      
      const router = Controller.getRootRouter();
      this.router = router;
      
      // Support for bookmarking calls for objects in router
      // configuration to have a 'title' field, or else web
      // browser tabs will begin with "undefined -".
      router.configure({
        'home': { label: 'Home', value: 'home', title: Runtime.getName(), isDefault: true },
        'landing/{perspectiveId}': { label: 'Landing', value: 'landing', title: Runtime.getName() },
        'configuration/{path}': { label: 'WebLogic', value: 'configuration', title: Runtime.getName() },
        'monitoring/{path}': { label: 'Monitoring', value: 'monitoring', title: Runtime.getName() },
        'view/{path}': { label: 'View', value: 'view', title: Runtime.getName() },
        'security/{path}': { label: 'Security', value: 'security', title: Runtime.getName() },
        'modeling/{path}': { label: 'Modeling', value: 'modeling', title: Runtime.getName() },
        'composite/{path}': { label: 'Composite', value: 'composite', title: Runtime.getName() },
        'properties/{path}': { label: 'Properties', value: 'properties', title: Runtime.getName() }
      });
      
      function onStartUp() {
        function initializeStartupRuntimeVariables(){
          Runtime.setProperty(Runtime.PropertyName.CFE_NAME, oj.Translations.getTranslatedString('wrc-header.text.appName'));
          // Set runtime role based on value assigned to data-runtime-role
          // attribute.
          const ele = document.getElementById('middle-container');
          if (ele !== null) {
            Runtime.setProperty(Runtime.PropertyName.CFE_ROLE, ele.getAttribute('data-runtime-role'));
          }
        }
        
        function registerGlobalBodyOnClickHandler() {
          const div = document.getElementById('globalBody');
          if (div !== null) {
            div.onclick = (event) => {
              if (event.metaKey) {
                event.stopImmediatePropagation();
                event.preventDefault();
                return false;
              }
            };
          }
        }
        
        const registerAppControllerElectronIPCs = () => {
          if (ViewModelUtils.isElectronApiAvailable()) {
            window.electron_api.ipc.receive('start-app-quit', async () => {
              Logger.info('[APPCONTROLLER] \'start-app-quit\' Received event.');
              if (Controller.getSignal('appQuitTriggered').getNumListeners() > 0) {
                Controller.getSignal('appQuitTriggered').dispatch();
              }
              else {
                window.electron_api.ipc.invoke('window-app-quiting',  {preventQuitting: false, source: 'appController.js'});
              }
            });
          }
        };
        
        const registerAppControllerSignalAddListeners = () => {
          Controller.getSignal('navtreeResized').add((source, newOffsetLeft, newOffsetWidth) => {
            self.appResizer.resizeTriggered(source, newOffsetLeft, newOffsetWidth);
          });
          
          Controller.getSignal('navtreeLoaded').add((perspective) => {
            // Get active (e.g. current) current perspective from PerspectiveManager
            let active = PerspectiveManager.current();
            if (typeof active === 'undefined') {
              // There was no active perspective, so make the
              // one assigned to the perspective parameter, the
              // active one.
              Logger.info('[APPCONTROLLER] previous current: undefined');
              active = PerspectiveManager.activate(perspective.id);
            }
            else if (active.id !== perspective.id) {
              // There was an active perspective, and it wasn't
              // the one assigned to the perspective parameter.
              // In this case, we tell the PerspectiveManager to
              // make the perspective passed as a parameter the
              // active perspective.
              Logger.info(`[APPCONTROLLER] previous current: ${active.id}, new current: ${perspective.id}`);
              active = PerspectiveManager.activate(perspective.id);
            }
            
            Logger.info(`[APPCONTROLLER] new current: ${active.id}`);
          });
          
          Controller.getSignal('perspectiveSelected').add((newPerspective) => {
            const dataProvider = DataProviderManager.getLastActivatedDataProvider();
            if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
              let active = PerspectiveManager.current();
              if (CoreUtils.isUndefinedOrNull(active)) {
                // There is no active perspective, so make newPerspective
                // the active one, but don't load it's navtree
                active = PerspectiveManager.activate(newPerspective.id);
                // Be aware that active will be undefined, when newPerspective is
                // for the landing or home page. In that case, we just want to
                // assign newPerspective to active.
                if (CoreUtils.isUndefinedOrNull(active)) active = newPerspective;
              }
              else {
                active = newPerspective;
              }
              
              const composite = document.getElementById('wrcNavtree');
              if (composite !== null) {
                const perspective = composite.perspective;
                const beanTree = dataProvider.getBeanTreeByPerspectiveId(active.id);
                if (CoreUtils.isNotUndefinedNorNull(perspective) && perspective.id !== active.id) {
                  createNavtree(beanTree);
                  Controller.getSignal('navtreeLoaded').dispatch(perspective);
                }
              }
              else {
                const beanTree = dataProvider.getBeanTreeByPerspectiveId(active.id);
                createNavtree(beanTree);
                Controller.getSignal('navtreeLoaded').dispatch(active);
              }
            }
          });
          
          Controller.getSignal('modeChanged').add((newMode) => {
            const div = document.getElementById('table-form-container');
            if (div !== null) {
              // Do the appropriate thing to the selected div.
              switch (newMode) {
                case CoreTypes.Console.RuntimeMode.ONLINE.name:
                case CoreTypes.Console.RuntimeMode.OFFLINE.name:
                  div.style.display = 'inline-flex';
                  break;
                case CoreTypes.Console.RuntimeMode.UNATTACHED.name:
                case CoreTypes.Console.RuntimeMode.DETACHED.name:
                  div.style.display = 'none';
                  break;
              }
            }
          });
          
          Controller.getSignal('beanTreeSelected').add((beanTree) => {
            const dataProvider = DataProviderManager.getLastActivatedDataProvider();
            setTableFormContainerVisibility(CoreUtils.isNotUndefinedNorNull(dataProvider));
          });
          
          Controller.getSignal('projectSwitched').add((fromProject) => {
            setTableFormContainerVisibility(false);
          });
          
          Controller.getSignal('dataProviderLoadFailed').add((dataProvider) => {
            if (dataProvider.id === Runtime.getDataProviderId()) {
              setTableFormContainerVisibility(false);
            }
          });
          
          Controller.getSignal('tabStripTabSelected').add((source, tabId, options) => {
            if (tabId === 'startup-tasks' && options.chooser === 'use-cards') {
              setTableFormContainerVisibility(true);
            }
          });
          
        };
        
        const registerModeChangedSignal = () => {
          // Pass the mode changed signal so that memory can be cleared
          PerspectiveMemoryManager.setModeChangedSignal(Controller.getSignal('modeChanged'));
        };
        
        registerAppControllerElectronIPCs();
        registerAppControllerSignalAddListeners();
        registerModeChangedSignal();
        registerGlobalBodyOnClickHandler();
        
        initializeStartupRuntimeVariables();
      }
      onStartUp.call(this);
      
      this.loadModule = function () {
        self.moduleConfig = ko.pureComputed(function () {
          const name = self.router.moduleConfig.name();
          return Controller.loadModule(name);
        });
      };
      
      this.loadHeaderTemplate = function () {
        self.headerModuleConfig = ko.pureComputed(function () {
          return ModuleElementUtils.createConfig({
            name: 'branding-area/header',
            params: {
              parentRouter: self.router,
              smQuery: smQuery,
              mdQuery: mdQuery,
              signaling: Controller.getSignaling(),
              onResized: resizeTriggered,
              onDataProvidersEmpty: selectAncillaryContentItem,
              onAppProfileActivated: activateAppProfile
            }
          });
        });
      };
      this.loadHeaderTemplate();
      
      this.loadNavStripTemplate = function () {
        self.navStripModuleConfig = ko.pureComputed(function () {
          return ModuleElementUtils.createConfig({
            name: 'navigation-area/navstrip',
            params: {
              parentRouter: self.router,
              signaling: Controller.getSignaling(),
              onResized: resizeTriggered,
              onDataProviderRemoved: setTableFormContainerVisibility
            }
          });
        });
      };
      this.loadNavStripTemplate();
      
      this.loadFooterTemplate = function () {
        self.footerModuleConfig = ko.pureComputed(function () {
          return ModuleElementUtils.createConfig({
            name: 'footer/footer',
            params: {
              parentRouter: self.router,
              smQuery: smQuery,
              mdQuery: mdQuery,
              signaling: Controller.getSignaling()
            }
          });
        });
      };
      this.loadFooterTemplate();
      
      this.loadContentAreaHeaderTemplate = function () {
        self.contentAreaHeaderModuleConfig = ko.pureComputed(function () {
          return ModuleElementUtils.createConfig({
            name: 'content-area/header-content',
            params: {
              parentRouter: self.router,
              signaling: Controller.getSignaling()
            }
          });
        });
      };
      this.loadContentAreaHeaderTemplate();
      
      this.loadAncillaryContentAreaTemplate = function () {
        self.ancillaryContentAreaModuleConfig = ko.pureComputed(function () {
          return ModuleElementUtils.createConfig({
            name: 'content-area/ancillary-content',
            params: {
              parentRouter: self.router,
              signaling: Controller.getSignaling()
            }
          });
        });
      };
      this.loadAncillaryContentAreaTemplate();
      
      function selectAncillaryContentItem(source, tabId) {
        const options = {stealthEnabled: false};
        if (tabId === 'provider-management') {
          AppProfileManager.getCurrentAppProfile()
            .then(reply => {
              options.stealthEnabled = reply.body.data.settings.startupTaskChooserType === 'use-cards' && source === 'domain-connection';
            })
            .finally(() => {
              self.router.go('home');
            });
          
        }
        Controller.getSignal('ancillaryContentItemSelected').dispatch(source, tabId, options);
      }
      
      function resizeTriggered(source, newOffsetLeft, newOffsetWidth) {
        self.appResizer.resizeTriggered(source, newOffsetLeft, newOffsetWidth);
      }
      
      function createNavtree(beanTree) {
        self.beanTree(beanTree);
        const outerHTML = Controller.createNavtreeHTML();
        self.navtree.html({ view: HtmlUtils.stringToNodeArray(outerHTML), data: self });
      }
      
      function setTableFormContainerVisibility(visible) {
        const div = document.getElementById('table-form-container');
        if (div !== null) {
          div.style.display = (visible ? 'inline-flex' : 'none');
        }
      }
      
      function activateAppProfile(source, tabId, options) {
        Controller.getSignal('tabStripTabSelected').dispatch(tabId, 'startup-tasks', options);
        setTableFormContainerVisibility(true);
        Controller.getSignal('ancillaryContentItemSelected').dispatch(source, tabId, options);
      }
      
      Context.getPageContext().getBusyContext().whenReady()
        .then(function () {
          document.cookie = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/api;';
          const div = document.getElementById('spa-resizer');
          if (div !== null) {
            $('#spa-resizer').split({limit: 10, position: AppResizer.prototype.SPA_RESIZER_POSITION, accesskey: '\\', nudgeable: true, nudgeBy: 20, nudgeMinWidth: AppResizer.prototype.NAVTREE_MIN_WIDTH, nudgeMaxWidth: AppResizer.prototype.NAVTREE_MAX_WIDTH, focusRule: {key: 'Escape', selector: '#home'}});
          }
        })
        .catch((err) => {
          Logger.error(err);
        });
    }
    
    return new ControllerViewModel();
  }
);
