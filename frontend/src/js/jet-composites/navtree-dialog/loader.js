/**
 * @license
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcomposite', 'text!./navtree-dialog-view.html', './navtree-dialog-viewModel', 'text!./component.json', 'css!./navtree-dialog-styles.css', 'css!wrc-frontend/css/tool.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('navtree-dialog', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);
