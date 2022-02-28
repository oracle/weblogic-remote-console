/**
 * @license
 * Copyright (c) 2021,2022 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcomposite', 'text!./cfe-multi-select-view.html', './cfe-multi-select-viewModel', 'text!./component.json', 'css!./cfe-multi-select-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('cfe-multi-select', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);
