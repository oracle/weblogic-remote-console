/**
 * @license
 * Copyright (c) 2020, 2024 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'wrc-frontend/core/utils', 'ojs/ojlogger', './unset'],
  function (oj, ko, ArrayDataProvider, CoreUtils, Logger, Unset) {

    const i18n = {
      'cfe-multi-select': {
        'labels': {
          'available': oj.Translations.getTranslatedString('wrc-pdj-fields.cfe-multi-select.labels.available'),
          'chosen': oj.Translations.getTranslatedString('wrc-pdj-fields.cfe-multi-select.labels.chosen')
        }
      },
      'cfe-property-list-editor': {
        'labels': {
          'nameHeader': oj.Translations.getTranslatedString('wrc-pdj-fields.cfe-property-list-editor.labels.nameHeader'),
          'valueHeader': oj.Translations.getTranslatedString('wrc-pdj-fields.cfe-property-list-editor.labels.valueHeader'),
          'addButtonTooltip': oj.Translations.getTranslatedString('wrc-pdj-fields.cfe-property-list-editor.labels.addButtonTooltip'),
          'deleteButtonTooltip': oj.Translations.getTranslatedString('wrc-pdj-fields.cfe-property-list-editor.labels.deleteButtonTooltip')
        }
      }
    };

    function selectCommon(pdjTypes, value, dataValues, options, field) {
      let optionsArray = [];
      const name = options['name'];
      let warning = null;

      if (pdjTypes.isReadOnly(name) || options['isReadOnly'] || false) {
        //field.setAttribute("readonly", "readonly");

        field.setAttribute('readonly', 'true');
        if (options['className']) {
          field.className = options['className'];
        }
        else {
          field.className = (options['isSingleColumn']) ? 'cfe-form-readonly-select-one-md' : 'cfe-form-readonly-select-one';
        }
      }
      else {
        if (options['className']) {
          field.className = options['className'];
        }
        else {
          field.className = (options['isSingleColumn']) ? 'cfe-form-select-one-md' : 'cfe-form-select-one';
        }
      }

      if (dataValues[name] != null && typeof dataValues[name].options !== 'undefined') {
        for (const i in dataValues[name].options) {
          const op = dataValues[name].options[i];
          if (op.value !== null) {
            optionsArray.push({value: op.value, label: op.label});
          }
          else {
            optionsArray.push({value: '', label: CoreUtils.isNotUndefinedNorNull(op.label) ? op.label: 'None'});
          }
        }
      }
      else
      if (pdjTypes.hasLegalValues(name)) {
        let legalValueWidth = 0;
        const legalValues = pdjTypes.getLegalValues(name);
        for (const j in legalValues) {
          const o = legalValues[j];
          if (o.value === null) {
            o.value = CoreUtils.NULL_VALUE;
          }
          const option = { value: o.value, label: o.label || o.value};
          optionsArray.push(option);
          legalValueWidth = option.label.length;
        }
        // checking if value is part of legalValues, if it is not, add it to dropdown
        const dataValue = (dataValues[name] != null) ? dataValues[name].value : undefined;
        if (dataValue && !legalValues.some((option) => `${option.value}''`.toLowerCase() === `${dataValue}''`.toLowerCase())) {
          optionsArray.push({ value: dataValue, label: `${dataValue}''` });
        }
        if (legalValueWidth > 40) field.className = 'cfe-form-select-one-wide';
        // for creating new, we want to set the value to be the first legal value instead of leaving it blank,
        // as this will be a required field.
        if (!options['isEdit'] && value === '') {
          if (typeof legalValues[0].value !== 'undefined') {
            field.defaultForCreate = legalValues[0].value;
          }
        }
      }
      else {
        let warning = 'used without options or legal values!' ;
        optionsArray.push({ label: pdjTypes.getLabel(name), value: value });
      }
      return {optionsArray, warning}
    }

  //public:
    return {
      addFieldIcons: function (params) {
        let container = document.createElement('div');
        container.classList.add('cfe-form-field');

        let image = document.createElement('img');
        if (params.field.className !== 'cfe-multi-select'){
          image.classList.add('restart-required-icon');
          if (params.restartRequired && !params.readOnly) {
            image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + params.icons.restart.iconFile + '.png');
            image.setAttribute('title', params.icons.restart.tooltip);
            image.style.visibility = 'visible';
          }
          else {
            image.style.visibility = 'hidden';
          }
          if (params.field.className !== 'cfe-property-list-editor') container.append(image);
        }
        const id = params.field.getAttribute('id');
        if ( !params.readOnly && params.needsWdtIcon) {
          image.classList.add('cfe-button-icon');
          image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + params.icons.wdtIcon.iconFile + '.png');
          image.setAttribute('title', params.icons.wdtIcon.tooltip);
          image.style.visibility = 'visible';
          image.style.verticalAlign = 'top';
          let linkRef = document.createElement('a');
          linkRef.setAttribute('id', 'wdtOptions_' + id);
          linkRef.setAttribute('replacer', params.replacer);
          linkRef.setAttribute('data-id', id);
          linkRef.setAttribute('data-value', params.field.getAttribute('value'));
          linkRef.setAttribute('data', params.field.getAttribute('data'));  //will be null except for single select
          linkRef.setAttribute('data-displayClass', params.field.localName);
          linkRef.setAttribute('readonly', params.readOnly);
          linkRef.setAttribute('valueset', params.valueSet);
          linkRef.setAttribute('namelabel', params.nameLabel);
          linkRef.setAttribute('supportsModelTokens', params.supportsModelTokens);
          linkRef.setAttribute('supportsUnresolvedReferences', params.supportsUnresolvedReferences);
          linkRef.setAttribute('valueFrom', params.valueFrom);
          linkRef.setAttribute('wktTool', params.wktTool);
          linkRef.setAttribute('on-click', '[[wdtOptionsIconClickListener]]');
          linkRef.append(image);
          container.append(linkRef);
        }

        if (params.extraField !== null){
          let extraFieldDiv = document.createElement('div');
          extraFieldDiv.setAttribute('id', 'extraField_' + id);
          extraFieldDiv.style.display = (params.showExtraField ? 'inline-flex' : 'none');
          extraFieldDiv.append(params.extraField);
          container.append(extraFieldDiv);

          let baseFieldDiv = document.createElement('div');
          baseFieldDiv.setAttribute('id', 'baseField_' + id);
          baseFieldDiv.style.display = (params.showExtraField ? 'none' : 'inline-flex');
          baseFieldDiv.append(params.field);
          container.append(baseFieldDiv);
        }
        else {
          container.append(params.field);
        }

        if (params.field.className === 'cfe-multi-select') {
          container.classList.add('oj-flex');
          return container;
        }

        const moreIcon = document.createElement('img');
        moreIcon.classList.add(params.icons.more.iconClass);
        moreIcon.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + params.icons.more.iconFile + '.png');
        moreIcon.setAttribute('title', params.icons.more.tooltip);
        moreIcon.style.visibility = (params.showMoreIcon ? 'visible' : 'hidden');

        // Add the more menu based on the supplied params
        if (typeof params.moreMenuParams !== 'undefined') {
          let menuParams = params.moreMenuParams;

          if (!menuParams.disabled) {
            // Add link that will open the more menu,
            // append moreIcon to it, and then append
            // link to container.
            const linkRef = document.createElement('a');
            linkRef.setAttribute('id', menuParams.buttonId);
            linkRef.setAttribute('on-click', '[[moreMenuIconClickListener]]');
            linkRef.append(moreIcon);
            container.append(linkRef);
          }

          // Add the more menu with the supplied menu items
          const menu = document.createElement('oj-menu');
          menu.setAttribute('id', menuParams.menuId);
          menu.setAttribute('data-property-label', menuParams.propertyLabel);
          menu.setAttribute('data-property-value', menuParams.propertyValue);
          menu.setAttribute('data-perspective-id', menuParams.perspectiveId);
          menu.setAttribute('data-options-sources', menuParams.optionsSources);
          menu.setAttribute('on-oj-action', '[[moreMenuClickListener]]');
          menu.setAttribute('open-options.launcher', menuParams.buttonId);

          const menuItems = menuParams.menuItems;

          for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].visible) {
              const menuItem = document.createElement('oj-option');
              menuItem.classList.add(...menuItems[i].classes);
              menuItem.setAttribute('role', menuItems[i].role);
              menuItem.setAttribute('data-index', menuItems[i].index);
              menuItem.setAttribute('id', menuItems[i].id);
              menuItem.setAttribute('value', menuItems[i].id);
              menuItem.setAttribute('disabled', menuItems[i].disabled);
              if (menuItems[i].role !== 'separator') {
                const span = document.createElement('span');
                span.classList.add('cfe-more-menuitem');
                span.innerText = menuItems[i].label;
                menuItem.append(span);
              }
              menu.append(menuItem);
            }
          }

          container.append(menu);
        }

        return container;
      },

      addDebugFlagsCheckboxsetIcons: function (entries) {
        function createImageElement(params) {
          const image = document.createElement('img');
          image.classList.add('dynamic-debug-flag-icon');
          image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + params.icons.restart.iconFile + '.png');
          image.setAttribute('title', params.icons.restart.tooltip);
          return image;
        }

        if (entries.length > 0) {
          for (const entry of entries) {
            const node = document.querySelector(`#debugFlagsCheckboxset > div.oj-checkboxset-wrapper.oj-form-control-container > span > span > input[value="${entry.value}"]`);
            if (node !== null) {
              const image = createImageElement(entry);
              node.parentNode.parentNode.prepend(image);
            }
          }
        }
      },

      /** Update the field for the specified property to apply hightlighting and context menu */
      addFieldContextMenu: function (name, params) {
        if (params.valueSet) {
          // Apply the highlight class to the field when the value is set
          Unset.addHighlightClass(params.field);

          // Add the context menu to the field unless read only
          // IFF tool mode no context as unset handled differently
          if (!params.readOnly && (params.wktTool !== true)) {
            Unset.addContextMenu(name, params.field);
          }
        }
      },

      addUploadFileElements: function (params) {
        let container = document.createElement('div');
        container.classList.add('cfe-form-field');

        let image = document.createElement('img');
        image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/wdt-options-icon-clr_24x24.png');
        container.append(image);

        container.append(params.field);

        const chooseLink = document.createElement('a');
        chooseLink.setAttribute('href', '#');
        chooseLink.setAttribute('data-input', params.id);
        chooseLink.setAttribute('data-accepts', params.accepts);
        if (params.choose && params.choose.menu) {
          chooseLink.setAttribute('on-click', params.choose.menu['on-click']);
        }
        else {
          chooseLink.setAttribute('on-click', params.choose['on-click']);
        }

        image = document.createElement('img');
        image.classList.add('choose-file-icon');
        image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + params.choose.iconFile + '.png');
        image.setAttribute('title', params.choose.tooltip);

        chooseLink.append(image);
        container.append(chooseLink);

        if (params.clear) {
          const clearLink = document.createElement('a');
          clearLink.setAttribute('href', '#');
          clearLink.setAttribute('data-input', params.id);
          clearLink.setAttribute('on-click', params.clear['on-click']);

          image = document.createElement('img');
          image.setAttribute('id', `${params.id}_clearChosen`);
          image.classList.add('clear-chosen-file-icon');
          image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + params.clear.iconFile + '.png');
          image.setAttribute('title', params.clear.tooltip);
          image.style.display = 'inline-flex';

          clearLink.append(image);
          container.append(clearLink);
        }

        if (params.choose && params.choose.menu && params.choose.menu.items) {
          chooseLink.setAttribute('id', `${params.id}MenuLauncher`);
          const menu = document.createElement('oj-menu');
          menu.setAttribute('id', `${params.id}Menu`);
          menu.setAttribute('aria-labelledby', `${params.id}MenuLauncher`);
          menu.setAttribute('on-oj-action', '[[fileChooserMenuClickListener]]');
          menu.setAttribute('open-options.launcher', `${params.id}MenuLauncher`);
          menu.setAttribute('data-input', params.id);
          params.choose.menu.items.forEach((menuItem) => {
            const option = document.createElement('oj-option');
            option.setAttribute('id', menuItem.name);
            option.setAttribute('value', menuItem.name);
            const span = document.createElement('span');
            span.innerText = menuItem.label;
            option.append(span);
            menu.append(option);
          });
          container.append(menu);
        }

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
      createSingleSelect: function (pdjTypes, value, dataValues, options, field) {
        field = document.createElement('oj-select-single');
        const common = selectCommon(pdjTypes, value, dataValues, options, field);
        if (common.warning != null){
          Logger.warn('createSingleSelect() ' + common.warning);
        }
        return {dataProvider: new ArrayDataProvider(common.optionsArray, { keyAttributes: 'value' }), field: field};
      },

      /**
       * Creates an <oj-combobox-one> for either reference-dynamic-enum (defined in rdj) or options (contained in rdj)
       * @param pdjTypes
       * @param value
       * @param dataValues
       * @param options
       * @returns {{field: HTMLElement, dataProvider: *}}
       */
      createComboOne: function (pdjTypes, value, dataValues, options) {
        let field = document.createElement('oj-combobox-one');
        field.setAttribute('value', '{{[fieldSelectData_'+options['name']+']()}}');
        const common = selectCommon(pdjTypes, value, dataValues, options, field);
        if (common.warning != null){
          Logger.warn('createComboOne() ' + common.warning);
        }

        return {dataProvider: new ArrayDataProvider(common.optionsArray, { keyAttributes: 'value' }), field: field};
      },

      /**
       * Create a cfe-property-list-editor for type properties.
       * @param {name} name
       * @param {object} mapValue
       * @param {{readonly?: boolean, width?: string}} options
       * @returns HTMLElement
       */
      createPropertyListEditor: function (name, mapValue, options) {
        let field = document.createElement('cfe-property-list-editor');
        field.classList.add('cfe-property-list-editor');
        field.setAttribute('id', name);
        field.setAttribute('property-list-name', name);
        field.setAttribute('properties-string', mapValue);
        field.setAttribute('readonly', options.readonly);
        field.setAttribute('width', options.width);
        field.setAttribute('name-header-label',  i18n['cfe-property-list-editor'].labels.nameHeader);
        field.setAttribute('value-header-label',  i18n['cfe-property-list-editor'].labels.valueHeader);
        field.setAttribute('add-button-tooltip',  i18n['cfe-property-list-editor'].labels.addButtonTooltip);
        field.setAttribute('delete-button-tooltip',  i18n['cfe-property-list-editor'].labels.deleteButtonTooltip);
        return field;
      },
  
      /**
       *
       * @param {string} name
       * @param {{readonly?: boolean }} options
       * @returns HTMLElement
       */
      createPolicyEditor: function (name, options) {
        let field = document.createElement('cfe-policy-editor');
        field.classList.add('cfe-policy-editor');
        field.setAttribute('id', name);
        field.setAttribute('readonly', options.readonly);
        return field;
      },

      /**
       * Create a cfe-multi-select for type reference-dynamic-enum with array property set to true.
       * @param {object} dataValues
       * @param {name} name
       * @param {object} pdjTypes
       * @returns {{chosenItems: Array, field: HTMLElement, origChosenLabels: Array, availableItems: Array}}
       */
      createMultiSelect: function (dataValues, name, pdjTypes) {
        let optionPath, availableItems = [], chosenItems = [], origChosenLabels = [], shortName;
        // Set the chosen and available items to cfe-multi-select
        if (dataValues[name] !== null) {
          if (CoreUtils.isNotUndefinedNorNull(dataValues[name].value)) {
            let va;
            if (Array.isArray(dataValues[name].value)) {
              for (let i = 0; i < dataValues[name].value.length; i++) {
                va = dataValues[name].value[i];
                if (CoreUtils.isNotUndefinedNorNull(va.value)){
                  shortName = va.value.label;
                  chosenItems.push({ value: JSON.stringify(va), label: shortName });
                  origChosenLabels.push(shortName);
                }
                else {
                  const valueFrom = pdjTypes.getObservableValueFrom(va);
                  if (valueFrom === 'fromModelToken'){
                    shortName = va.modelToken;
                    const item = {
                      'label' : shortName,
                      'modelToken' : shortName
                    }
                    chosenItems.push({ value: JSON.stringify(item), label: shortName});
                  }
                  origChosenLabels.push(shortName);
                }
              }
            }
            else {
              va = dataValues[name].value;
              shortName = va.label;
              chosenItems.push({ value: JSON.stringify(va), label: shortName });
              origChosenLabels.push(shortName);
            }
          }

          if (CoreUtils.isNotUndefinedNorNull(dataValues[name].options)) {
            for (let i = 0; i < dataValues[name].options.length; i++) {
              const op = dataValues[name].options[i];
              if (op !== null) {
                shortName = (CoreUtils.isNotUndefinedNorNull(op.value) ? op.value.label : op.label);
                if (!origChosenLabels.includes(shortName)) {
                  availableItems.push({ value: JSON.stringify(op), label: shortName });
                }
              }
            }
          }
        }

        let field = document.createElement('cfe-multi-select');
        field.classList.add('cfe-multi-select');
        // set the properties
        field.setAttribute('id', name);
        field.setAttribute('available-header', i18n['cfe-multi-select'].labels.available);
        field.setAttribute('chosen-header', i18n['cfe-multi-select'].labels.chosen);
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
        field.classList.add('cfe-form-checkboxset');
        field.setAttribute('id', 'debugFlagsCheckboxset');
        field.setAttribute('options', '[[debugFlagItems]]');
        field.setAttribute('value', '{{debugFlagsEnabled}}');
        field.setAttribute('on-value-changed', '[[debugFlagsValueChanged]]');
        field.setAttribute('disabled', options.isReadOnly);

        return {debugFlagsEnabled: debugFlagsEnabled, dataProvider: new ArrayDataProvider(debugFlagOptions, { keyAttributes: 'value' }), field: field};
      },

      resetDebugFlagsEnabled: function (debugFlags) {
        let debugFlagsEnabled = [];
        if (typeof debugFlags !== 'undefined' && debugFlags !== null) {
          debugFlags.data.forEach((before) => {
            if (before.enabled) debugFlagsEnabled.push(before.value);
          });
        }
        return debugFlagsEnabled;
      },

      createInputPassword: function (options) {
        const field = document.createElement('oj-input-password');
        field.setAttribute('mask-icon', options.maskIcon);
        field.setAttribute('readonly', options.readonly);
        field.classList.add(options.className);
        return field;
      },

      createInputText: function (options) {
        const field = document.createElement('oj-input-text')
        field.classList.add(options['className']);
        field.setAttribute('placeholder', options['placeholder']);
        field.setAttribute('readonly', options['readonly'] || false);
        return field;
      },

      createExpandingInputText: (options) => {
        const field = document.createElement('span');
        field.classList.add(options['className']);
        field.setAttribute('role', 'textbox');
        field.setAttribute('placeholder', options['placeholder']);
        field.setAttribute('readonly', options['readonly'] || false);
        field.setAttribute('contenteditable', true);
        return field;
      },

      createReadOnlyText: function (options) {
        const field = document.createElement('oj-input-text');
        field.classList.add(options['className']);
        field.setAttribute('readonly', options['readonly'] || false);
        return field;
      },

      createSwitch: function (options) {
        const field = document.createElement('oj-switch');
        field.classList.add(options['className']);
        field.setAttribute('disabled', options['disabled'] || false);
        return field;
      },

      createLabel: function (name, pdjTypes, helpInstruction, required) {
        const label = document.createElement('oj-label');
        if (CoreUtils.isNotUndefinedNorNull(required))
          label.innerHTML = `${pdjTypes.getLabel(name)}${(required ? '*': '')}`;
        else
          label.innerHTML = `${pdjTypes.getLabel(name)}${(pdjTypes.isRequired(name) ? '*': '')}`;
        label.style.color = '#161513';
        label.setAttribute('for', name);
        label.setAttribute('slot', 'label');
        label.setAttribute('help.definition', helpInstruction);

        const detailedHelp = pdjTypes.getHelpDetailed(name);

        if (detailedHelp !== null) {
          label.setAttribute('on-click', '[[helpIconClick]]');
          label.setAttribute('data-detailed-help', detailedHelp);
        }
        return label;
      },

      createTextArea: function (options) {
        const field = document.createElement('oj-text-area');
        field.classList.add(options['className']);
        field.setAttribute('resize-behavior', options['resize-behavior']);
        field.setAttribute('placeholder', options['placeholder']);
        field.setAttribute('readonly', options['readonly'] || false);
        field.setAttribute('rows', options['rows'] || 4);
        return field;
      },

      createFileChooser: function (options) {
        const field = document.createElement('oj-input-text');
        field.classList.add(options['className']);
        field.setAttribute('readonly', options['readonly']);
        return field;
      },

      createSinglePropertyTable: function (name, value, pdjTypes) {
        const result = {};
        const field = document.createElement('oj-table');
        field.setAttribute('columns', '[[singlePropertyTableColumns]]');
        field.setAttribute('data', '[[singlePropertyTableDataProvider]]');
        let propertyTableArray = [];

        value.split(', ').forEach(function (v) {
          let ele = {};
          ele[name] = v;
          propertyTableArray.push(ele);
        });

        result['dataProvider'] = new ArrayDataProvider(propertyTableArray, { keyAttributes: name });
        result['columns'] = ko.observableArray([{ headerText: pdjTypes.getLabel(name), field: name}]);
        result['property'] = true;
        result['field'] = field;
        return result;
      },

      createHelpInstruction: function (name, pdjTypes) {
        // parse the help summary to strip html tags.
        const fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = pdjTypes.getHelpInstruction(name);
        return fakeDiv.innerText;
      },

      /**
       *
       * @param {[{name: string, label: string, menuItems: [{name: string, label: string}]}]} params
       * @returns {HTMLElement}
       * @example:
       *
       * const params = {buttons: [
       *   {
       *     name: 'policyAction',
       *     label: 'Action',
       *     buttonClickListener: 'actionButtonClicked',
       *     launchMenuListener: 'launchActionMenu',
       *     menuClickListener: 'actionMenuClickListener',
       *     menuItems: [
       *       {name: 'addCondition', label: 'Add Condition...'},
       *       {name: 'combine', label: 'Combine'},
       *       {name: 'uncombine', label: 'Uncombine'},
       *       {name: 'moveup', label: 'Move Up'},
       *       {name: 'movedown', label: 'Move Down'},
       *       {name: 'remove', label: 'Remove'},
       *       {name: 'negate', label: 'Negate'}
       *     ]
       *   }
       * ]};
       * const results['html'] = PageDefinitionFields.createMenuButtons(params);
       * console.log(results.html.innerHTML);
       * self.actionMenuButton.html({ view: HtmlUtils.stringToNodeArray(results.html.innerHTML), data: self });
       */
      createMenuButtons: function (params) {
        function createButton(action) {
          const button = {html: document.createElement('oj-menu-button')};
          button.html.setAttribute('id', action.name);
          button.html.setAttribute('chroming', 'borderless');
          button.html.innerText = action.label;
          return button;
        }

        function createMenu(action) {
          let option;
          const menu = document.createElement('oj-menu');
          menu.setAttribute('id', `${action.name}Menu`);
          menu.setAttribute('on-oj-action', `[[${action.menuClickListener}]]`);
          menu.setAttribute('slot', 'menu');
          for (const menuItem of action.menuItems) {
            option = document.createElement('oj-option');
            option.setAttribute('id', menuItem.name);
            option.setAttribute('value', menuItem.name);
            option.setAttribute('disabled', `[[${menuItem.observable}]]`);
            const span = document.createElement('span');
            span.innerText = menuItem.label;
            option.append(span);
            menu.append(option);
          }
          return menu;
        }

        const menuButtons = {html: document.createElement('p')};

        if (params.buttons.length > 0) {
          const div = document.createElement('div');
          div.setAttribute('id', 'menu-button-container');
          menuButtons.html = div;
          for (const action of params.buttons) {
            const button = createButton(action);
            const menu = createMenu(action);
            button.html.append(menu);
            menuButtons.html.append(button.html);
          }
        }

        return menuButtons.html;
      },

      createIconbars: function (params) {
        function createIcon(action, iconItem) {
          const div = document.createElement('div');
          const linkRef = document.createElement('a');
          const image = document.createElement('img');

          image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + iconItem.iconFile + '.png');

          if (iconItem.label === '---') {
            div.classList.add('toolbar-separator-vertical');
          }
          else {
            div.setAttribute('id', iconItem.name);
            div.classList.add('cfe-iconbar-icon-item');

            image.classList.add('oj-flex-item','cfe-iconbar-icon');
            image.setAttribute('id', iconItem.name);

            linkRef.setAttribute('href', '#');
            linkRef.setAttribute('title', iconItem.label);
            linkRef.setAttribute('disabled', `[[${iconItem.observable}]]`);
            linkRef.setAttribute('on-click', `[[${action.iconClickListener}]]`);
          }

          linkRef.append(image);
          div.append(linkRef);

          return div;
        }

        function createIconbar(action) {
          const div = document.createElement('div');
          div.classList.add('oj-flex','oj-sm-flex-items-initial','oj-sm-justify-content-flex-start','cfe-flex-items-pad');
          for (const iconItem of action.iconItems) {
            const icon = createIcon(action, iconItem);
            div.append(icon);
          }
          return div;
        }

        const iconbars = {html: document.createElement('p')};

        if (params.iconbars.length > 0) {
          const div = document.createElement('div');
          div.setAttribute('id', 'iconbars-container');
          div.classList.add('oj-flex-item', 'cfe-iconbar');
          iconbars.html = div;
          for (const action of params.iconbars) {
            const iconbar = createIconbar(action);
            iconbars.html.append(iconbar);
          }
        }

        return iconbars.html;
      },

      createButtonSets: function (params) {
        function createButton(action, buttonSetItem) {
          const button = {html: document.createElement('oj-button')};
          button.html.setAttribute('id', buttonSetItem.name);
          button.html.setAttribute('on-oj-action', `[[${action.buttonClickListener}]]`);
          button.html.setAttribute('chroming', 'borderless');
          button.html.setAttribute('disabled', `[[${buttonSetItem.observable}]]`);
          button.html.innerText = buttonSetItem.label;

          const image = document.createElement('img');
          image.classList.add('button-icon');
          image.setAttribute('slot', 'startIcon');
          image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + buttonSetItem.iconFile + '.png');

          const span = document.createElement('span');
          span.classList.add('button-icon');
          span.innerText = buttonSetItem.label;

          image.append(span);
          button.html.append(image);

          return button;
        }

        function createButtonMenu(buttonSetItem) {
          const div = document.createElement('div');
          div.classList.add('cfe-button-menu');

          const link = document.createElement('a');
          link.setAttribute('id', `${buttonSetItem.name}Launcher`);
          link.setAttribute('href', '#');
          link.setAttribute('data-action', buttonSetItem.name);
          link.setAttribute('data-menu-id', `${buttonSetItem.name}Menu`);
          link.setAttribute('on-click', `[[${buttonSetItem.launchMenuListener}]]`);

          const image = document.createElement('img');
          image.classList.add('button-icon');
          image.setAttribute('slot', 'startIcon');
          image.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + buttonSetItem.iconFile + '.png');

          link.append(image);

          const span = document.createElement('span');
          span.innerText = buttonSetItem.label;

          link.append(span);
          div.append(link);

          const menu = document.createElement('oj-menu');
          menu.setAttribute('id', `${buttonSetItem.name}Menu`);
          menu.setAttribute('data-action', buttonSetItem.name);
          menu.setAttribute('aria-labelledby', `${buttonSetItem.name}Launcher`);
          menu.setAttribute('on-oj-menu-action', `[[${buttonSetItem.menuClickListener}]]`);
          menu.setAttribute('open-options.launcher', `${buttonSetItem.name}Launcher`);
          if (buttonSetItem.observable) menu.setAttribute('disabled', `[[${buttonSetItem.observable}]]`);

          let option;

          for (const menuItem of buttonSetItem.menuItems) {
            option = document.createElement('oj-option');
            option.setAttribute('id', menuItem.name);
            option.setAttribute('value', menuItem.name);

            if (menuItem.label !== '---') {
              option.setAttribute('disabled', `[[${menuItem.observable}]]`);
              const span = document.createElement('span');
              span.innerText = menuItem.label;
              option.append(span);
            }

            menu.append(option);
          }

          div.append(menu);

          return div;
        }

        function createButtonSet(action) {
          const div = document.createElement('div');
          div.classList.add('oj-flex-bar-start', action.className);
          for (const buttonSetItem of action.buttonSetItems) {
            let button;
            switch (buttonSetItem.type) {
              case 'button':
                button = createButton(action, buttonSetItem);
                div.append(button.html);
                break;
              case 'buttonMenu':
                button = createButtonMenu(buttonSetItem);
                div.append(button);
                break;
            }
          }
          return div;
        }

        const buttonsets = {html: document.createElement('p')};

        if (params.buttonsets.length > 0) {
          const div = document.createElement('div');
          div.setAttribute('id', 'buttonsets-container');
          div.classList.add('oj-flex-bar');
          buttonsets.html = div;
          for (const action of params.buttonsets) {
            const buttonset = createButtonSet(action);
            buttonsets.html.append(buttonset);
          }
        }

        return buttonsets.html;
      },

      getDebugFlagItems: function (debugFlags, debugFlagsEnabled) {
        let dPayload = {};
        if (typeof debugFlags !== 'undefined' && debugFlags !== null && debugFlagsEnabled !== null) {
          debugFlags.data.forEach((before) => {
            const result = debugFlagsEnabled.find(after => after === before.value);
            if (typeof result !== 'undefined') {
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