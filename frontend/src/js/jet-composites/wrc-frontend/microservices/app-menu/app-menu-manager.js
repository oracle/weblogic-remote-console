/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'wrc-frontend/core/parsers/yaml',
  'text!wrc-frontend/config/app-menu.yaml',
  './menu-launcher',
  './menu',
  'ojs/ojlogger'
],
function (
  YamlParser,
  AppMenuFileContents,
  MenuLauncher,
  Menu,
  Logger
) {
    let appMenu = {};
  
    YamlParser.parse(AppMenuFileContents)
      .then(config => {
        const appMenuTemplate = {};
        if (config['appMenu']) {
          appMenuTemplate['menuLaunchers'] = config['appMenu']['menuLaunchers'];
          if (Array.isArray(appMenuTemplate.menuLaunchers)) {
            appMenuTemplate['menus'] = config['appMenu']['menus'];
            if (Array.isArray(appMenuTemplate.menus)) {
              for (const entry of appMenuTemplate.menuLaunchers) {
                const index = appMenuTemplate.menus.findIndex(item => item.id === entry.menu.id);
                if (index !== -1) {
                  const menu = new Menu(appMenuTemplate.menus[index].id, appMenuTemplate.menus[index].label);
                  menu.iconFile(appMenuTemplate.menus[index].iconFile);
                  menu.accelerator(appMenuTemplate.menus[index].accelerator);
                  menu.role(appMenuTemplate.menus[index].role);
                  menu.visible(appMenuTemplate.menus[index].visible);
                  menu.disabled(appMenuTemplate.menus[index].disabled);
  
                  const menuLauncher =  new MenuLauncher(entry.id, entry.menu, entry.cssClass);
                  menuLauncher.addMenu(menu);

                  appMenu[menuLauncher.id] = menuLauncher;
                }
              }
            }
          }
        }
      })
      .catch((err) => {
        Logger.error(err);
      });

    return {
      getAppMenu: () => { return appMenu; }

    };
  }
);
