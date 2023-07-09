/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['./actions-strip'],
  function (ActionsStrip) {
    function TableActionsStrip(viewParams) {
      const self = this;

      ActionsStrip.call(this, viewParams);
      
      TableActionsStrip.prototype = Object.create(ActionsStrip.prototype);
      
      this.connected = function () {
        self.renderActionsStrip(true);
      };
    }
    
    /*
     * Return constructor for view model. JET uses this constructor
     * to create an instance of the view model, each time the view
     * is displayed.
     */
    return TableActionsStrip;
  }
);