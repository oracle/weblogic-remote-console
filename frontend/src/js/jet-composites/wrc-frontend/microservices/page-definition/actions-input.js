/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojmodule-element-utils',
  'wrc-frontend/common/controller',
  'wrc-frontend/core/runtime',
  'wrc-frontend/microservices/actions-management/declarative-actions-manager',
  'wrc-frontend/microservices/data-management/cbe-data-storage',
  'wrc-frontend/apis/data-operations',
  'wrc-frontend/apis/message-displaying',
  './utils',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils',
],
  function (
    oj,
    ko,
    ModuleElementUtils,
    Controller,
    Runtime,
    DeclarativeActionsManager,
    CbeDataStorage,
    DataOperations,
    MessageDisplaying,
    PageDefinitionUtils,
    ViewModelUtils,
    CoreUtils
) {
    
    /**
     * No-arg constructor
     */
    function PageDefinitionActionsInput() {
    }

  //public:
    PageDefinitionActionsInput.prototype = {
      getActionInputFormData: (endpoint, dataPayload) => {
        return DataOperations.actions.sendActionInputFormPostRequest(endpoint, dataPayload);
      },
      createOverlayFormDialogModuleConfig: (viewParams, actionInputFormData, actionInputFormConfig, childRouterName) => {
        function createChildRouter(childRouterName, parentRouter) {
          for (const state of parentRouter.states) {
            const childRouter = parentRouter.getChildRouter(state.id);
            if (CoreUtils.isNotUndefinedNorNull(childRouter)) childRouter.dispose();
          }
          return parentRouter.createChildRouter(childRouterName);
        }

        PageDefinitionUtils.setPlacementRouterParameter(viewParams.parentRouter, 'detached');
        const childRouter = createChildRouter(childRouterName, viewParams.parentRouter);
        childRouter.data = {
          pageTitle: ko.observable(actionInputFormData.body.data.get('pageTitle')),
          rdjUrl: ko.observable(actionInputFormData.body.data.get('rdjUrl')),
          rdjData: ko.observable(actionInputFormData.body.data.get('rdjData')),
          pdjUrl: ko.observable(actionInputFormData.body.data.get('pdjUrl')),
          pdjData: ko.observable(actionInputFormData.body.data.get('pdjData')),
          rawPath: ko.observable(actionInputFormConfig.path)
        };
        return ModuleElementUtils.createConfig({
          viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/overlay-form-dialog.html`,
          viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/overlay-form-dialog`,
          params: {
            parentRouter: childRouter,
            signaling: viewParams.signaling,
            perspective: viewParams.perspective,
            beanTree: viewParams.beanTree,
            overlayDialogParams: {
              action: actionInputFormConfig.action,
              title: actionInputFormConfig.title,
              instructions: actionInputFormConfig.instructions,
              submitIconFile: actionInputFormConfig.iconFile,
              submitButtonLabel: oj.Translations.getTranslatedString('wrc-common.buttons.done.label'),
              formLayout: {
                options: {
                  name: 'overlay-wlsform',
                  labelWidthPcnt: '24%',
                  maxColumns: '1',
                  fullWidth: true
                },
                minWidth: parseInt(ViewModelUtils.getCustomCssProperty('overlayDialog-actionInput-width'), 10)
              },
              onSubmit: actionInputFormConfig.submitCallback,
              checkedRows: actionInputFormConfig.checkedRows
            }
          }
        });
      }
    };
    
    // Return PageDefinitionActionsInput constructor function
    return PageDefinitionActionsInput;
  }
);