/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * @module
 */
define(['./perspective'],
  function (Perspective) {

    function ViewViewModel(viewParams) {
      Perspective.call(this, viewParams);

      ViewViewModel.prototype = Object.create(Perspective.prototype);
    }

    /*
     * Return constructor for view model. JET uses this constructor
     * to create an instance of the view model, each time the view
     * is displayed.
     */
    return ViewViewModel;
  }
);
