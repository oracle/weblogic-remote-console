/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['./actions-strip'],
  function (ActionsStrip) {

    function FormActionsStrip(viewParams) {
      ActionsStrip.call(this, viewParams);
      
      FormActionsStrip.prototype = Object.create(ActionsStrip.prototype);
    }
    
    /*
     * Return constructor for view model. JET uses this constructor
     * to create an instance of the view model, each time the view
     * is displayed.
     */
    return FormActionsStrip;
  }
);