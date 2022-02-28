/**
  Copyright (c) 2015, 2022, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict'

define(['ojs/ojcomposite', 'text!./cfe-property-list-editor-view.html', './cfe-property-list-editor-viewModel', 'text!./component.json', 'css!./cfe-property-list-editor-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('cfe-property-list-editor', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);