/**
  Copyright (c) 2024, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict'

define(['ojs/ojcomposite', 'text!./cfe-breadcrumbs-view.html', './cfe-breadcrumbs-viewModel', 'text!./component.json', 'css!./cfe-breadcrumbs-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('cfe-breadcrumbs', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);