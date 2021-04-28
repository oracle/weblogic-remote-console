/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojlogger'],
  function (oj, ko, ArrayDataProvider, Logger) {

    const i18n = {
      "cfe-multi-select": {
        "labels": {
          "available": oj.Translations.getTranslatedString("wrc-pdj-fields.cfe-multi-select.labels.available"),
          "chosen": oj.Translations.getTranslatedString("wrc-pdj-fields.cfe-multi-select.labels.chosen")
        }
      }
    };

  //public:
    return {
      addFieldIcons: function (params) {
        let container = document.createElement("div");
        container.classList.add("cfe-form-field");

        let image = document.createElement("img");
        image.classList.add("restart-required-icon");
        if (params.restartRequired && !params.readOnly) {
          image.setAttribute("src", "../../images/" + params.icons.restart.iconFile + ".png");
          image.setAttribute("title", params.icons.restart.tooltip);
          image.style.visibility = "visible";
        }
        else {
          image.style.visibility = "hidden";
        }

        container.append(image);
        container.append(params.field);

        const moreIcon = document.createElement("img");
        moreIcon.classList.add(params.icons.more.iconClass);
        moreIcon.setAttribute("src", "../../images/" + params.icons.more.iconFile + ".png");
        moreIcon.setAttribute("title", params.icons.more.tooltip);
        moreIcon.style.visibility = (params.showMoreIcon ? "visible" : "hidden");

        // Add the more menu based on the supplied params
        if (typeof params.moreMenuParams !== 'undefined') {
          let menuParams = params.moreMenuParams;

          // Add link that will open the more menu,
          // append moreIcon to it, and then append
          // link to container.
          let linkRef = document.createElement("a");
          linkRef.setAttribute("id", menuParams.buttonId);
          linkRef.setAttribute("on-click", "[[moreMenuIconClickListener]]");
          linkRef.append(moreIcon);
          container.append(linkRef);

          // Add the more menu with the supplied menu items
          let menu = document.createElement("oj-menu");
          menu.setAttribute("id", menuParams.menuId);
          menu.setAttribute("on-oj-action", "[[moreMenuClickListener]]");
          menu.setAttribute("open-options.launcher", menuParams.buttonId);
          let menuItems = menuParams.menuItems;
          for (let i = 0; i < menuItems.length; i++) {
            let menuItem = document.createElement("oj-option");
            menuItem.setAttribute("id", "item"+i);
            menuItem.setAttribute("value", i);
            let span = document.createElement("span");
            span.innerText = menuItems[i];
            menuItem.append(span);
            menu.append(menuItem);
          }
          container.append(menu);
        }

        return container;
      },

      addUploadFileElements: function (params) {
        let container = document.createElement("div");
        container.classList.add("cfe-form-field");

        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("data-input", params.id);
        a.setAttribute("on-click", params.choose["on-click"]);
        a.setAttribute("tabindex", "-1");

        a.append(params.field);
        container.append(a);

        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("data-input", params.id);
        a.setAttribute("data-accepts", params.accepts);
        a.setAttribute("on-click", params.choose["on-click"]);
        a.setAttribute("tabindex", "-1");

        let image = document.createElement("img");
        image.classList.add("choose-file-icon");
        image.setAttribute("src", "../../images/" + params.choose.iconFile + ".png");
        image.setAttribute("title", params.choose.tooltip);

        a.append(image);
        container.append(a);

        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("data-input", params.id);
        a.setAttribute("on-click", params.clear["on-click"]);
        a.setAttribute("tabindex", "-1");

        image = document.createElement("img");
        image.setAttribute("id", params.id + "_clearChosen");
        image.classList.add("clear-chosen-file-icon");
        image.setAttribute("src", "../../images/" + params.clear.iconFile + ".png");
        image.setAttribute("title", params.clear.tooltip);
        image.style.display = "none";

        a.append(image);
        container.append(a);

        return container;
      },

      /**
       * Creates an <oj-select-one> for either reference-dynamic-enum (defined in rdj) or options (contained in rdj)
       * @param pdjTypes
       * @param value
       * @param dataValues
       * @param options
       * @returns {{field: HTMLElement, dataProvider: *}}
       */
      createSingleSelect: function (pdjTypes, value, dataValues, options) {
        let optionsArray = [];
        let field = document.createElement('oj-select-single');
        const name = options["name"];

        if (pdjTypes.isReadOnly(name) || options["isReadOnly"] || false) {
          //field.setAttribute("readonly", "readonly");

          field.setAttribute("readonly", "true");
          field.className = (options["isSingleColumn"]) ? "cfe-form-readonly-select-one-md" : "cfe-form-readonly-select-one" ;
        } else {
          field.className = (options["isSingleColumn"]) ? "cfe-form-select-one-md" : "cfe-form-select-one" ;
        }

        if (dataValues[name] != null && typeof dataValues[name].options !== 'undefined') {
          for (var i in dataValues[name].options) {
            let o = dataValues[name].options[i];

            if (o != null) {
              if (o.kind === 'collectionChild') {
                var optionPath = o.path;

                optionsArray.push({
                  value: o,
                  label: optionPath[optionPath.length - 1].key
                });
              }
            } else {
              optionsArray.push({
                value: "", label: "None"
              });
            }
          }
        } else if (pdjTypes.hasLegalValues(name)) {
          let legalValueWidth = 0;
          let legalValues = pdjTypes.getLegalValues(name);
          for (var j in legalValues) {
            let o = legalValues[j];

            if (o !== null) {
              optionsArray.push({ value: o.value, label: o.label });
              legalValueWidth = o.label.length;
            } else {
              optionsArray.push({ value: "", label: "None" });
            }
          }
          if (legalValueWidth > 40) field.className = "cfe-form-select-one-wide";
          // for creating new, we want to set the value to be the first legal value instead of leaving it blank,
          // as this will be a required field.
          if (!options["isEdit"] && value === "") {
            if (typeof legalValues[0].value !== 'undefined') {
              field.defaultForCreate = legalValues[0].value;
            }
          }
        } else {
          Logger.warn(`createSingleSelect() used without options or legal values!`);
          optionsArray.push({ label: pdjTypes.getLabel(name), value: value });
        }

        return {dataProvider: new ArrayDataProvider(optionsArray, { keyAttributes: 'value' }), field: field};
      },

      /**
       * Create a cfe-multi-select for type reference-dynamic-enum with array property set to true.
       * @param dataValues
       * @param name
       * @returns {{chosenItems: Array, field: HTMLElement, origChosenLabels: Array, availableItems: Array}}
       */
      createMultiSelect: function (dataValues, name) {
        let optionPath, availableItems = [], chosenItems = [], origChosenLabels = [];
        // Set the chosen and available items to cfe-multi-select
        if (dataValues[name] != null) {
          if (typeof dataValues[name].value !== 'undefined') {
            for (var j in dataValues[name].value) {
              const va = dataValues[name].value[j];
              if (va !== null) {
                if (va.kind === 'collectionChild') {
                  optionPath = va.path;
                  const shortName = optionPath[optionPath.length - 1].key;
                  chosenItems.push({ value: JSON.stringify(va), label: shortName });
                  origChosenLabels.push(shortName);
                }
              }
            }
          }
          if (typeof dataValues[name].options !== 'undefined') {
            for (var i in dataValues[name].options) {
              const op = dataValues[name].options[i];
              if (op != null) {
                if (op.kind === 'collectionChild') {
                  optionPath = op.path;
                  const shortName = optionPath[optionPath.length - 1].key;
                  if (!origChosenLabels.includes(shortName)) {
                    availableItems.push({ value: JSON.stringify(op), label: shortName });
                  }
                }
              }
            }
          }
        }
        let field = document.createElement('cfe-multi-select');
        field.classList.add("cfe-multi-select");
        // set the properties
        field.setAttribute("id", name);
        field.setAttribute("available-header", i18n["cfe-multi-select"].labels.available);
        field.setAttribute("chosen-header", i18n["cfe-multi-select"].labels.chosen);
        return {availableItems: availableItems, chosenItems: chosenItems, origChosenLabels: origChosenLabels, field: field};
      },

      /**
       * Returns an object containing data associated with the chosen items in the cfe-multi-select with a given DOM element id (e.g. `arrayKey`).
       * <p>The returned object has the following properties:</p>
       * <ul>
       *   <li></li>
       * </ul>
       * @param chosenItems {[*]}}
       * @param origChosenLabels {[string]}}
       * @returns {{data: *, chosenLabels: [string], isDirty: boolean}}
       */
      getMultiSelectChosenItems: function (chosenItems, origChosenLabels) {
        let dataPayload = {}, values = [];
        let result = {data: {}, chosenLabels: [], isDirty: false};
        for (let i = 0; i < chosenItems.length; i++) {
          result.chosenLabels.push(chosenItems[i].label);
          values.push(JSON.parse(chosenItems[i].value));
        }

        const isSameSet = function (arr1, arr2) {
          return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
        };

        const notDirty = isSameSet(origChosenLabels, result.chosenLabels);
        if (!notDirty) {
          result.data = { value: values };
          result.isDirty = true;
        }

        return result;
      },

      createMultiSelectControlItem: function (availableItems, fieldValue) {
        const result = {availableItems: [], chosenItems: [], origChosenLabels: []};
        for (let i = 0; i < fieldValue.length; i++) {
          const chosenItem = {
            value: fieldValue[i].value,
            label: fieldValue[i].label
          };
          result.chosenItems.push(chosenItem);
          result.origChosenLabels.push(chosenItem.label);
          availableItems = availableItems.filter(availableItem => availableItem.label !== chosenItem.label);
        }
        result.availableItems = [...availableItems];
        return result;
      },

      /**
       *
       * @param properties
       * @param dataValues
       * @param {{isReadOnly?: boolean}} options
       * @returns {{field: HTMLElement, debugFlagsEnabled: Array, dataProvider: *}}
       */
      createDebugFlagsCheckboxset: function (properties, dataValues, options) {
        const debugFlagOptions = [], debugFlagsEnabled = [];

        properties.forEach((property) => {
          if (dataValues[property.name] != null) {
            debugFlagOptions.push({ value: property.name, label: property.label, enabled: dataValues[property.name].value });
            if (dataValues[property.name].value) debugFlagsEnabled.push(property.name);
          }
        });

        const field = document.createElement('oj-checkboxset');
        field.classList.add("cfe-form-checkboxset");
        field.setAttribute("id", "debugFlagsCheckboxset");
        field.setAttribute("options", "[[debugFlagItems]]");
        field.setAttribute("value", "{{debugFlagsEnabled}}");
        field.setAttribute("on-value-changed", "[[debugFlagsValueChanged]]");
        field.setAttribute("disabled", options.isReadOnly);

        return {debugFlagsEnabled: debugFlagsEnabled, dataProvider: new ArrayDataProvider(debugFlagOptions, { keyAttributes: 'value' }), field: field};
      },

      resetDebugFlagsEnabled: function (debugFlags) {
        let debugFlagsEnabled = [];
        if (typeof debugFlags !== "undefined" && debugFlags !== null) {
          debugFlags.data.forEach((before) => {
            if (before.enabled) debugFlagsEnabled.push(before.value);
          });
        }
        return debugFlagsEnabled;
      },

      createInputPassword: function (className) {
        const field = document.createElement("oj-input-password")
        field.classList.add(className);
        return field;
      },

      createInputText: function (options) {
        const field = document.createElement("oj-input-text")
        field.classList.add(options["className"]);
        field.setAttribute("placeholder", options["placeholder"]);
        field.setAttribute("readonly", options["readonly"] || false);
        return field;
      },

      createReadOnlyText: function (options) {
        const field = document.createElement("oj-input-text");
        field.classList.add(options["className"]);
        field.setAttribute("readonly", options["readonly"] || false);
        return field;
      },

      createSwitch: function (className) {
        const field = document.createElement("oj-switch")
        field.classList.add(className);
        return field;
      },

      createLabel: function (name, pdjTypes, helpInstruction) {
        const label = document.createElement("oj-label");
        label.innerHTML = pdjTypes.getLabel(name) + (pdjTypes.isRequired(name) ? "*": "");
        label.style.color = "#161513";
        label.setAttribute("for", name);
        label.setAttribute("slot", "label");
        label.setAttribute("help.definition", helpInstruction);

        const detailedHelp = pdjTypes.getHelpDetailed(name);

        if (detailedHelp !== null) {
          label.setAttribute("on-click", "[[helpIconClick]]");
          label.setAttribute("data-detailed-help", detailedHelp);
        }
        return label;
      },

      createTextArea: function (options) {
        const field = document.createElement("oj-text-area");
        field.classList.add(options["className"]);
        field.setAttribute("resize-behavior", options["resize-behavior"]);
        field.setAttribute("placeholder", options["placeholder"]);
        field.setAttribute("readonly", options["readonly"] || false);
        return field;
      },

      createFileChooser: function (className) {
        const field = document.createElement("oj-input-text")
        field.classList.add(className);
        field.setAttribute("readonly", true);
        return field;
      },

      createSinglePropertyTable: function (name, value, pdjTypes) {
        const result = {};
        const field = document.createElement("oj-table");
        field.setAttribute("columns", "[[singlePropertyTableColumns]]");
        field.setAttribute("data", "[[singlePropertyTableDataProvider]]");
        let propertyTableArray = [];

        value.split(', ').forEach(function (v) {
          let ele = {};
          ele[name] = v;
          propertyTableArray.push(ele);
        });

        result["dataProvider"] = new ArrayDataProvider(propertyTableArray, { keyAttributes: name });
        result["columns"] = ko.observableArray([{ headerText: pdjTypes.getLabel(name), field: name}]);
        result["property"] = true;
        result["field"] = field;
        return result;
      },

      createHelpInstruction: function (name, pdjTypes) {
        // parse the help summary to strip html tags.
        const fakeDiv = document.createElement("div");
        fakeDiv.innerHTML = pdjTypes.getHelpInstruction(name);
        return fakeDiv.innerText;
      },

      getDebugFlagItems: function (debugFlags, debugFlagsEnabled) {
        let dPayload = {};
        if (typeof debugFlags !== "undefined" && debugFlags !== null && debugFlagsEnabled !== null) {
          debugFlags.data.forEach((before) => {
            const result = debugFlagsEnabled.find(after => after === before.value);
            if (typeof result !== "undefined") {
              // before.value is in debugFlagsEnabled, but
              // we only need to set the value to true if it
              // was false
              if (!before.enabled) dPayload[before.value] = { value: true };
            } else {
              // before.value is not in debugFlagsEnabled, but it
              // might have been true before. If so, then set the value
              // to false in dPayload
              if (before.enabled) dPayload[before.value] = { value: false };
            }
          });
        }
        return dPayload;
      }

    };
  }
);
