/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * module
 */
define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojrouter',
  'ojs/ojmodule-element-utils',
  'ojs/ojhtmlutils',
  'wrc-frontend/common/controller',
  'wrc-frontend/apis/data-operations',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/microservices/provider-management/data-provider-manager',
  'wrc-frontend/microservices/perspective/perspective-manager',
  'wrc-frontend/microservices/breadcrumb/breadcrumbs-manager',
  'wrc-frontend/microservices/page-definition/crosslinks',
  'wrc-frontend/microservices/page-definition/utils',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/types',
  'wrc-frontend/core/utils',
  'ojs/ojlogger',
  'ojs/ojmodule-element',
  'ojs/ojknockout',
  'ojs/ojtable',
  'ojs/ojbinddom',
  'ojs/ojselectcombobox',
  'ojs/ojbutton',
  'ojs/ojmenu',
  'ojs/ojtoolbar',
  'ojs/ojconveyorbelt'
],
  function (
    oj,
    ko,
    Router,
    ModuleElementUtils,
    HtmlUtils,
    Controller,
    DataOperations,
    MessageDisplaying,
    DataProviderManager,
    PerspectiveManager,
    BreadcrumbsManager,
    PageDefinitionCrossLinks,
    PageDefinitionUtils,
    ViewModelUtils,
    Runtime,
    CoreTypes,
    CoreUtils,
    Logger
  ) {

    function MonitoringViewModel(viewParams) {
      const self = this;

      // START: knockout observables referenced in view file
      this.breadcrumbs = {html: ko.observable({}), crumbs: ko.observableArray([])};
      this.breadcrumbsManager = new BreadcrumbsManager(viewParams.beanTree, this.breadcrumbs.crumbs);

      this.wlsModuleConfig = ko.observable({ view: [], viewModel: null });
      // END:   knockout observables referenced in view file

      this.path = ko.observable();
      this.introductionHTML = ko.observable();

      setBreadcrumbsVisibility(true);

      this.isDirty = function () {
        let rtnval = false;
        const moduleConfigViewModel = self.wlsModuleConfig().viewModel;
        if (moduleConfigViewModel !== null) {
          rtnval = moduleConfigViewModel.isDirty();
        }
        return rtnval;
      };

      this.canExit = function () {
        let rtnval = true;
        const moduleConfigViewModel = self.wlsModuleConfig().viewModel;
        if (moduleConfigViewModel !== null && CoreUtils.isNotUndefinedNorNull(moduleConfigViewModel.dirtyFields)) {
          if (moduleConfigViewModel.dirtyFields.size > 0) {
            return moduleConfigViewModel.canExit('exit')
              .then(reply => {
                if (!reply) viewParams.signaling.beanTreeChanged.dispatch(viewParams.beanTree);
                return reply;
              });
          }
        }
        return rtnval;
      };

      // Declare module-scoped variable for storing
      // bindings to "add" signal handlers.
      this.signalBindings = [];

      this.connected = function () {
        const setRuntimeReadOnlyProperty = () => {
          Runtime.setProperty(Runtime.PropertyName.CFE_IS_READONLY, viewParams.beanTree.readOnly);
        };
  
        const sendBeanTreeChangedSignal = ()  => {
          viewParams.signaling.beanTreeChanged.dispatch(viewParams.beanTree);
        };
  
        setRuntimeReadOnlyProperty();
        sendBeanTreeChangedSignal();

        this.router = Router.rootInstance.getChildRouter(viewParams.beanTree.type);
        if (CoreUtils.isUndefinedOrNull(this.router)) {
          this.router = Router.rootInstance.createChildRouter(viewParams.beanTree.type).configure({
            'table': { label: 'Table', value: 'table', title: Runtime.getName() },
            'form/{placement}': { label: 'Form', value: 'form', title: Runtime.getName() }
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

        const stateParams = Router.rootInstance.observableModuleConfig().params.ojRouter.parameters;
        // When using perspectives, you need to make sure
        // stateParams.path() doesn't return undefined, which
        // is possible because the navtree for the monitoring
        // perspective isn't "auto-loaded" when the app starts.
        const stateParamsPath = stateParams.path();

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
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.selectedBeanPathChanged.add((newPath) => {
          if (newPath !== null) {
            self.recentPagesModuleConfig
              .then(moduleConfig => {
                const historyOption = moduleConfig.viewModel.getHistoryOption(newPath);
                if (CoreUtils.isNotUndefinedNorNull(historyOption)) {
                  const fauxEvent =  {
                    target: {
                      attributes: {
                        'data-perspective': {value: historyOption.perspective.id},
                        'data-path': {value: historyOption.value},
                        'data-notFoundMessage': {value: oj.Translations.getTranslatedString('wrc-pdj-crosslinks.messages.noNotFoundMessage.summary')}
                      }
                    }
                  };
                  this.breadcrumbMenuClickListener(fauxEvent);
                }
              });
          }
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
        dispose(this.routerSubscription);

        this.router.dispose();

        // Detach all signal "add" bindings.
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      };

      this.recentPagesModuleConfig = ModuleElementUtils.createConfig({
        viewPath: `${Controller.getModulePathPrefix()}views/content-area/recent-pages.html`,
        viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/recent-pages`,
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });

      function cancelCreateAction(rawPath) {
        renderPage(rawPath);
      }

      function clickedBreadCrumb(path) {
        if (!path.endsWith('DomainRuntime/MessageCenter')) {
          // clear treenav selection
          viewParams.signaling.navtreeSelectionCleared.dispatch();
          path = PageDefinitionUtils.removeTrailingSlashes(path);
          ViewModelUtils.goToRouterPath( self.router, `/${viewParams.beanTree.type}/${encodeURIComponent(path)}`, self.canExitCallback);
        }
      }

      this.accessKeyClick = function(event) {
        const selector = event.currentTarget.getAttribute('data-focus-selector');
        if (CoreUtils.isNotUndefinedNorNull(selector)) {
          const anchor = document.querySelector(selector)
          if (anchor !== null) anchor.focus();
        }
      }.bind(this);

      this.breadcrumbsNavigatorClick = function (event) {
        console.log(`[MONITORING] breadcrumbsNavigatorClick - id=${event.currentTarget.id}`);
      }.bind(this);

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
                      viewParams.signaling.perspectiveSelected.dispatch(perspective);
                      viewParams.parentRouter.go(`/${perspectiveId}/${encodeURIComponent(path)}`);
                      viewParams.signaling.galleryItemSelected.dispatch(perspectiveId);
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
      }.bind(this);
  
      function toggleBeanPathHistory(visible) {
        if (CoreUtils.isUndefinedOrNull(visible)) {
          const value = ViewModelUtils.getCustomCssProperty('--beanpath-history-container-calc-display');
          visible = (value === 'inline-flex');
        }
        return visible;
      }

      function setBreadcrumbsVisibility(visible) {
        const display = (visible ? 'inline-flex' : 'none');
        ViewModelUtils.setCustomCssProperty('--breadcrumbs-container-calc-display', display);
        self.breadcrumbsManager.setBreadcrumbsVisibility(visible);
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
              breadcrumbLabels = self.breadcrumbsManager.getBreadcrumbLabels(breadcrumbs);
            }
            // Send signal saying bean path was added
            viewParams.signaling.beanPathAdded.dispatch(reply.body.data.name, breadcrumbLabels, viewParams.beanTree);
      
            return reply;
          });
      }

      function renderPage(rawPath) {
        // if the requested path is undefined, do nothing.
        // sometimes this is done to force a state change on the Router
        if (!rawPath) return;

        let pathParam = decodeURIComponent(rawPath);

        // The raw path is decoded but individual segments
        // remain encoded to form proper URIs for the beantree
        self.path(pathParam);

        ViewModelUtils.setPreloaderVisibility(true);
  
        if (pathParam.endsWith('DomainRuntime/MessageCenter/Alerts')) {
          DataOperations.messageCenter.getData(pathParam)
            .then(reply => {
              return addBeanPath(reply);
            })
            .then(reply => {
              const pageTitle = `${Runtime.getName()} - ${reply.body.data.get('pdjData').helpPageTitle}`;
              setRouterData(
                pageTitle,
                reply.body.data.get('rdjUrl'),
                reply.body.data.get('rdjData'),
                reply.body.data.get('pdjUrl'),
                reply.body.data.get('pdjData'),
                rawPath
              );
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
              else {
                ViewModelUtils.failureResponseDefaultHandling(response);
              }
            })
            .finally(() => {
              ViewModelUtils.setPreloaderVisibility(false);
            });
          }
        else {
          DataOperations.mbean.get(pathParam)
            .then(reply => {
              return addBeanPath(reply);
            })
            .then(reply => {
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
              else {
                ViewModelUtils.failureResponseDefaultHandling(response);
              }
            })
            .finally(() => {
              ViewModelUtils.setPreloaderVisibility(false);
            });
        }

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
          self.router.data.rdjData(rdjData);
          self.router.data.pdjUrl(pdjUrl);
          self.router.data.pdjData(pdjData);
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
    return MonitoringViewModel;
  }
);