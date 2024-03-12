/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class representing the metadata for the Menu associated with a MenuLauncher
 * @module
 * @class
 * @classdesc Class representing the metadata for the Menu associated with a MenuLauncher
 */
define(['./menu'],
  function(Menu){
    /**
     * Create metadata for a menu launcher
     * @constructor
     * @param {string} id
     * @param {{id: string}} menu
     * @param {string} [cssClass='cfe-app-menu-launcher']
     * @typedef MenuLauncher
     */
    function MenuLauncher(id, menu, cssClass = 'cfe-app-menu-launcher') {
      this.id = id;
      this.menu = menu;
      this.cssClass = cssClass;
    }
    
    MenuLauncher.prototype = {
      id: () => { return this.id;},
      cssClass: () => { return this.cssClass;},
      addMenu: (menu) => {
        if (menu instanceof Menu) {
          Object.assign(this.menu, menu);
        }
      },
      getMenu: () => { return this.menu; }
    };
    
    return MenuLauncher;
  }
);
