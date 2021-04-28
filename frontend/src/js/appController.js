/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['jquery', 'ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojrouter', 'signals', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', './apis/message-displaying', './core/runtime', 'ojs/ojcontext', './microservices/perspective/perspective-manager', './microservices/perspective/perspective-memory-manager', './microservices/preferences/preferences', './viewModels/utils', 'ojs/ojlogger', './panel_resizer', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmessages'],
  function ($, oj, ko, ModuleElementUtils, Router, signals, ResponsiveUtils, ResponsiveKnockoutUtils, MessageDisplaying, Runtime, Context, PerspectiveManager, PerspectiveMemoryManager, Preferences, ViewModelUtils, Logger) {
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
        autoSyncCancelled: new signals.Signal(),
        domainConnectionInitiated: new signals.Signal(),
        readonlyChanged: new signals.Signal()
      };

      MessageDisplaying.setPopupMessageSentSignal(signaling["popupMessageSent"]);

      Runtime.setProperty(Runtime.PropertyName.CFE_NAME, oj.Translations.getTranslatedString("wrc-header.text.appName"));

      if (Preferences.general.hasThemePreference()) Runtime.setProperty(Runtime.PropertyName.CFE_CURRENT_THEME, Preferences.general.themePreference());

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
        "monitoring/{path}": { label: "Monitoring", value: "monitoring", title: Runtime.getName() }
      });

      this.getSignal = function (key) {
        return (key in signaling ? signaling[key] : undefined);
      };

      this.loadModule = function () {
        self.moduleConfig = ko.pureComputed(function () {
          var name = self.router.moduleConfig.name();
          if (typeof name !== "undefined") {
            var viewPath = 'views/' + name + '.html';
            var modelPath = 'viewModels/' + name;
            let viewParams = { parentRouter: self.router, signaling: signaling };
            let perspective = PerspectiveManager.getById(name);

            if (typeof perspective !== "undefined") {
              viewParams["perspective"] = perspective;
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
              onResized: resizeTriggered
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
              onResized: resizeTriggered
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

      this.loadNavTree = function (perspectiveId) {
        const name = "navtree";
        const perspective = PerspectiveManager.getById(perspectiveId);

        ModuleElementUtils.createConfig({
          viewPath: 'views/navigation-area/' + name + '.html',
          viewModelPath: 'viewModels/navigation-area/' + name,
          params: {
            parentRouter: self.router,
            signaling: signaling,
            onResized: resizeTriggered,
            perspective: perspective
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
              onAncillaryContentAreaToggled: toggledAncillaryContentArea
            }
          });
        });
      };
      this.loadAncillaryContentAreaTemplate();

      function setThemePreference(theme) {
        signaling.themeChanged.dispatch(theme);
      }

      function toggledAncillaryContentArea(visible) {
        signaling.ancillaryContentAreaToggled.dispatch(visible);
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
          Logger.info(`newOffsetWidth=0`);
        }

        resizeContentAreaElements(source, newOffsetLeft, newOffsetWidth);
      }

      function resizeContentAreaElements(source, newOffsetLeft, newOffsetWidth) {
        const viewPortValues = getBrowserViewPortValues();
        Logger.info(`window.width=${viewPortValues.width}, window.height=${viewPortValues.height}`);
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
        if (typeof newPerspective === "undefined") {
          Logger.info(`newPerspective is undefined`);
          newPerspective = PerspectiveManager.getDefault();
        }
        let active = PerspectiveManager.current();
        if (typeof active === "undefined") {
          // There is no active perspective, so make newPerspective
          // the active one, but don't load it's navtree
          active = PerspectiveManager.activate(newPerspective.id);
          // Be aware that active will be undefined, when newPerspective is
          // for the landing or home page. In that case, we just want to
          // assign newPerspective to active.
          if (typeof active === "undefined") active = newPerspective;
        }
        else {
          active = newPerspective;
        }

        // See if navTreeModuleConfig has a viewModel in it.
        const viewModel = self.navTreeModuleConfig().viewModel;
        if (typeof viewModel !== "undefined" && viewModel !== null) {
          // There is already a viewModel in navTreeModuleConfig, but
          // we only want to reload it if it isn't for the viewModel
          // associated with active
          const perspective = viewModel.perspective();
          if (typeof perspective !== "undefined" && perspective.id !== active.id) {
            self.loadNavTree(active.id);
          }
        }
        else {
          // There is no viewModel in navTreeModuleConfig, so
          // load navtree for active
          self.loadNavTree(active.id);
        }
      });

      signaling.navtreeLoaded.add((perspective) => {
        // Get active (e.g. current) current perspective from PerspectiveManager
        let active = PerspectiveManager.current();
        if (typeof active === 'undefined') {
          // There was no active perspective, so make the
          // one assigned to the perspective parameter, the
          // active one.
          Logger.log(`previous current: undefined`);
          active = PerspectiveManager.activate(perspective.id);
        }
        else if (active.id !== perspective.id) {
          // There was an active perspective, and it wasn't
          // the one assigned to the perspective parameter.
          // In this case, we tell the PerspectiveManager to
          // make the perspective passed as a parameter the
          // active perspective.
          Logger.info(`previous current: ${active.id}, new current: ${perspective.id}`);
          active = PerspectiveManager.activate(perspective.id);
        }

        Logger.info(`new current: ${active.id}`);
      });

      signaling.modeChanged.add((newMode) => {
        const ele = document.getElementById("content-area-body");
        if (ele !== null) {
          switch (newMode) {
            case "ONLINE":
              ele.style.display = "inline-flex";
              break;
            case "DETACHED":
              ele.style.display = "none";
              router.go("home");
              break;
          }
        }
      });

      Context.getPageContext().getBusyContext().whenReady()
        .then(function () {
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
