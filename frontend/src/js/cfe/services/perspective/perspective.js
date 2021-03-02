/**
 * @license
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(
  function(){
    function Perspective(id, label, description, type, iconFiles){

      this.id = id;
      this.label = label;
      this.description = description || '';
      this.type = type || Perspective.prototype.Type.BUILT_IN.name;
      this.iconFiles = iconFiles;
      this.state = Perspective.prototype.State.INACTIVE;
    }

    Perspective.prototype = {
      Type: Object.freeze({
        BUILT_IN : {name: "built-in"},
        ADD_IN : {name: "add-in"}
      }),
      State: Object.freeze({
        INACTIVE : {name: "inactive"},
        ACTIVE : {name: "active"}
      }),
      id: function() { return this.id; },
      label: function() { return this.label; },
      description: function() { return this.description; },
      type: function() { return this.type; },
      iconFiles: function() { return (typeof this.iconFiles !== 'undefined' ? this.iconfiles : null) },
      state: function() { return this.state; },

    };

    return Perspective;
  }
);
