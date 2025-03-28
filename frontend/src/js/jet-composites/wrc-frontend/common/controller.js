/**
 * @license
 * Copyright (c) 2021, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * @module
 */
define([
  'ojs/ojcore',
  'ojs/ojmodule-element-utils',
  'ojs/ojrouter',
  'signals',
  'wrc-frontend/microservices/provider-management/data-provider-manager',
  'wrc-frontend/microservices/perspective/perspective-manager',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils'
],
  function (
    oj,
    ModuleElementUtils,
    Router,
    signals,
    DataProviderManager,
    PerspectiveManager,
    MessageDisplaying,
    Runtime,
    CoreUtils
  ) {
    const signaling = Object.freeze({
      modeChanged: new signals.Signal(),
      domainChanged: new signals.Signal(),
      appMenuChangeRequested: new signals.Signal(),
      appMenuActionTriggered: new signals.Signal(),
      appProfileActionTriggered: new signals.Signal(),
      perspectiveChanged: new signals.Signal(),
      perspectiveSelected: new signals.Signal(),
      ancillaryContentItemSelected: new signals.Signal(),
      ancillaryContentItemToggled: new signals.Signal(),
      ancillaryContentItemCleared: new signals.Signal(),
      tabStripTabSelected: new signals.Signal(),
      shoppingCartModified: new signals.Signal(),
      navtreeToggled: new signals.Signal(),
      navtreeLoaded: new signals.Signal(),
      navtreeSelectionCleared: new signals.Signal(),
      navtreeSelectionChanged: new signals.Signal(),
      navtreeRootNodeAdded: new signals.Signal(),
      navtreeUpdated: new signals.Signal(),
      navtreeResized: new signals.Signal(),
      popupMessageSent: new signals.Signal(),
      autoSyncCancelled: new signals.Signal(),
      readonlyChanged: new signals.Signal(),
      nonwritableChanged: new signals.Signal(),
      dataProviderSelected: new signals.Signal(),
      dataProviderRemoved: new signals.Signal(),
      dataProviderActionClicked: new signals.Signal(),
      dataProviderLoadFailed: new signals.Signal(),
      projectSwitched: new signals.Signal(),
      galleryItemSelected: new signals.Signal(),
      homeTabStripItemSelected: new signals.Signal(),
      beanTreeSelected: new signals.Signal(),
      beanTreeChanged: new signals.Signal(),
      beanPathAdded: new signals.Signal(),
      beanPathDeleted: new signals.Signal(),
      beanPathHistoryToggled: new signals.Signal(),
      pagesHistoryChanged: new signals.Signal(),
      selectedBeanPathChanged: new signals.Signal(),
      unsavedChangesDetected: new signals.Signal(),
      changesAutoDownloaded: new signals.Signal(),
      autoDownloadRequested: new signals.Signal(),
      formInputMinWidthChanged: new signals.Signal(),
      formSliceSelected: new signals.Signal(),
      adminServerShutdown: new signals.Signal(),
      backendDataReloaded: new signals.Signal(),
      backendConnectionLost: new signals.Signal(),
      backendConnectionRefused: new signals.Signal(),
      backendExceptionOccurred: new signals.Signal(),
      modelArchiveUpdated: new signals.Signal(),
      appQuitTriggered: new signals.Signal(),
      domainSecurityWarning: new signals.Signal(),  // Don't remove! Still used in codebase!
      domainStatusPollingCompleted: new signals.Signal(),
      resizeObserverTriggered: new signals.Signal(),
      resizeObserveeNudged: new signals.Signal(),
      startupTaskChosen: new signals.Signal(),
      providerManagementActionChosen: new signals.Signal(),
      modelConsoleSizeChanged: new signals.Signal(),
      ssoPollingCompleted: new signals.Signal(),
      ssoTokenExpired: new signals.Signal()
    });

    const PATH_PREFIX = 'jet-composites/wrc-frontend/1.0.0/integration/';
    const router = Router.rootInstance;
    Router.defaults['urlAdapter'] = new Router.urlParamAdapter();

    MessageDisplaying.setPopupMessageSentSignal(signaling['popupMessageSent']);

    oj.Logger.option('level', Runtime.getLoggingLevel());

    return {
      getModulePathPrefix: () => {
        return PATH_PREFIX;
      },

      getRuntimeRole: () => {
        return Runtime.getRole();
      },

      getSignaling: () => {
        return signaling;
      },

      getSignal: (key) => {
        return (key in signaling ? signaling[key] : undefined);
      },

      setRoutes: (routes) => {
        router.configure(routes);
      },

      getRootRouter: () => {
        return router;
      },

      createNavtreeHTML: () => {
        const composite = document.createElement('cfe-navtree');
        composite.setAttribute('id', 'wrcNavtree');
        composite.setAttribute('bean-tree', '[[beanTree]]');
        return composite.outerHTML;
      },

      loadModule: (name) => {
        if (CoreUtils.isNotUndefinedNorNull(name)) {
          const perspectiveNames = ['configuration', 'monitoring', 'modeling', 'view', 'security', 'composite', 'properties'];
          const pathPrefix = (perspectiveNames.includes(name) ? PATH_PREFIX : '');
          const viewPath = `${pathPrefix}views/${name}.html`;
          const modelPath = `${pathPrefix}viewModels/${name}`;
          const viewParams = { parentRouter: router, signaling: signaling};

          let dataProvider;
          const perspective = PerspectiveManager.getById(name);
          if (CoreUtils.isNotUndefinedNorNull(perspective)) {
            // This means that the viewModel being loaded is
            // for a perspective (i.e. configuration,
            // monitoring, modeling, view), so stash the
            // perspective in the view parameters.
            viewParams['perspective'] = perspective;
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
              viewParams['beanTree'] = beanTree;
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
      }

    };

  }
);