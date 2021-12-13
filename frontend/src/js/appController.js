/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojrouter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojhtmlutils', 'wrc-frontend/controller', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/microservices/preferences/preferences', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'ojs/ojlogger', './panel_resizer', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmessages', 'ojs/ojbinddom', 'navtree-dialog/loader'],
  function (oj, ko, ModuleElementUtils, Router, ResponsiveUtils, ResponsiveKnockoutUtils, HtmlUtils, Controller, Runtime, Context, DataProviderManager, PerspectiveManager, PerspectiveMemoryManager, Preferences, ViewModelUtils, CoreUtils, CoreTypes, Logger) {
    function ControllerViewModel() {
      const PANEL_RESIZER_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty("panel-resizer-width"), 10);
      const NAVSTRIP_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty("navstrip-max-width"), 10);
      const NAVTREE_MIN_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty("resizer-left-panel-min-width"), 10);
      const NAVTREE_MAX_WIDTH = parseInt(ViewModelUtils.getCustomCssProperty("navtree-max-width"), 10);

      const self = this;

      Runtime.setProperty(Runtime.PropertyName.CFE_NAME, oj.Translations.getTranslatedString("wrc-header.text.appName"));
      // Set runtime role based on value assigned to data-runtime-role
      // attribute.
      const ele = document.getElementById("globalBody");
      Runtime.setProperty(Runtime.PropertyName.CFE_ROLE, ele.getAttribute("data-runtime-role"));

      if (ViewModelUtils.isElectronApiAvailable()) {
        window.electron_api.ipc.receive('on-signal-dispatched', (signal) => {
          Logger.info(`[APPCONTROLLER] channel='on-signal-dispatched', signal=${signal.name}`);
        });
      }

      // Media queries for responsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      this.beanTree = ko.observable();
      this.navtreeDialog = {html: ko.observable({})};

      const router = Controller.getRootRouter();
      this.router = router;

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

      this.loadModule = function () {
        self.moduleConfig = ko.pureComputed(function () {
          const name = self.router.moduleConfig.name();
          return Controller.loadModule(name);
        });
      };

      this.loadHeaderTemplate = function () {
        self.headerModuleConfig = ko.pureComputed(function () {
          return ModuleElementUtils.createConfig({
            name: "branding-area/header",
            params: {
              parentRouter: self.router,
              smQuery: smQuery,
              mdQuery: mdQuery,
              signaling: Controller.getSignaling(),
              onResized: resizeTriggered,
              onDataProvidersEmpty: selectAncillaryContentAreaTab
            }
          });
        });
      };
      this.loadHeaderTemplate();

      this.loadNavStripTemplate = function () {
        self.navStripModuleConfig = ko.pureComputed(function () {
          return ModuleElementUtils.createConfig({
            name: "navigation-area/navstrip",
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
            name: "footer/footer",
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
            name: "content-area/header/content-area-header",
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
            name: "content-area/ancillary-content",
            params: {
              parentRouter: self.router,
              signaling: Controller.getSignaling(),
              onAncillaryContentAreaToggled: toggleAncillaryContentArea
            }
          });
        });
      };
      this.loadAncillaryContentAreaTemplate();

      function setThemePreference(theme) {
        Controller.getSignal("themeChanged").dispatch(theme);
      }

      function toggleAncillaryContentArea(visible) {
        Controller.getSignal("ancillaryContentAreaToggled").dispatch("appController", visible);
      }

      function selectAncillaryContentAreaTab(source, tabId) {
        Controller.getSignal("tabStripTabSelected").dispatch(source, tabId, true);
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
        ViewModelUtils.setCustomCssProperty("content-area-header-toolbar-right-margin-right", `${marginRightVariable}px`);
      }

      function resizeTableFormContainer(source) {
        if (source === "opener") {
          let maxWidthVariable = parseInt(ViewModelUtils.getCustomCssProperty("content-area-header-toolbar-right-margin-right"), 10);
          maxWidthVariable += (NAVSTRIP_WIDTH + PANEL_RESIZER_WIDTH);
          ViewModelUtils.setCustomCssProperty("form-container-calc-max-width", `${maxWidthVariable}px`);
        }
      }

      function getBrowserViewPortValues() {
        return {height: $(window).height(), width: $(window).width()};
      }

      Controller.getSignal("navtreeResized").add((source, newOffsetLeft, newOffsetWidth) => {
        resizeTriggered(source, newOffsetLeft, newOffsetWidth);
      });

      Controller.getSignal("perspectiveSelected").add((newPerspective) => {
        const dataProvider = DataProviderManager.getLastActivatedDataProvider();
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
/*
          if (CoreUtils.isUndefinedOrNull(newPerspective)) {
            Logger.info(`[APPCONTROLLER] newPerspective is undefined`);
            newPerspective = PerspectiveManager.getDefault();
          }
*/
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

          const composite = document.getElementById("wrcNavtreeDialog");
          if (composite !== null) {
            const perspective = composite.perspective;
            const beanTree = dataProvider.getBeanTreeByPerspectiveId(active.id);
            if (CoreUtils.isNotUndefinedNorNull(perspective) && perspective.id !== active.id) {
              createNavtreeDialog(beanTree);
              Controller.getSignal("navtreeLoaded").dispatch(perspective);
            }
          }
          else {
            const beanTree = dataProvider.getBeanTreeByPerspectiveId(active.id);
            createNavtreeDialog(beanTree);
            Controller.getSignal("navtreeLoaded").dispatch(active);
          }
        }
      });

      function createNavtreeDialog(beanTree) {
        self.beanTree(beanTree);
        const outerHTML = Controller.createNavtreeDialogHTML();
        self.navtreeDialog.html({ view: HtmlUtils.stringToNodeArray(outerHTML), data: self });
      }

      Controller.getSignal("navtreeLoaded").add((perspective) => {
        // Get active (e.g. current) current perspective from PerspectiveManager
        let active = PerspectiveManager.current();
        if (typeof active === 'undefined') {
          // There was no active perspective, so make the
          // one assigned to the perspective parameter, the
          // active one.
          Logger.info(`[APPCONTROLLER] previous current: undefined`);
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

      Controller.getSignal("modeChanged").add((newMode) => {
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
              if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) router.go("home");
              break;
          }
        }
      });

      Controller.getSignal("projectSwitched").add((fromProject) => {
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
          if (document.getElementById("spa-resizer") !== null) {
            $('#spa-resizer').split({limit: 10});
          }
          // Pass the mode changed signal so that memory can be cleared
          PerspectiveMemoryManager.setModeChangedSignal(Controller.getSignal("modeChanged"));
        })
        .catch((err) => {
          Logger.error(err);
        });
    }

    return new ControllerViewModel();
  }
);
