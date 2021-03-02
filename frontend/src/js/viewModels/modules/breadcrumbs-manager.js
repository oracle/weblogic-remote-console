/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'ojs/ojarraydataprovider', '../../cfe/services/perspective/perspective-memory-manager', './navtree-manager', 'ojs/ojlogger', '../../cfe/common/utils'],
  function (ko, ArrayDataProvider, PerspectiveMemoryManager, NavtreeManager, Logger, Utils) {

    function BreadcrumbsManager(perspective, breadcrumbsObservableArray){
      this.perspective = perspective;
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(perspective.id);
      this.navtreeManager = new NavtreeManager(perspective);
      this.breadcrumbs = breadcrumbsObservableArray;
    }

    function createBreadcrumbMenu(button, linksData) {
      let option;
      const menu = document.createElement("oj-menu");
      menu.setAttribute("id", button.name + "Menu");
      menu.setAttribute("on-oj-action", "[[breadcrumbMenuClickListener]]");
      menu.setAttribute("slot", "menu");
      linksData.forEach((link) => {
        if (link.name === "---") {
          option = document.createElement("oj-option");
          option.innerText = "---";
          menu.append(option);
        }
        else if (link.name !== "") {
          option = document.createElement("oj-option");
          option.setAttribute("id", link.name);
          option.setAttribute("value", link.label);
          option.setAttribute("data-kind", link.identity.kind);
          option.setAttribute("data-perspective", link.identity.perspective);
          option.setAttribute("data-path", Utils.pathEncodedFromIdentity(link.identity));
          option.setAttribute("data-breadcrumbs", Utils.breadcrumbsFromIdentity(link.identity));
          option.setAttribute("data-notFoundMessage", link.message);
          const span = document.createElement("span");
          span.innerText = link.label;
          option.append(span);
          menu.append(option);

        }
      });
      return menu;
    }

  //public:
    BreadcrumbsManager.prototype = {
      createBreadcrumbs: function (pathParam) {
        const self = this;
        return new Promise(function (resolve) {
          pathParam = Utils.removeTrailingSlashes(pathParam);
          let breadcrumbLabels = [];
          if (pathParam !== "") {
            self.navtreeManager.getPathModel(pathParam)
            .then((pathModel) => {
              Logger.info(`[BREADCRUMB-MANAGER] pathModel=${JSON.stringify(pathModel)}`);
              if (typeof pathModel.breadcrumbs !== "undefined") {
                breadcrumbLabels = self.getBreadcrumbLabels(pathParam, pathModel.breadcrumbs);
                resolve(breadcrumbLabels);
              }
              else {
                resolve(breadcrumbLabels);
              }
            });
          }
          else {
            resolve(breadcrumbLabels);
          }
        });
      },

      getBreadcrumbLabels: function(pathParam, breadcrumbs) {
        const self = this;
        let breadcrumbLabels = breadcrumbs.split("/");
        self.breadcrumbs([]);
        const actualPathParam = pathParam;
        actualPathParam.split("/").forEach((pathElement, index) => {
          let breadcrumbPath = actualPathParam.split("/", index + 1).join("/");

          let label = (breadcrumbLabels.length > 0 ? breadcrumbLabels[index] : pathElement);
          let breadcrumb = {
            name: pathElement,
            label: decodeURIComponent(label),
            path: breadcrumbPath
          };

          // ignore empty elements that are the result of extra :'s in path
          if (pathElement !== "") {
            self.breadcrumbs.push(breadcrumb);
          }
        });
        return breadcrumbLabels;
      },

      renderBreadcrumbs: function(linksData) {
        let crumb, menu;
        const div = document.createElement("div");
        div.setAttribute("id", "breadcrumbs-container");
        const ul = document.createElement("ul");
        ul.className = "breadcrumb";
        this.breadcrumbs().forEach((item, index) => {
          crumb = document.createElement("li");
          if (index === this.breadcrumbs().length-1) {
            if (typeof linksData !== "undefined" && linksData.length > 0) {
              const button = document.createElement("oj-menu-button");
              button.setAttribute("chroming", "borderless");
              button.innerText = item.label;
              menu = createBreadcrumbMenu.call(this, item, linksData);
              button.append(menu);
              crumb.append(button);
            }
            else {
              crumb.innerText = item.label;
            }
          }
          else {
            const anchor = document.createElement("a");
            anchor.setAttribute("id", item.path);
            anchor.setAttribute("href", "#");
            anchor.setAttribute("on-click", "[[breadcrumbClick]]");
            anchor.innerText = item.label;
            crumb.append(anchor);
          }
          ul.append(crumb);
        });
        if (typeof menu !== "undefined") {
          ul.style.margin = "0 0 0 10px";
          ul.style.padding = "0 0 2px 0";
        }
        else {
          ul.style.margin = "5px 0 0 10px";
          ul.style.padding = "2px 0 5px 0";
        }
        div.append(ul);
        return div;
      },

      getBreadcrumbsVisibility: function () {
        return this.perspectiveMemory.breadcrumbsVisibility();
      },

      setBreadcrumbsVisibility: function (visible) {
        this.perspectiveMemory.setBreadcrumbsVisibility(visible);
      }

    };

    // Return BreadcrumbsManager constructor function
    return BreadcrumbsManager;
  }
);
