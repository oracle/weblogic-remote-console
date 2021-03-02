/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', '../cfe/common/runtime', '../cfe/services/perspective/perspective-manager', './modules/beanpath-manager', './modules/breadcrumbs-manager', './modules/pdj-crosslinks', './modules/tooltip-helper', 'ojs/ojlogger', '../cfe/common/utils', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojselectcombobox', 'ojs/ojbutton', 'ojs/ojmenu', 'ojs/ojtoolbar'],
  function (ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, Runtime, PerspectiveManager, BeanPathManager, BreadcrumbsManager, PageDefinitionCrossLinks, TooltipHelper, Logger, Utils) {

    function MonitoringViewModel(viewParams) {
      var self = this;

      viewParams.signaling.perspectiveChanged.dispatch(viewParams.perspective);

      this.i18n = {
        icons: {
          "history": { iconFile: "beanpath-history-icon-blk_24x24", tooltip: "History"}
        },
        menus: {
          history: {
            "clear": {id: "clear-history", value: "Clear History", iconFile: "erase-icon-blk_24x24", disabled: false}
          }
        },
        messages: {
          "pageNotFound" : "Unable to find page data, goto landing page: {0}",
          "dataNotAvailable": "Data Not Available"
        }
      };

      // Declare observables used in monitoring.html
      this.selectedBeanPath = ko.observable();
      this.beanPathHistoryCount = ko.observable();
      this.beanPathManager = new BeanPathManager(viewParams.perspective.id, this.beanPathHistoryCount);
      this.historyVisible = this.beanPathManager.getHistoryVisibility();
      this.beanPathHistoryOptions = this.beanPathManager.getHistoryOptions();
      this.breadcrumbs = {html: ko.observable({}), crumbs: ko.observableArray([])};
      this.breadcrumbsManager = new BreadcrumbsManager(viewParams.perspective, this.breadcrumbs.crumbs);

      this.path = ko.observable();
      this.columnDataProvider = ko.observable();
      this.rdjDataProvider = ko.observable();
      this.introductionHTML = ko.observable();

      this.router = Router.rootInstance.getChildRouter(viewParams.perspective.id);

      if (typeof this.router === "undefined") {
        this.router = Router.rootInstance.createChildRouter(viewParams.perspective.id).configure({
          'table': { label: 'Table', value: 'table', title: Runtime.getName() },
          'form': { label: 'Form', value: 'form', title: Runtime.getName() }
        });
      }

      this.router.currentValue.subscribe(function (value) {
        if (value) {
          ModuleElementUtils.createConfig({
            name: 'weblogic-page/' + value,
            viewPath: 'views/weblogic-page/' + value + '.html',
            modelPath: 'viewModels/weblogic-page/' + value,
            params: {
              parentRouter: this.router,
              signaling: viewParams.signaling,
              perspective: viewParams.perspective,
              onBeanPathHistoryToggled: toggleBeanPathHistory,
              onLandingPageSelected: selectedLandingPage
            }
          })
            .then(this.wlsModuleConfig);
        }
        else {
          this.wlsModuleConfig({ view: [], viewModel: null });
        }
      }.bind(this));

      this.wlsModuleConfig = ko.observable({ view: [], viewModel: null });

      function clickedBreadCrumb(path) {
        // clear treenav selection
        viewParams.signaling.navtreeSelectionCleared.dispatch();
        path = Utils.removeTrailingSlashes(path);
        self.router.go("/" + viewParams.perspective.id + "/" + encodeURIComponent(path));
      }

      // Breadcrumb navigation
      this.breadcrumbClick = function (event) {
        clickedBreadCrumb(event.target.id);
      }.bind(this);

      this.breadcrumbMenuClickListener = function (event) {
        const kind = event.target.attributes["data-kind"].value;
        const perspectiveId = event.target.attributes["data-perspective"].value;
        const path = event.target.attributes["data-path"].value;
        const breadcrumbs = event.target.attributes["data-breadcrumbs"].value;
        if (viewParams.perspective.id === perspectiveId) {
          self.router.go("/" + perspectiveId + "/" + encodeURIComponent(path));
        }
        else {
          const perspective = PerspectiveManager.getById(perspectiveId);
          if (typeof perspective !== "undefined") {
            const rdjUrl = Runtime.getBaseUrl() + "/" + perspectiveId + "/data/" + decodeURIComponent(path);
            $.getJSON(rdjUrl)
            .then(function () {
              viewParams.signaling.perspectiveSelected.dispatch(perspective);
              viewParams.signaling.perspectiveChanged.dispatch(perspective);
              viewParams.parentRouter.go("/" + perspectiveId + "/" + encodeURIComponent(path))
            },
            (jqXHR) => {
              if (jqXHR.status === 404) {
                viewParams.signaling.popupMessageSent.dispatch({
                  severity: 'info',
                  summary: self.i18n.messages.dataNotAvailable,
                  detail: event.target.attributes["data-notFoundMessage"].value
                });
              }
            });
          }
        }
      }.bind(this);

      this.breadcrumbsVisible = ko.observable();
      setBreadcrumbsVisibility(true);

      function toggleBeanPathHistory() {
        self.historyVisible = !self.historyVisible;
        setBeanPathHistoryVisibility(self.historyVisible);
        return self.historyVisible;
      }

      function setBeanPathHistoryVisibility(visible) {
        let ele = document.getElementById("beanpath-history-container");
        if (ele !== null) {
          ele.style.display = (visible ? "inline-flex" : "none");
          self.beanPathManager.setHistoryVisibility(visible);
        }
      }

      function setBreadcrumbsVisibility(visible) {
        self.breadcrumbsVisible(visible);
        let ele = document.getElementById("breadcrumbs");
        if (ele !== null) {
          ele.style.display = (visible ? "inline-flex" : "none");
          self.breadcrumbsManager.setBreadcrumbsVisibility(visible);
        }
      }

      function selectedLandingPage(debugMessage) {
        Logger.log(debugMessage);
        viewParams.parentRouter.go("/landing/" + viewParams.perspective.id);
      }

      this.moreMenuItem = ko.observable('(None selected yet)');

      this.launchMoreMenu = function (event) {
        event.preventDefault();
        document.getElementById('moreMenu').open(event);
      }.bind(this);

      this.moreMenuClickListener = function (event) {
        self.moreMenuItem(event.target.value);
      }.bind(this);

      viewParams.signaling.domainChanged.add((source) => {
        const domainConnectState = Runtime.getProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE);
        Logger.log(`[MONITORING] domainConnectState=${domainConnectState}`);
        setBreadcrumbsVisibility((domainConnectState === "CONNECTED"));
        setBeanPathHistoryVisibility(false);
      });

      function renderPage(rawPath) {
        let pathParam = decodeURIComponent(rawPath);

        // The raw path is decoded but individual segments
        // remain encoded to form proper URIs for the beantree
        self.path(pathParam);

        self.breadcrumbsManager.createBreadcrumbs(pathParam)
        .then((breadcrumbLabels) => {
          self.beanPathManager.addBeanPath(pathParam, breadcrumbLabels);

          const rdjUrl = Runtime.getBaseUrl() + "/" + viewParams.perspective.id + "/data/"  + pathParam;
          Logger.log(rdjUrl);

          $.getJSON(rdjUrl)
            .then(function (rdjData) {
              Logger.log(rdjData);

              const pdjUrl = Runtime.getBaseUrl() + "/" + viewParams.perspective.id + "/pages/" + rdjData.pageDefinition;

              $.getJSON(pdjUrl)
                .then(function (pdjData) {
                  const pageTitle = `${Runtime.getName()} - ${pdjData.helpPageTitle}`;
                  setRouterData(pageTitle, rdjUrl, rdjData, pdjUrl, pdjData, rawPath);
                  processRelatedLinks(rdjData);
                  chooseChildRouter(pdjData);
                });
            }, (jqXHR, status, error) => {
              // failed to get rdjData
              if (jqXHR.status === 404) {
                // goto the landing page
                selectedLandingPage(self.i18n.messages.pageNotFound.replace("{0}", jqXHR.responseText));
              }
            });
        });

      }

      function setRouterData(pageTitle, rdjUrl, rdjData, pdjUrl, pdjData, rawPath) {
        if (typeof self.router.data === 'undefined') {
          self.router.data = {
            pageTitle: ko.observable(pageTitle),
            rdjUrl: ko.observable(rdjUrl),
            rdjData: ko.observable(rdjData),
            pdjUrl: ko.observable(pdjUrl),
            pdjData: ko.observable(pdjData),
            rawPath: ko.observable(rawPath)
          };

          // enable deferred updates for these observables:
          // Notifications happen asynchronously, immediately after the current
          // task and generally before any UI redraws.
          self.router.data.pageTitle.extend({ deferred: true });
          self.router.data.rdjUrl.extend({ deferred: true });
          self.router.data.rdjData.extend({ deferred: true });
          self.router.data.pdjUrl.extend({ deferred: true });
          self.router.data.pdjData.extend({ deferred: true });
          self.router.data.rawPath.extend({ deferred: true });
        }
        else {
          self.router.data.pageTitle(pageTitle);
          self.router.data.rdjUrl(rdjUrl);
          self.router.data.rdjData(rdjData);
          self.router.data.pdjUrl(pdjUrl);
          self.router.data.pdjData(pdjData);
          self.router.data.rawPath(rawPath);
        }
      }

      function processRelatedLinks(rdjData) {
        PageDefinitionCrossLinks.getBreadcrumbsLinksData(rdjData, self.breadcrumbs.crumbs().length)
        .then((linksData) => {
          const div = self.breadcrumbsManager.renderBreadcrumbs(linksData);
          Logger.log(`[MONITORING] breadcrumbs.html=${div.outerHTML}`);
        self.breadcrumbs.html({ view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self });
        });
      }

      function chooseChildRouter(pdjData) {
        if (pdjData.table !== undefined) {
          self.router.go("table");
        }
        else {
          self.router.go("form");
        }
      }

      const stateParams = Router.rootInstance.observableModuleConfig().params.ojRouter.parameters
      // When using perspectives, you need to make sure
      // stateParams.path() doesn't return undefined, which
      // is possible because the navtree for the monitoring
      // perspective isn't "auto-loaded" when the app starts.
      let stateParamsPath = stateParams.path();

      if (typeof stateParamsPath !== "undefined" && stateParamsPath !== "form") {
        renderPage(stateParamsPath);
      }

      this.connected = function () {
        const beanPathHistoryContainer = document.getElementById("beanpath-history-container");
        new TooltipHelper(beanPathHistoryContainer);

        this.pathSubscription = Router.rootInstance.observableModuleConfig().params.ojRouter.parameters.path.subscribe(renderPage.bind(this))

        this.routerSubscription = this.router.currentValue.subscribe(function (value) {
          if (value) {
            ModuleElementUtils.createConfig({
              name: 'weblogic-page/' + value,
              viewPath: 'views/weblogic-page/' + value + '.html',
              modelPath: 'viewModels/weblogic-page/' + value,
              params: {
                parentRouter: this.router,
                signaling: viewParams.signaling,
                perspective: viewParams.perspective,
                onBeanPathHistoryToggled: toggleBeanPathHistory,
                onLandingPageSelected: selectedLandingPage
              }
            })
              .then(this.wlsModuleConfig);
          }
          else {
            this.wlsModuleConfig({ view: [], viewModel: null });
          }
        }.bind(this));

        this.selectedBeanPathSubscription = this.selectedBeanPath.subscribe(function (newValue) {
          const oldValue = Utils.removeTrailingSlashes(self.path());
          if (typeof newValue !== 'undefined' && newValue !== null && newValue !== "") {
            if (newValue !== oldValue) {
              if (self.beanPathManager.isHistoryOption(newValue)) clickedBreadCrumb(newValue);
            }
            self.selectedBeanPath(null);
          }
        }.bind(this));

        this.moreMenuItemSubscription = this.moreMenuItem.subscribe(function (newValue) {
          switch (newValue) {
            case "clear":
              self.beanPathManager.resetHistory();
              break;
          }
        }.bind(this));

        setBeanPathHistoryVisibility(self.beanPathManager.getHistoryVisibility());
      }.bind(this);

      this.disconnected = function () {

        var dispose = function (obj) {
          if (obj && typeof obj.dispose === "function") {
            obj.dispose();
          }
        };
        dispose(this.pathSubscription)
        dispose(this.selectedBeanPathSubscription)
        dispose(this.routerSubscription)
        dispose(this.moreMenuItemSubscription)
      }.bind(this);

    }

    /*
     * Return constructor for view model. JET uses this constructor
     * to create an instance of the view model, each time the view
     * is displayed.
     */
    return MonitoringViewModel;
  }
);
