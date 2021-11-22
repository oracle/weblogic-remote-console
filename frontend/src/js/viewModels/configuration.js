/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * @module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', '../apis/data-operations', '../apis/message-displaying', '../microservices/provider-management/data-provider-manager', '../microservices/perspective/perspective-manager', '../microservices/beanpath/beanpath-manager', '../microservices/breadcrumb/breadcrumbs-manager', '../microservices/page-definition/crosslinks', '../microservices/page-definition/utils', './utils', '../core/runtime', '../core/types', '../core/cbe-types', '../core/utils', 'ojs/ojlogger', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojselectcombobox', 'ojs/ojbutton', 'ojs/ojmenu', 'ojs/ojtoolbar'],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, DataOperations, MessageDisplaying, DataProviderManager, PerspectiveManager, BeanPathManager, BreadcrumbsManager, PageDefinitionCrossLinks, PageDefinitionUtils, ViewModelUtils, Runtime, CoreTypes, CbeTypes, CoreUtils, Logger) {

    function ConfigurationViewModel(viewParams) {
      var self = this;

      this.i18n = {
        icons: {
          "history": {
            iconFile: "beanpath-history-icon-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-perspective.icons.history.tooltip")
          }
        },
        menus: {
          history: {
            "clear": {
              id: "clear-history",
              iconFile: "erase-icon-blk_24x24",
              disabled: false,
              value: oj.Translations.getTranslatedString("wrc-perspective.menus.history.clear.value")
            }
          }
        },
        messages: {
          "dataNotAvailable": {summary: oj.Translations.getTranslatedString("wrc-perspective.messages.dataNotAvailable.summary")}
        }
      };

      // START: knockout observables referenced in configuration.html
      this.selectedBeanPath = ko.observable();
      this.beanPathHistoryCount = ko.observable();
      const dataProvider = DataProviderManager.getLastActivatedDataProvider();
      const beanTree = dataProvider.getBeanTreeByPerspectiveId(viewParams.perspective.id);
      this.beanPathManager = new BeanPathManager(beanTree, this.beanPathHistoryCount);
      this.historyVisible = this.beanPathManager.getHistoryVisibility();
      this.beanPathHistoryOptions = this.beanPathManager.getHistoryOptions();
      this.breadcrumbs = {html: ko.observable({}), crumbs: ko.observableArray([])};
      this.breadcrumbsManager = new BreadcrumbsManager(beanTree, this.breadcrumbs.crumbs);

      this.launchMoreMenu = function (event) {
        event.preventDefault();
        document.getElementById('moreMenu').open(event);
      }.bind(this);

      this.moreMenuClickListener = function (event) {
        self.moreMenuItem(event.target.value);
      }.bind(this);

      this.wlsModuleConfig = ko.observable({ view: [], viewModel: null });
      // END:   knockout observables referenced in configuration.html

      this.moreMenuItem = ko.observable('(None selected yet)');
      this.path = ko.observable();
      this.introductionHTML = ko.observable();
      this.breadcrumbsVisible = ko.observable();

      setBreadcrumbsVisibility(true);

      this.isDirty = function () {
        let rtnval = false;
        const formViewModel = self.wlsModuleConfig().viewModel;
        if (formViewModel !== null) rtnval = formViewModel.isDirty();
        return rtnval;
      }.bind(this);

      this.canExit = function () {
        let rtnval = true;
        const formViewModel = self.wlsModuleConfig().viewModel;
        if (formViewModel !== null) rtnval = formViewModel.canExit("exit");
        return rtnval;
      };

      this.signalBindings = [];

      this.connected = function () {
        Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, viewParams.beanTree.readOnly);

        viewParams.signaling.beanTreeChanged.dispatch(viewParams.beanTree);

        this.router = Router.rootInstance.getChildRouter(viewParams.beanTree.type);
        if (CoreUtils.isUndefinedOrNull(this.router)) {
          this.router = Router.rootInstance.createChildRouter(viewParams.beanTree.type).configure({
            'table': { label: 'Table', value: 'table', title: Runtime.getName() },
            'form/{placement}': { label: 'Form', value: 'form', title: Runtime.getName(), canExit: this.canExit }
          });
        }

        this.routerSubscription = this.router.currentValue.subscribe(function (value) {
          if (value) {
            const name = 'content-area/body/' + value;
            const params = {
              parentRouter: this.router,
              signaling: viewParams.signaling,
              perspective: viewParams.perspective,
              beanTree: viewParams.beanTree,
              onBeanPathHistoryToggled: toggleBeanPathHistory,
              onLandingPageSelected: selectedLandingPage
            };
            ModuleElementUtils.createConfig({
              name: name,
              viewPath: 'views/' + name + '.html',
              modelPath: 'viewModels/' + name,
              params: params
            })
              .then(this.wlsModuleConfig)
              .catch(err => {
                ViewModelUtils.failureResponseDefaultHandling(err);
              });
          }
          else {
            if (this.wlsModuleConfig().view.length === 0) {
              // This logic says that if value is not "form" or
              // "table", then assign an empty moduleConfig
              // How can value not be a "form" or "table", if
              // we're defining the router's module config?
              this.wlsModuleConfig({ view: [], viewModel: null });
            }
          }
        }.bind(this));

        this.pathSubscription = Router.rootInstance.observableModuleConfig().params.ojRouter.parameters.path.subscribe(renderPage.bind(this));

        this.selectedBeanPathSubscription = this.selectedBeanPath.subscribe(function (newValue) {
          const oldValue = PageDefinitionUtils.removeTrailingSlashes(self.path());
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

        var stateParams = Router.rootInstance.observableModuleConfig().params.ojRouter.parameters;
        // When using perspectives, you need to make sure
        // stateParams.path() doesn't return undefined, which
        // is possible because the navtree for the Configuration
        // perspective isn't "auto-loaded" when the app starts.
        let stateParamsPath = stateParams.path();

        if (typeof stateParamsPath !== "undefined" && stateParamsPath !== "form") {
          try {
            renderPage(stateParamsPath);
          }
          catch(err) {
            ViewModelUtils.failureResponseDefaultHandling(err);
          }
        }

        let binding = viewParams.signaling.domainChanged.add((source) => {
          const domainConnectState = Runtime.getProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE);
          Logger.log(`domainConnectState=${domainConnectState}`);
          setBreadcrumbsVisibility((domainConnectState === CoreTypes.Domain.ConnectState.CONNECTED.name));
          setBeanPathHistoryVisibility(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager, pathParam) => {
          if (eventType === "delete") self.beanPathManager.removeBeanPath(pathParam);
        });

        self.signalBindings.push(binding);
      }.bind(this);

      this.disconnected = function () {
        let dispose = function (obj) {
          if (obj && typeof obj.dispose === "function") {
            obj.dispose();
          }
        };

        dispose(this.pathSubscription);
        dispose(this.selectedBeanPathSubscription);
        dispose(this.routerSubscription);
        dispose(this.moreMenuItemSubscription);

        this.router.dispose();

        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      // Breadcrumb navigation
      this.breadcrumbClick = function (event) {
        clickedBreadCrumb(event.target.id);
      }.bind(this);

      this.breadcrumbMenuClickListener = function (event) {
        const perspectiveId = event.target.attributes["data-perspective"].value;
        const path = event.target.attributes["data-path"].value;
        
        viewParams.signaling.navtreeSelectionCleared.dispatch();
        
        if (viewParams.perspective.id === perspectiveId) {
          self.router.go("/" + perspectiveId + "/" + encodeURIComponent(path));
        }
        else {
          const perspective = PerspectiveManager.getById(perspectiveId);
          if (CoreUtils.isNotUndefinedNorNull(perspective)) {
            ViewModelUtils.setCursorType("progress");
            DataOperations.mbean.test(path)
              .then(reply => {
                viewParams.signaling.beanTreeChanged.dispatch(dataProvider.getBeanTreeByPerspectiveId(perspectiveId));
                viewParams.signaling.perspectiveSelected.dispatch(perspective);
                viewParams.parentRouter.go("/" + perspectiveId + "/" + encodeURIComponent(path))
              })
              .catch(response => {
                if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                  MessageDisplaying.displayMessage(
                    {
                      severity: 'info',
                      summary: self.i18n.messages.dataNotAvailable.summary,
                      detail: event.target.attributes["data-notFoundMessage"].value
                    },
                    2500
                  );
                }
                else {
                  ViewModelUtils.failureResponseDefaultHandling(response);
                }
              })
              .finally(() => {
                ViewModelUtils.setCursorType("default");
              });
          }
        }
      }.bind(this);

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
        viewParams.parentRouter.go("/landing/" + viewParams.beanTree.type);
      }

      function clickedBreadCrumb(path) {
        // clear treenav selection
        viewParams.signaling.navtreeSelectionCleared.dispatch();
        path = PageDefinitionUtils.removeTrailingSlashes(path);
        self.router.go("/" + viewParams.beanTree.type + "/" + encodeURIComponent(path));
      }

      async function addBeanPath(reply) {
        return self.breadcrumbsManager.createBreadcrumbs(reply.body.data.name)
          .then((breadcrumbLabels) => {
            if (breadcrumbLabels.length === 0) {
              // This happens when the "Finish" button is clicked,
              // on the create form for a JDBC wizard. The "Finished"
              // button is bound to the same code path as the "Save"
              // button, so clicking it adds the new JDBC Data Source
              // MBean to the edit session, and re-renders the page.
              // But this time a regular form is used, not the create
              // form associated with the wizard. The navtree manager
              // doesn't have the path model yet, so we need to use
              // rdjData.data.identity to obtain the breadcrumb labels.
              const breadcrumbs = PageDefinitionUtils.breadcrumbsFromIdentity(reply.body.data.get("rdjData").data.identity);
              breadcrumbLabels = self.breadcrumbsManager.getBreadcrumbLabels(reply.body.data.name, breadcrumbs);
            }
            // Add bean path to beanPath history
            self.beanPathManager.addBeanPath(reply.body.data.name, breadcrumbLabels);
            return reply;
          });
      }

      function renderPage(rawPath, slice) {
        // if the requested path is undefined, do nothing.
        // sometimes this is done to force a state change on the Router
        if (!rawPath) return;

        let pathParam = decodeURIComponent(rawPath);

        // The raw path is decoded but individual segments
        // remain encoded to form proper URIs for the beantree
        self.path(pathParam);

        const suffix = (typeof slice !== 'undefined') ? '?slice=' + slice : '';
        const uri = (pathParam === '/' ? '' : pathParam) + suffix;

        ViewModelUtils.setCursorType("progress");
        DataOperations.mbean.get(uri)
          .then(reply => {
            return addBeanPath(reply);
          })
          .then(reply => {
            let changeManager = reply.body.data.get("rdjData").changeManager;

            if (!changeManager) {
              changeManager = {};
            }

            viewParams.signaling.shoppingCartModified.dispatch(viewParams.beanTree.type, "sync", changeManager);

            const pageTitle = `${Runtime.getName()} - ${reply.body.data.get("pdjData").helpPageTitle}`;
            setRouterData(
              pageTitle,
              reply.body.data.get("rdjUrl"),
              reply.body.data.get("rdjData"),
              reply.body.data.get("pdjUrl"),
              reply.body.data.get("pdjData"),
              rawPath
            );
            processRelatedLinks(reply.body.data.get("rdjData"));
            chooseChildRouter(reply.body.data.get("pdjData"));
          })
          .catch(response => {
            if (response.failureType === CoreTypes.FailureType.NOT_FOUND) {
              // When a bean is not found, the CFE should redirect
              // to that bean's parent's page recursively, until it
              // gets to a bean that still exists.
              const newPathParam = pathParam.split('/').slice(0, -1).join('/');
              const newRawPath = encodeURIComponent(newPathParam);

              if (newRawPath !== "") {
                renderPage(newRawPath);
              }
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
          })
          .finally(() => {
            ViewModelUtils.setCursorType("default");
          });
      }

      function setRouterData(pageTitle, rdjUrl, rdjData, pdjUrl, pdjData, rawPath) {
        if (CoreUtils.isUndefinedOrNull(self.router.data)) {
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
          self.router.data.pdjData(pdjData);
          self.router.data.pdjUrl(pdjUrl);
          self.router.data.rdjData(rdjData);
          self.router.data.rawPath(rawPath);
        }
      }

      function processRelatedLinks(rdjData) {
        PageDefinitionCrossLinks.getBreadcrumbsLinksData(rdjData, viewParams.perspective.id, self.breadcrumbs.crumbs().length)
          .then((linksData) => {
            const div = self.breadcrumbsManager.renderBreadcrumbs(linksData);
            Logger.log(`breadcrumbs.html=${div.outerHTML}`);
            self.breadcrumbs.html({ view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self });
          });
      }

      function chooseChildRouter(pdjData) {
        if (CoreUtils.isNotUndefinedNorNull(pdjData.table)) {
          self.router.go("table");
        }
        else {
          self.router.go("form/embedded");
        }
      }

    }

    /*
     * Return constructor for view model. JET uses this constructor
     * to create an instance of the view model, each time the view
     * is displayed.
     */
    return ConfigurationViewModel;
  }
);
