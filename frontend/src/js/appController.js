/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['jquery', 'ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojrouter', 'signals', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', './apis/message-displaying', './core/runtime', 'ojs/ojcontext', './microservices/provider-management/data-provider-manager', './microservices/perspective/perspective-manager', './microservices/perspective/perspective-memory-manager', './microservices/preferences/preferences', './viewModels/utils', './core/utils', './core/types',  'ojs/ojlogger', './panel_resizer', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmessages'],
  function ($, oj, ko, ModuleElementUtils, Router, signals, ResponsiveUtils, ResponsiveKnockoutUtils, MessageDisplaying, Runtime, Context, DataProviderManager, PerspectiveManager, PerspectiveMemoryManager, Preferences, ViewModelUtils, CoreUtils, CoreTypes, Logger) {
    function ControllerViewModel() {
      const PANEL_RESIZER_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--panel-resizer-width"), 10);
      const NAVSTRIP_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navstrip-max-width"), 10);
      const NAVTREE_MIN_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--resizer-left-panel-min-width"), 10);
      const NAVTREE_MAX_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navtree-max-width"), 10);

      const self = this;

      const signaling = {
        modeChanged: new signals.Signal(),
        domainChanged: new signals.Signal(),
        perspectiveChanged: new signals.Signal(),
        perspectiveSelected: new signals.Signal(),
        themeChanged: new signals.Signal(),
        ancillaryContentAreaToggled: new signals.Signal(),
        tabStripTabSelected: new signals.Signal(),
        shoppingCartModified: new signals.Signal(),
        navtreeToggled: new signals.Signal(),
        navtreeLoaded: new signals.Signal(),
        navtreeSelectionCleared: new signals.Signal(),
        navtreeUpdated: new signals.Signal(),
        navtreeResized: new signals.Signal(),
        popupMessageSent: new signals.Signal(),
        showStartupTasksTriggered: new signals.Signal(),
        autoSyncCancelled: new signals.Signal(),
        readonlyChanged: new signals.Signal(),
        dataProviderSectionToggled: new signals.Signal(),
        dataProviderSelected: new signals.Signal(),
        dataProviderRemoved: new signals.Signal(),
        projectSwitched: new signals.Signal(),
        beanTreeChanged: new signals.Signal()
      };

      MessageDisplaying.setPopupMessageSentSignal(signaling["popupMessageSent"]);

      Runtime.setProperty(Runtime.PropertyName.CFE_NAME, oj.Translations.getTranslatedString("wrc-header.text.appName"));

      if (Preferences.general.hasThemePreference()) Runtime.setProperty(Runtime.PropertyName.CFE_CURRENT_THEME, Preferences.general.themePreference());

      if (CoreUtils.isNotUndefinedNorNull(window.electron_api)) {
        window.electron_api.ipc.receive('on-signal-dispatched', (signal) => {
          Logger.info(`[APPCONTROLLER] channel='on-signal-dispatched', signal=${signal.name}`);
        });
      }

      // Media queries for responsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      this.navTreeModuleConfig = ko.observable({ view: [], viewModel: null });

      const router = Router.rootInstance;
      this.router = router;
      Router.defaults['urlAdapter'] = new Router.urlParamAdapter();

      // Support for bookmarking calls for objects in router
      // configuration to have a 'title' field, or else web
      // browser tabs will begin with "undefined -".
      router.configure({
        "home": { label: "Home", value: "home", title: Runtime.getName(), isDefault: true },
        "landing/{perspectiveId}": { label: "Landing", value: "landing", title: Runtime.getName() },
        "configuration/{path}": { label: "WebLogic", value: "configuration", title: Runtime.getName() },
        "monitoring/{path}": { label: "Monitoring", value: "monitoring", title: Runtime.getName() },
        "view/{path}": { label: "View", value: "view", title: Runtime.getName() },
        "modeling/{path}": { label: "Modeling", value: "modeling", title: Runtime.getName() }
      });

      this.getSignal = function (key) {
        return (key in signaling ? signaling[key] : undefined);
      };

      this.loadModule = function () {
        self.moduleConfig = ko.pureComputed(function () {
          const name = self.router.moduleConfig.name();
          if (CoreUtils.isNotUndefinedNorNull(name)) {
            const viewPath = 'views/' + name + '.html';
            const modelPath = 'viewModels/' + name;
            const viewParams = { parentRouter: self.router, signaling: signaling };

            let dataProvider;
            const perspective = PerspectiveManager.getById(name);
            if (CoreUtils.isNotUndefinedNorNull(perspective)) {
              // This means that the viewModel being loaded is
              // for a perspective (i.e. configuration,
              // monitoring, modeling, view), so stash the
              // perspective in the view parameters.
              viewParams["perspective"] = perspective;
            }

            if (CoreUtils.isNotUndefinedNorNull(perspective)) {
              // We're trying to load a perspective, so
              // a data provider is required to continue.
              dataProvider = DataProviderManager.getLastActivatedDataProvider();
              if (CoreUtils.isUndefinedOrNull(dataProvider)) {
                // Didn't get a data provider, which could be
                // because none have been created yet. Just
                // return an empty moduleConfig.
                return { view: [], viewModel: null };
              }
              // The DataProvider class knows how to map a
              // perspective to one of it's beanTrees.
              const beanTree = dataProvider.getBeanTreeByPerspectiveId(perspective.id);
              if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
                // Stash the beanTree metadata in the view
                // parameters.
                viewParams["beanTree"] = beanTree;
              }
            }

            return ModuleElementUtils.createConfig({
              viewPath: viewPath,
              viewModelPath: modelPath,
              params: viewParams
            });
          }
          else {
            return { view: [], viewModel: null };
          }
        });
      };

      this.loadHeaderTemplate = function () {
        self.headerModuleConfig = ko.pureComputed(function () {
          const name = 'header';
          const viewPath = 'views/branding-area/' + name + '.html';
          const modelPath = 'viewModels/branding-area/' + name;
          return ModuleElementUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath,
            params: {
              parentRouter: self.router,
              smQuery: smQuery,
              mdQuery: mdQuery,
              signaling: signaling,
              onResized: resizeTriggered,
              onDataProvidersEmpty: selectAncillaryContentAreaTab
            }
          });
        });
      };
      this.loadHeaderTemplate();

      this.loadNavStripTemplate = function () {
        self.navStripModuleConfig = ko.pureComputed(function () {
          var name = 'navstrip';
          var viewPath = 'views/navigation-area/' + name + '.html';
          var modelPath = 'viewModels/navigation-area/' + name;
          return ModuleElementUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath,
            params: {
              parentRouter: self.router,
              signaling: signaling,
              onResized: resizeTriggered,
              onDataProviderRemoved: setTableFormContainerVisibility
            }
          });
        });
      };
      this.loadNavStripTemplate();

      this.loadFooterTemplate = function () {
        self.footerModuleConfig = ko.pureComputed(function () {
          var name = 'footer';
          var viewPath = 'views/footer/' + name + '.html';
          var modelPath = 'viewModels/footer/' + name;
          return ModuleElementUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath,
            params: {
              parentRouter: self.router,
              smQuery: smQuery,
              mdQuery: mdQuery,
              signaling: signaling
            }
          });
        });
      };
      this.loadFooterTemplate();

      this.loadNavTree = function (perspectiveId, beanTree) {
        const name = "navtree";
        const perspective = PerspectiveManager.getById(perspectiveId);

        ModuleElementUtils.createConfig({
          viewPath: 'views/navigation-area/' + name + '.html',
          viewModelPath: 'viewModels/navigation-area/' + name,
          params: {
            parentRouter: self.router,
            signaling: signaling,
            onResized: resizeTriggered,
            perspective: perspective,
            beanTree: beanTree
          }
        })
          .then(function (moduleConfigPromise) {
            self.navTreeModuleConfig(moduleConfigPromise);
            signaling.navtreeLoaded.dispatch(perspective);
          });
      };

      this.loadContentAreaHeaderTemplate = function () {
        self.contentAreaHeaderModuleConfig = ko.pureComputed(function () {
          const name = "content-area-header";
          const viewPath = 'views/content-area/header/' + name + '.html';
          const modelPath = 'viewModels/content-area/header/' + name;
          return ModuleElementUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath,
            params: {
              parentRouter: self.router,
              signaling: signaling
            }
          });
        });
      };
      this.loadContentAreaHeaderTemplate();

      this.loadAncillaryContentAreaTemplate = function () {
        self.ancillaryContentAreaModuleConfig = ko.pureComputed(function () {
          var name = "ancillary-content";
          var viewPath = 'views/content-area/' + name + '.html';
          var modelPath = 'viewModels/content-area/' + name;
          return ModuleElementUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath,
            params: {
              parentRouter: self.router,
              signaling: signaling,
              onAncillaryContentAreaToggled: toggleAncillaryContentArea
            }
          });
        });
      };
      this.loadAncillaryContentAreaTemplate();

      function setThemePreference(theme) {
        signaling.themeChanged.dispatch(theme);
      }

      function toggleAncillaryContentArea(visible) {
        signaling.ancillaryContentAreaToggled.dispatch(visible);
      }

      function selectAncillaryContentAreaTab(source, tabId) {
        signaling.tabStripTabSelected.dispatch(source, tabId, true);
      }

      function resizeTriggered(source, newOffsetLeft, newOffsetWidth) {
        if (newOffsetWidth > 0) {
          let minWidthVariable;
          switch (newOffsetWidth) {
            case (NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH):
              minWidthVariable = newOffsetWidth;
              document.documentElement.style.setProperty("--content-area-container-min-width", `${minWidthVariable}px`);
              break;
            case NAVTREE_MIN_WIDTH:
              minWidthVariable = NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH;
              document.documentElement.style.setProperty("--content-area-container-min-width", `${minWidthVariable}px`);
              break;
            case NAVTREE_MAX_WIDTH:
            case (NAVSTRIP_WIDTH + NAVTREE_MAX_WIDTH):
              minWidthVariable = newOffsetWidth;
              document.documentElement.style.setProperty("--content-area-container-min-width", `${minWidthVariable}px`);
              break;
            default:
              minWidthVariable = PANEL_RESIZER_WIDTH;
              document.documentElement.style.setProperty("--content-area-container-min-width", `${minWidthVariable}px`);
              break;
          }
        }
        else {
          Logger.info(`[APPCONTROLLER] newOffsetWidth=0`);
        }

        resizeContentAreaElements(source, newOffsetLeft, newOffsetWidth);
      }

      function resizeContentAreaElements(source, newOffsetLeft, newOffsetWidth) {
        const viewPortValues = getBrowserViewPortValues();
        Logger.info(`[APPCONTROLLER] window.width=${viewPortValues.width}, window.height=${viewPortValues.height}`);
        if (newOffsetWidth !== viewPortValues.width) resizeDomainsToolbarRight(source, newOffsetLeft, newOffsetWidth);
        resizeTableFormContainer(source);
      }

      function resizeDomainsToolbarRight(source, newOffsetLeft, newOffsetWidth) {
        let marginRightVariable;
        if (source === "closer") {
          if (newOffsetWidth === NAVTREE_MIN_WIDTH) {
            marginRightVariable = 0;
          } else {
            marginRightVariable = NAVSTRIP_WIDTH;
          }
        } else if (source === "opener") {
          marginRightVariable = newOffsetWidth;
        } else if (source === "navtree") {
          marginRightVariable = 0;
        }
        document.documentElement.style.setProperty("--content-area-header-toolbar-right-margin-right", `${marginRightVariable}px`);
      }

      function resizeTableFormContainer(source) {
        if (source === "opener") {
          let maxWidthVariable = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--content-area-header-toolbar-right-margin-right"), 10);
          maxWidthVariable += (NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH);
          document.documentElement.style.setProperty("--form-container-calc-max-width", `${maxWidthVariable}px`);
        }
      }

      function getBrowserViewPortValues() {
        return {height: $(window).height(), width: $(window).width()};
      }

      signaling.perspectiveSelected.add((newPerspective) => {
        if (CoreUtils.isUndefinedOrNull(newPerspective)) {
          Logger.info(`[APPCONTROLLER] newPerspective is undefined`);
          newPerspective = PerspectiveManager.getDefault();
        }
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

        const dataProvider = DataProviderManager.getLastActivatedDataProvider();
        // See if navTreeModuleConfig has a viewModel in it.
        const viewModel = self.navTreeModuleConfig().viewModel;
        if (CoreUtils.isNotUndefinedNorNull(viewModel)) {
          // There is already a viewModel in navTreeModuleConfig, but
          // we only want to reload it if it isn't for the viewModel
          // associated with active
          const perspective = viewModel.perspective();
          const beanTree = dataProvider.getBeanTreeByPerspectiveId(active.id);
          if (CoreUtils.isNotUndefinedNorNull(perspective) && perspective.id !== active.id) {
            self.loadNavTree(active.id, beanTree);
          }
        }
        else {
          const beanTree = dataProvider.getBeanTreeByPerspectiveId(active.id);
          // There is no viewModel in navTreeModuleConfig, so
          // load navtree for active
          self.loadNavTree(active.id, beanTree);
        }
      });

      signaling.navtreeLoaded.add((perspective) => {
        // Get active (e.g. current) current perspective from PerspectiveManager
        let active = PerspectiveManager.current();
        if (typeof active === 'undefined') {
          // There was no active perspective, so make the
          // one assigned to the perspective parameter, the
          // active one.
          Logger.log(`[APPCONTROLLER] previous current: undefined`);
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

      signaling.modeChanged.add((newMode) => {
        const div = document.getElementById("table-form-container");
        if (div !== null) {
          // Do the appropriate thing to the selected div.
          switch (newMode) {
            case CoreTypes.Console.RuntimeMode.ONLINE.name:
            case CoreTypes.Console.RuntimeMode.OFFLINE.name:
              div.style.display = "inline-flex";
              break;
            case CoreTypes.Console.RuntimeMode.DETACHED.name:
              div.style.display = "none";
              router.go("home");
              break;
          }
        }
      });

      signaling.projectSwitched.add((fromProject) => {
        setTableFormContainerVisibility(false);
      });

      function setTableFormContainerVisibility(visible) {
        const div = document.getElementById("table-form-container");
        if (div !== null) {
          div.style.display = (visible ? "inline-flex" : "none");
        }
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(function () {
          document.cookie = "expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/api;";
          setThemePreference(Preferences.general.themePreference());
          $('#spa-resizer').split({limit: 10});
          // Pass the mode changed signal so that memory can be cleared
          PerspectiveMemoryManager.setModeChangedSignal(signaling.modeChanged);
        })
        .catch((err) => {
          Logger.error(err);
        });
    }

    return new ControllerViewModel();
  }
);
