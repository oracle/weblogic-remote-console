/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcomposite', 'text!./wdt-model-builder-view.html', './wdt-model-builder-viewModel', 'text!./component.json', 'css!./wdt-model-builder-styles.css', 'cfe-navtree/loader', 'css!wrc-frontend/css/tool.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('wdt-model-builder', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);
