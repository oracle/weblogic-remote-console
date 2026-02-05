/**
 * @license
 * Copyright (c) 2023,2025, Oracle and/or its affiliates.
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
        // Render action strip if perspective isn't "view"
        self.renderActionsStrip(viewParams.perspective.id !== 'view');
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