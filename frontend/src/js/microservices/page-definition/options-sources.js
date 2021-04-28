/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['./utils'],
  function (PageDefinitionUtils) {

    const MORE_ICON_PREFIX = Object.freeze("moreIcon_");
    const MORE_MENU_PREFIX = Object.freeze("moreMenu_");

    const i18n = {
      menus: {
        more: {
          optionsSources: {
            view: { label: "View/Create {0}..." }
          }
        }
      },
    };

    function getPropertyName(event) {
      // Get the more menu id based on the property name in the event
      return event.currentTarget.id.substring(MORE_ICON_PREFIX.length);
    }

  //public:
    return {
      showMenuItems: function (event) {
        const propertyName = getPropertyName(event);
        const menuId = MORE_MENU_PREFIX + propertyName;

        // Open the more menu for the property name
        document.getElementById(menuId).open(event);
      },

      getMoreMenuParams: function(propertyName, optionsSources) {
        // Setup the more menu information
        let params = {
          buttonId: MORE_ICON_PREFIX + propertyName,
          menuId: MORE_MENU_PREFIX + propertyName,
          menuItems: []
        };
        // Form the menu items from the option sources identity
        // by replacing the format parameter from the i18n text
        let menuItemLabelFormat = i18n.menus.more.optionsSources.view.label;
        for (let i = 0; i <  optionsSources.length; i++) {
          let display = PageDefinitionUtils.displayNameFromIdentity(optionsSources[i]);
          let itemLabel = menuItemLabelFormat.replace("{0}", display);
          params.menuItems.push(itemLabel);
        }
        return params;
      },

      getMenuItemPath: function (event, rdjData) {
        function isOptionsSourcesProperty(propertyName, rdjData) {
          return (typeof rdjData.data !== 'undefined')
            && (typeof rdjData.data[propertyName] !== 'undefined')
            && (typeof rdjData.data[propertyName].optionsSources !== 'undefined');
        }

        let path;
        const propertyName = getPropertyName(event);

        if (isOptionsSourcesProperty(propertyName, rdjData)) {
          // Get the index value for the optionSources from the menu item value
          const index = Number(event.target.value);
          const optionsSource = rdjData.data[propertyName].optionsSources[index];
          // Get the path from the option source identity
          path = PageDefinitionUtils.pathEncodedFromIdentity(optionsSource);
        }
        return path;
      }

    };
  }
);
