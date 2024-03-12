/**
 * @license
 * Copyright (c) 2021, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcomposite', 'text!./cfe-navtree-view.html', './cfe-navtree-viewModel', 'text!./component.json', 'css!./cfe-navtree-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('cfe-navtree', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);
