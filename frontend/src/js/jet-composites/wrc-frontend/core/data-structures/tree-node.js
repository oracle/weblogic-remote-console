/**
 Copyright (c) 2023, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

define(
  function() {
    function TreeNode(value) {
      this.value = value;
      this.children = [];
    }

    // Return the class constructor
    return TreeNode;
  }
);
