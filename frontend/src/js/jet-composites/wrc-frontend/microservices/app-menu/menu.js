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
define(
  function(){
    /**
     * Create metadata for a menu
     * @constructor
     * @param {string} id
     * @param {string} label
     */
    function Menu(id, label = '') {
      this.id = id;
      this.label = label;
      this.submenu = [];
    }
    
    Menu.prototype = {
      id: () => { return this.id;},
      label: (value) => { if (value) { this.label = value; } return this.label; },
      iconFile: (options) => {
        if (options && options.name && options.name.trim() !== '') {
          options['type'] = options.type || 'class';
          this.iconFile['type'] = options.type;
          this.iconFile['name'] = options.name;
        }
        return this.iconFile;
      },
      accelerator: (value) => { if (value) { this.accelerator = value; } return this.accelerator; },
      role: (value) => { if (value) { this.role = value; } return this.role; },
      action: (callback) => { if (typeof callback === 'function') { this.action = callback; } return this.action; },
      visible: (value) => { if (typeof value === 'boolean') { this.visible = value; } return this.visible || false; },
      disabled: (value) => { if (typeof value === 'boolean') { this.disabled = value; } return this.disabled || true; },
      submenu: () => { return this.submenu;},
      getMenu: (menuId) => {
        let menu;
        if (menuId) {
          menu = this.submenu.find(item => item.id === menuId);
        }
        return menu;
      },
      addMenu: (menu) => {
        if (menu instanceof Menu) {
          const index = this.submenu.map(item => item.id).indexOf(menu.id);
          if (index === -1) this.submenu.push(menu);
        }
      },
      removeMenu: (menuId) => {
        const index = this.submenu.map(item => item.id).indexOf(menuId);
        if (index !== -1) this.submenu.splice(index, 1);
      }

    };
    
    return Menu;
  }
);