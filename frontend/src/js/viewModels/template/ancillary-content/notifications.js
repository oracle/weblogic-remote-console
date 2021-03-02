/**
 * @license
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'ojs/ojcontext', '../../../cfe/common/runtime'],
  function(ko, Context, Runtime){
    function NotificationsTabTemplate(viewParams) {
      var self = this;

      Context.getPageContext().getBusyContext().whenReady()
      .then(function () {
      });

    }

    return NotificationsTabTemplate;
  }
);