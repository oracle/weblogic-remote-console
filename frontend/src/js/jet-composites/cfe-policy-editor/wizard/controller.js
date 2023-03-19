/**
 * @license
 * Copyright (c) 2022,2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/core/utils', 'ojs/ojmodule-element', 'ojs/ojknockout' ],
  function (ko, ModuleElementUtils, CoreUtils) {

    const PATH_PREFIX = 'jet-composites/cfe-policy-editor/1.0.0/wizard/';

    return {
      getModulePathPrefix: () => {
        return PATH_PREFIX;
      },

      loadModule: (name, viewParams = {}) => {
        if (CoreUtils.isNotUndefinedNorNull(name)) {
          const pageNames = ['policy-editor-wizard-page'];
          const pathPrefix = (pageNames.includes(name) ? PATH_PREFIX : '');
          const viewPath = `${pathPrefix}views/${name}.html`;
          const modelPath = `${pathPrefix}viewModels/${name}`;

          return ModuleElementUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath,
            params: viewParams
          })
            .then(function(moduleConfig) {
              return moduleConfig;
            })
            .catch(err => {
              console.error(err);
            });
        }
        else {
          return { view: [], viewModel: null };
        }
      }

    };
  }
);