/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcomposite', 'text!./wdt-model-designer-view.html', './wdt-model-designer-viewModel', 'text!./component.json', 'css!./wdt-model-designer-styles.css', 'cfe-navtree/loader', 'css!wdt-model-designer/splitter.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('wdt-model-designer', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);
