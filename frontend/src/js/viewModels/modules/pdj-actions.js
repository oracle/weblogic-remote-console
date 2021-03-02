/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', '../../cfe/common/runtime', '../../cfe/http/adapter', './pdj-fields', '../../cfe/common/utils', 'ojs/ojlogger'],
  function (ko, Runtime, HttpAdapter, PageDefinitionFields, Utils, Logger) {
    function PageDefinitionActions(pdjActions, rdjData) {
      if (typeof pdjActions !== "undefined" && typeof rdjData !== "undefined") {
        this.pdjData = {actions: convertPDJActions(pdjActions)};
        this.rdjData = rdjData;
      }
      else {
        if (typeof pdjActions === "undefined") Logger.warn(`[PDJACTIONS] Constructor parameter is undefined: pdjActions`);
        if (typeof rdjData === "undefined") Logger.warn(`[PDJACTIONS] Constructor parameter is undefined: rdjData`);
      }
    }

    const SUPPORTED_ACTIONS = Object.freeze({
      "start": {iconFile: "action-start-icon-blk_24x24", visible: true, disabled: false},
      "resume": {iconFile: "action-resume-icon-blk_24x24", visible: true, disabled: false},
      "suspend": {iconFile: "action-suspend-icon-blk_24x24", visible: true, disabled: false},
      "shutdown": {iconFile: "action-stop-icon-blk_24x24", visible: true, disabled: false},
      "restartSSL": {iconFile: "action-restart-icon-blk_24x24", visible: true, disabled: false},
      "stop": {iconFile: "action-stop-icon-blk_24x24", visible: true, disabled: false}
    });

    function convertPDJActions(pdjActions) {
      let actions = [];
      pdjActions.forEach((action) => {
        if (typeof action.actions !== "undefined") {
          const action1 = {name: action.name, label: action.label, asynchronous: (typeof action.asynchronous !== "undefined" ? action.asynchronous : false), actions: []};
          action.actions.forEach((action2) => {
            action1.actions.push({name: action2.name, label: action2.label});
          });
          actions.push(action1);
        }
        else {
          action.asynchronous = (typeof action.asynchronous !== "undefined" ? action.asynchronous : false);
          actions.push(action);
        }
      });

      return actions;
    }

    function getConvertedData(action) {
      const convertedData = {data: []};
      let data = [];
      data = this.rdjData.data.filter(data1 => data1.actions.map(action1 => action1.name).indexOf(action) !== -1);
      const normal = getFilteredData(data);
      data = this.rdjData.data.filter(data1 => typeof data1.actions.actions !== "undefined" && data1.actions.actions.map(action1 => action1.name).indexOf(action) !== -1);
      const variant = getFilteredData(data);
      convertedData.data = normal.concat(variant);
      return convertedData;
    }

    function getFilteredData(data) {
      let filteredData = [];
      if (data.length > 0) {
        let actions;
        data.forEach((entry) => {
          if (typeof entry.actions.actions !== "undefined") {
            actions = entry.actions.actions ;
          }
          else {
            actions = entry.actions;
          }
          filteredData.push({identity: entry.identity, actions: actions});
        });
      }
      return filteredData;
    }

    function getTargetMBean() {
      let targetMBean;
      if (this.hasActions()) {
        const pageDefinition = this.rdjData.pageDefinition;
        targetMBean = pageDefinition.substring(0,pageDefinition.indexOf("?"));
      }
      return targetMBean;
    }

    function getDataByAction(action) {
      let filteredData = [];
      if (this.hasActions()) {
        const convertedData = getConvertedData.call(this, action);
        filteredData = convertedData.data.filter(data1 => data1.actions.map(action1 => action1.name).indexOf(action) !== -1);
      }
      return filteredData;
    }

    function getDataActionsCount(action) {
      const filteredData = getDataByAction.call(this, action);
      return filteredData.length;
    }

    function getDataActionsMap(data) {
      let actionsMap = {};
      data.actions.forEach((action1) => {
        if (typeof action1.actions === "undefined") {
          actionsMap[action1.name] = action1.resourceData;
        }
        else {
          action1.actions.forEach((action2) => {
            actionsMap[action2.name] = action2.resourceData;
          });
        }
      });
      return actionsMap;
    }

    function getActionsDialogData(action) {
      let options = [], urls = [];
      if (this.hasActions()) {
        const filteredData = getDataByAction.call(this, action);
        filteredData.forEach((data) => {
          const actionsMap = getDataActionsMap(data);
          if (Object.keys(actionsMap).length > 0) {
            options.push(data.identity);
            urls.push({path: Utils.pathEncodedFromIdentity(data.identity), url: actionsMap[action]});
          }
        });
      }
      return {options: options, urls: urls};
    }

    function getButtonIconFile(actionName) {
      let iconFile = "no-toolbar-icon_24x24";
      if (typeof SUPPORTED_ACTIONS[actionName] !== "undefined") {
        iconFile = SUPPORTED_ACTIONS[actionName].iconFile;
      }
      return iconFile;
    }

    function createButton(action) {
      const button = {html: document.createElement("oj-button")};
      button["id"] = (typeof action.actions === "undefined" ? action.label : action.name + "MenuLauncher");
      button["name"] = action.name;
      button["disabled"] = false;
      button["asynchronous"] = action.asynchronous;
      button.html.setAttribute("id", button.id);
      button.html.setAttribute("data-action", button.name);
      button.html.setAttribute("on-oj-action", (typeof action.actions === "undefined" ? "[[actionButtonClicked]]" : "[[launchActionMenu]]"));
      button.html.setAttribute("chroming", "borderless");
      button.html.setAttribute("disabled", "[[actionButtons.buttons." + button.name + ".disabled]]");
      const img = document.createElement("img");
      img.className = "button-icon";
      img.setAttribute("slot", "startIcon");
      img.setAttribute("src", "../images/" + getButtonIconFile(action.name) + ".png");
      img.setAttribute("alt", action.label);
      button.html.append(img);
      const span = document.createElement("span");
      span.className = "button-label";
      span.innerText = action.label;
      button.html.append(span);
      return button;
    }

    function createMenu(action) {
      let option;
      const menu = document.createElement("oj-menu");
      menu.setAttribute("id", action.name + "Menu");
      menu.setAttribute("aria-labelledby", action.name + "MenuLauncher");
      menu.setAttribute("on-oj-action", "[[actionMenuClickListener]]");
      menu.setAttribute("open-options.launcher", action.name + "MenuLauncher");
      action.actions.forEach((variant) => {
        option = document.createElement("oj-option");
        option.setAttribute("id", action.label);
        option.setAttribute("value", variant.name);
        option.setAttribute("data-action", action.name);
        const span = document.createElement("span");
        span.innerText = variant.label;
        option.append(span);
        menu.append(option);
      });
      return menu;
    }

    //public:
    PageDefinitionActions.prototype = {
      hasActions: function () {
        return (typeof this.pdjData !== "undefined" && typeof this.rdjData !== "undefined");
      },

      hasChosenAction: function (action) {
        let actions = [];
        if (this.hasActions()) {
          const filteredData = getDataByAction.call(this, action);
          filteredData.forEach((data) => {
            actions.push(data.identity);
          });
        }
        return (actions.length > 0);
      },

      createActionsButtons: function () {
        const actionButtons = {html: document.createElement("p"), buttons: []};
        if (this.hasActions()) {
          actionButtons.html = document.createElement("div");
          this.pdjData.actions.forEach((action) => {
            const button = createButton(action);
            actionButtons.html.append(button.html);
            actionButtons.buttons[button.name] = {
              id: button.id,
              disabled: ko.observable(button.disabled),
              asynchronous: button.asynchronous
            };
            if (typeof action.actions !== "undefined") {
              const menu = createMenu(action);
              actionButtons.html.append(menu);
            }
          });
        }
        return actionButtons;
      },

      createActionsDialog: function (action) {
        const formLayout = document.createElement("oj-form-layout");
        formLayout.setAttribute("label-edge", "start");
        let results = {
          domElementId: getTargetMBean.call(this),
          formLayout: formLayout,
          availableItems: [],
          urls: []
        };
        if (this.hasActions()) {
          let dataValues = {};
          const dialogData = getActionsDialogData.call(this, action);
          dataValues[results.domElementId] = {options: dialogData.options};

          const multiSelect = PageDefinitionFields.createMultiSelect(dataValues, results.domElementId);
          const field = multiSelect.field;
          field.setAttribute("available-items", "[[availableItems]]");
          field.setAttribute("chosen-items", "[[chosenItems]]");

          formLayout.append(field);

          results.formLayout = formLayout;
          results.field = field;
          results.availableItems = multiSelect.availableItems;
          results.urls = dialogData.urls;
        }

        return results;
      },

      populateActionsButtonsStates: function (buttons) {
        if (this.hasActions()) {
          for (const key of Object.keys(buttons)) {
            const count = getDataActionsCount.call(this, key);
            buttons[key].disabled(count === 0);
          }
        }
        return buttons;
      },

      disableAllActionsButtons: function (buttons) {
        if (this.hasActions()) {
          for (const key of Object.keys(buttons)) {
            buttons[key].disabled(true);
          }
        }
        return buttons;
      },

      performActionOnChosenItems: function (chosenItems, actionUrls) {
        return new Promise(function (resolve, reject) {
          chosenItems.forEach((item) => {
            const path = Utils.pathEncodedFromIdentity(item);
            const uri = actionUrls.find(url => url.path === path);
            const actionUrl = Runtime.getBaseUrl() + "/" + uri.url;
            $.ajax({
              type: "POST",
              url: actionUrl,
              data: JSON.stringify({}),
              contentType: "application/json",
              dataType: 'json',
              complete: function (response) {
                if (typeof response !== "undefined") {
                  if (response.status < 200 || response.status > 299) {
                    reject(response);
                  } else {
                    resolve(actionUrl);
                  }
                }
                else {
                  resolve(actionUrl);
                }
              }
            });
          });
        });
      }

    };

    // Return PageDefinitionActions constructor function.
    return PageDefinitionActions;
  }
);
