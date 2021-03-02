/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(
  function() {
    function Attribute(data){
      if (data['name'] !== undefined) this.name = data['name'];
      if (data['label'] !== undefined) this.label = data['label'];
      if (data['fullHelpHTML'] !== undefined) this.fullHelpHTML = data['fullHelpHTML'];
      if (data['helpSummaryHTML'] !== undefined) this.helpSummaryHTML = data['helpSummaryHTML'];
      if (data['type'] !== undefined) this.dataType = data['type'];
    }

    Attribute.prototype = {
      getDataType: function() {
        return (this.dataType ? this.dataType : 'string');
      },

      getName: function() {
        return (this.name ? this.name : undefined);
      },

      getLabel: function() {
        return (this.label ? this.label : undefined);
      },

      getFullHelpHTML: function() {
        return (this.fullHelpHTML ? this.fullHelpHTML : undefined);
      },

      getHelpSummaryHTML: function() {
        return (this.helpSummaryHTML ? this.helpSummaryHTML : undefined);
      }
    };
    
    return Attribute;
  }
);