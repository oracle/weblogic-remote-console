/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * @module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojhtmlutils', 'wrc-frontend/integration/controller', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/beanpath/beanpath-manager', 'wrc-frontend/microservices/breadcrumb/breadcrumbs-manager', 'wrc-frontend/microservices/page-definition/crosslinks', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/cbe-types', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojselectcombobox', 'ojs/ojbutton', 'ojs/ojmenu', 'ojs/ojtoolbar'],
  function (oj, ko, Router, ModuleElementUtils, HtmlUtils, Controller, DataOperations, MessageDisplaying, DataProviderManager, PerspectiveManager, BeanPathManager, BreadcrumbsManager, PageDefinitionCrossLinks, PageDefinitionUtils, ViewModelUtils, Runtime, CoreTypes, CbeTypes, CoreUtils, Logger) {

    function PerspectiveViewModel(viewParams) {
      const self = this;

      this.i18n = {
        icons: {
          'history': {
            iconFile: 'beanpath-history-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-perspective.icons.history.tooltip')
          }
        },
        menus: {
          history: {
            'clear': {
              id: 'clear-history',
              iconFile: 'erase-icon-blk_24x24',
              disabled: false,
              value: oj.Translations.getTranslatedString('wrc-perspective.menus.history.clear.value')
            }
          }
        }
      };

      // START: knockout observables referenced in view file
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
      // END:   knockout observables referenced in view file

      this.moreMenuItem = ko.observable('(None selected yet)');
      this.path = ko.observable();
      this.introductionHTML = ko.observable();
      this.breadcrumbsVisible = ko.observable();

      setBreadcrumbsVisibility(true);

      this.isDirty = function () {
        let rtnval = false;
        if (['modeling','properties'].includes(viewParams.perspective.id)) {
          const moduleConfigViewModel = self.wlsModuleConfig().viewModel;
          if (moduleConfigViewModel !== null) {
            rtnval = moduleConfigViewModel.isDirty();
          }
        }
        return rtnval;
      };

      this.canExit = function () {
        let rtnval = true;
        if (['modeling','properties'].includes(viewParams.perspective.id)) {
          const moduleConfigViewModel = self.wlsModuleConfig().viewModel;
          if (moduleConfigViewModel !== null) {
            let exitEntryType = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? 'autoSave' : 'autoDownload');
            if (CoreUtils.isNotUndefinedNorNull(viewParams.identity)) {
              // This means that a router.go() is navigating away
              // from the table/form we were on, but there may still
              // be Promises that haven't been resolved or rejected.
              // We don't care where the router is sending us, but
              // we do care about the download happening.
              exitEntryType = 'navigation';
              // Go ahead and remove "identity" field from viewParams,
              // because it's already served its purpose.
              delete viewParams['identity'];
            }
            if (CoreUtils.isNotUndefinedNorNull(self.canExitCallback)) {
              return moduleConfigViewModel.canExit(exitEntryType)
                .then(reply => {
                  if (!reply) viewParams.signaling.beanTreeChanged.dispatch(viewParams.beanTree);
                  return reply;
                });
            }
          }
        }
        return rtnval;
      };

      // Declare module-scoped variable for storing
      // bindings to "add" signal handlers.
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
            const name = `content-area/body/${value}`;
            const viewPath = `${Controller.getModulePathPrefix()}views/${name}.html`;
            const modelPath = `${Controller.getModulePathPrefix()}viewModels/${name}`;
            const params = {
              parentRouter: this.router,
              signaling: viewParams.signaling,
              perspective: viewParams.perspective,
              beanTree: viewParams.beanTree,
              onBeanPathHistoryToggled: toggleBeanPathHistory,
              onLandingPageSelected: selectedLandingPage,
              onCreateCancelled: cancelCreateAction
            };
            ModuleElementUtils.createConfig({
              viewPath: viewPath,
              viewModelPath: modelPath,
              params: params
            })
              .then(this.wlsModuleConfig);
          }
        }.bind(this));

        this.pathSubscription = Router.rootInstance.observableModuleConfig().params.ojRouter.parameters.path.subscribe(renderPage.bind(this));

        this.selectedBeanPathSubscription = this.selectedBeanPath.subscribe(function (newValue) {
          const oldValue = PageDefinitionUtils.removeTrailingSlashes(self.path());
          if (typeof newValue !== 'undefined' && newValue !== null && newValue !== '') {
            if (newValue !== oldValue) {
              if (self.beanPathManager.isHistoryOption(newValue)) clickedBreadCrumb(newValue);
            }
            self.selectedBeanPath(null);
          }
        }.bind(this));

        this.moreMenuItemSubscription = this.moreMenuItem.subscribe(function (newValue) {
          switch (newValue) {
            case 'clear':
              self.beanPathManager.resetHistory();
              break;
          }
        }.bind(this));

        setBeanPathHistoryVisibility(self.beanPathManager.getHistoryVisibility());

        const stateParams = Router.rootInstance.observableModuleConfig().params.ojRouter.parameters;
        // When using perspectives, you need to make sure
        // stateParams.path() doesn't return undefined, which
        // is possible because the navtree for the Configuration
        // perspective isn't "auto-loaded" when the app starts.
        let stateParamsPath = stateParams.path();

        if (typeof stateParamsPath !== 'undefined' && stateParamsPath !== 'form') {
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

        binding = viewParams.signaling.dataProviderSelected.add(dataProvider => {
          self.beanPathManager.resetHistory();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager, pathParam) => {
          if (eventType === 'delete') self.beanPathManager.removeBeanPath(pathParam);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        let dispose = function (obj) {
          if (obj && typeof obj.dispose === 'function') {
            obj.dispose();
          }
        };

        dispose(this.pathSubscription);
        dispose(this.selectedBeanPathSubscription);
        dispose(this.routerSubscription);
        dispose(this.moreMenuItemSubscription);

        this.router.dispose();

        // Detach all signal "add" bindings.
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];

      }.bind(this);

      function cancelCreateAction(rawPath) {
        renderPage(rawPath);
      }

      function clickedBreadCrumb(path) {
        // Minimize Kiosk and navtree, if it is floating
        viewParams.signaling.ancillaryContentAreaToggled.dispatch('breadcrumb', false);
        // clear treenav selection
        viewParams.signaling.navtreeSelectionCleared.dispatch();
        viewParams.identity = path;
        ViewModelUtils.goToRouterPath( self.router, `/${viewParams.beanTree.type}/${encodeURIComponent(path)}`, self.canExitCallback);
      }

      this.breadcrumbClick = function (event) {
        clickedBreadCrumb(event.target.id);
      }.bind(this);

      this.breadcrumbMenuClickListener = function (event) {
        const perspectiveId = event.target.attributes['data-perspective'].value;
        const path = event.target.attributes['data-path'].value;

        viewParams.signaling.navtreeSelectionCleared.dispatch();

        if (viewParams.perspective.id === perspectiveId) {
          ViewModelUtils.goToRouterPath(self.router, `/${perspectiveId}/${encodeURIComponent(path)}`, self.canExitCallback);
        }
        else {
          const perspective = PerspectiveManager.getById(perspectiveId);
          if (CoreUtils.isNotUndefinedNorNull(perspective)) {
            ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
              .then(reply => {
                if (reply) {
                  ViewModelUtils.setPreloaderVisibility(true);
                  DataOperations.mbean.test(path)
                    .then(reply => {
                      viewParams.signaling.beanTreeChanged.dispatch(dataProvider.getBeanTreeByPerspectiveId(perspectiveId));
                      viewParams.signaling.perspectiveSelected.dispatch(perspective);
                      viewParams.parentRouter.go(`/${perspectiveId}/${encodeURIComponent(path)}`);
                    })
                    .catch(response => {
                      if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                        MessageDisplaying.displayMessage(
                          {
                            severity: 'info',
                            summary: event.target.attributes['data-notFoundMessage'].value
                          },
                          2500
                        );
                      }
                      else {
                        ViewModelUtils.failureResponseDefaultHandling(response);
                      }
                    })
                    .finally(() => {
                      ViewModelUtils.setPreloaderVisibility(false);
                    });
                }
              })
              .catch(failure => {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              });
          }
        }
      };

      function toggleBeanPathHistory() {
        self.historyVisible = !self.historyVisible;
        setBeanPathHistoryVisibility(self.historyVisible);
        return self.historyVisible;
      }

      function setBeanPathHistoryVisibility(visible) {
        let ele = document.getElementById('beanpath-history-container');
        if (ele !== null) {
          ele.style.display = (visible ? 'inline-flex' : 'none');
          self.beanPathManager.setHistoryVisibility(visible);
        }
      }

      function setBreadcrumbsVisibility(visible) {
        self.breadcrumbsVisible(visible);
        let ele = document.getElementById('breadcrumbs');
        if (ele !== null) {
          ele.style.display = (visible ? 'inline-flex' : 'none');
          self.breadcrumbsManager.setBreadcrumbsVisibility(visible);
        }
      }

      function selectedLandingPage(debugMessage) {
        Logger.log(debugMessage);
        ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/landing/${viewParams.beanTree.type}`, self.canExitCallback);
      }

      async function addBeanPath(reply) {
        return self.breadcrumbsManager.createBreadcrumbs(reply)
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
              const breadcrumbs = PageDefinitionUtils.breadcrumbsFromIdentity(reply.body.data.get('rdjData').data.identity);
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

        ViewModelUtils.setPreloaderVisibility(true);
        DataOperations.mbean.get(uri)
          .then(reply => {
            return addBeanPath(reply);
          })
          .then(reply => {
            let changeManager = reply.body.data.get('rdjData').changeManager;
            if (CoreUtils.isUndefinedOrNull(changeManager)) {
              // Uptake: Remove when CBE starts including changeManager
              // field again.
              changeManager = {};
            }
            viewParams.signaling.shoppingCartModified.dispatch(viewParams.beanTree.type, 'sync', changeManager);

            const pageTitle = `${Runtime.getName()} - ${reply.body.data.get('pdjData').helpPageTitle}`;
            setRouterData(
              pageTitle,
              reply.body.data.get('rdjUrl'),
              reply.body.data.get('rdjData'),
              reply.body.data.get('pdjUrl'),
              reply.body.data.get('pdjData'),
              rawPath
            );

            viewParams.signaling.navtreeUpdated.dispatch({
              update: true,
              path: reply.body.data.get('rdjData').navigation,
            });

            processRelatedLinks(reply.body.data.get('rdjData'));
            processHeaderSecurityLink(reply.body.data.get('rdjData'));
            chooseChildRouter(reply.body.data.get('pdjData'));
          })
          .catch(response => {
            if (response.failureType === CoreTypes.FailureType.NOT_FOUND) {
              // When a bean is not found, the CFE should redirect
              // to that bean's parent's page recursively, until it
              // gets to a bean that still exists.
              const newPathParam = pathParam.split('/').slice(0, -1).join('/');
              const newRawPath = encodeURIComponent(newPathParam);

              if (newRawPath !== '') {
                renderPage(newRawPath);
              }
            }
            else if (response.failureType === CoreTypes.FailureType.CONNECTION_REFUSED) {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
          })
          .finally(() => {
            ViewModelUtils.setPreloaderVisibility(false);
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

      // header security warning link refresh.
      // rdjData may or may not have this providerLinks.  As of now, only DomainSecurityRuntime in monitoring will
      // include this link.  So we only add this test in monitoring.js
      function processHeaderSecurityLink(rdjData) {
        if (CoreUtils.isNotUndefinedNorNull(rdjData.providerLinks)){
          const label = rdjData.providerLinks[0].label;
          const resourceData = rdjData.providerLinks[0].resourceData;
          if (CoreUtils.isNotUndefinedNorNull(label) && CoreUtils.isNotUndefinedNorNull(resourceData)){
            viewParams.signaling.domainSecurityWarning.dispatch({
              linkLabel: label,
              linkResourceData: resourceData
            });
          }
        }
      }

      function chooseChildRouter(pdjData) {
        if (CoreUtils.isNotUndefinedNorNull(pdjData.table)) {
          self.router.go('table');
        }
        else {
          self.router.go('form/embedded');
        }
      }

    }

    /*
     * Return constructor for view model. JET uses this constructor
     * to create an instance of the view model, each time the view
     * is displayed.
     */
    return PerspectiveViewModel;
  }
);
