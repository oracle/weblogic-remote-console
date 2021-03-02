/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['jquery', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojrouter', 'signals', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', './cfe/common/runtime', 'ojs/ojcontext', './cfe/services/perspective/perspective-manager', './cfe/services/preferences/preferences', 'ojs/ojlogger', './panel_resizer', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmessages'],
  function ($, ko, ModuleElementUtils, Router, signals, ResponsiveUtils, ResponsiveKnockoutUtils, Runtime, Context, PerspectiveManager, Preferences, Logger) {
    function ControllerViewModel() {
      const PANEL_RESIZER_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--panel-resizer-width"), 10);
      const NAVSTRIP_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navstrip-max-width"), 10);
      const NAVTREE_MIN_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--resizer-left-panel-min-width"), 10);
      const NAVTREE_MAX_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navtree-max-width"), 10);

      var self = this;

      var signaling = {
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

      if (Preferences.hasThemePreference()) Runtime.setProperty(Runtime.PropertyName.CFE_CURRENT_THEME, Preferences.themePreference());

      // Media queries for responsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      this.i18n = {
        footer: {
          text: {
            copyrightLegal: "Copyright © 2020, 2021, Oracle and/or its affiliates.<br/>Oracle is a registered trademark of Oracle Corporation and/or its affiliates. Other names may be trademarks of their respective owners.<br/>",
            builtWith: "Built with Oracle JET"
          }
        }
      };

      this.navTreeModuleConfig = ko.observable({ view: [], viewModel: null });

      var router = Router.rootInstance;
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
          var name = 'header';
          var viewPath = 'views/template/' + name + '.html';
          var modelPath = 'viewModels/template/' + name;
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
          var viewPath = 'views/template/' + name + '.html';
          var modelPath = 'viewModels/template/' + name;
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

      this.loadNavTree = function (perspectiveId) {
        let name = perspectiveId + "/navtree";
        let perspective = PerspectiveManager.getById(perspectiveId);

        ModuleElementUtils.createConfig({
          viewPath: 'views/' + name + '.html',
          viewModelPath: 'viewModels/' + name,
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
          var name = "content-area-header";
          var viewPath = 'views/template/' + name + '.html';
          var modelPath = 'viewModels/template/' + name;
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
          var name = "ancillary-content-area";
          var viewPath = 'views/template/' + name + '.html';
          var modelPath = 'viewModels/template/' + name;
          return ModuleElementUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath,
            params: {
              parentRouter: self.router,
              signaling: signaling,
              onAncillaryContentAreaToggled: toggledAncillaryContentArea,
              onResized: resizeTriggered
            }
          });
        });
      };
      this.loadAncillaryContentAreaTemplate();

      function setThemePreference(theme) {
        setFooter(theme);
        signaling.themeChanged.dispatch(theme);
      }

      function setFooter(theme) {
        let ele = document.querySelector("footer");
        if (ele !== null) {
          ele.style.backgroundColor = Runtime.getConfig().settings.themes[theme][0];

          let ele1 = document.getElementById("copyright-legal");
          if (ele1 !== null) ele1.innerHTML = self.i18n.footer.text.copyrightLegal;

          ele1 = document.getElementById("oracle-jet-label");
          if (ele1 !== null) ele1.innerHTML = self.i18n.footer.text.builtWith;

          ele1 = document.getElementById("oracle-jet-icon");

          switch (theme) {
            case "light":
              ele.style.color = "black";
              if (ele1 !== null) ele1.src = "../../images/oracle-jet-logo-blk_16x16.png"
              break;
            case "dark":
              ele.style.color = "white";
              if (ele1 !== null) ele1.src = "../../images/oracle-jet-logo-wht_16x16.png"
              break;
          }
        }
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
        document.documentElement.style.setProperty("--domains-toolbar-right-margin-right", `${marginRightVariable}px`);
      }

      function resizeTableFormContainer(source) {
        if (source === "opener") {
          let maxWidthVariable = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--domains-toolbar-right-margin-right"), 10);
          maxWidthVariable += (NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH);
          document.documentElement.style.setProperty("--form-container-calc-max-width", `${maxWidthVariable}px`);
        }
      }

      function getBrowserViewPortValues() {
        return {height: $(window).height(), width: $(window).width()};
      }

      signaling.perspectiveSelected.add((newPerspective) => {
        if (typeof newPerspective === "undefined") {
          Logger.info(`[APPCONTROLLER] newPerspective is undefined`);
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
            case "OFFLINE":
              ele.style.display = "none";
              router.go("home");
              break;
          }
        }
      });

      Context.getPageContext().getBusyContext().whenReady()
      .then(function () {
        setThemePreference(Preferences.themePreference());
        $('#spa-resizer').split({limit: 10});
      })
      .catch((err) => {
        Logger.error(err);
      });
    }

    return new ControllerViewModel();
  }
);
