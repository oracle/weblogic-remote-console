/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(
  function () {
    function Slice(data) {
      if (data['name'] !== undefined) this.name = data['name'];
      if (data['label'] !== undefined) this.label = data['label'];
      if (data['slices'] !== undefined) {
        this.slices = [];
        data['slices'].forEach(element => {
          this.slices.push(new Slice(element));
        });
      }
    }  

    Slice.prototype = {
      getName: function(){
        return (this.name ? this.name : undefined);
      },

      getLabel: function(){
        return (this.label ? this.label : undefined);
      },

      getSlices: function(){
        return (this.slices ? this.slices : undefined);
      }
    };

    // Return Slice constructor function
    return Slice;
  }
);    