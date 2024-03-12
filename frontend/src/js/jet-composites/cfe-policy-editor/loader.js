/**
  Copyright (c) 2022,2024, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

define([
  'ojs/ojcomposite',
  'text!./cfe-policy-editor-view.html',
  './cfe-policy-editor-viewModel',
  'text!./component.json',
  'css!./cfe-policy-editor-styles.css'
],
  function(
    Composite,
    view,
    viewModel,
    metadata
  ) {
    Composite.register('cfe-policy-editor', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);