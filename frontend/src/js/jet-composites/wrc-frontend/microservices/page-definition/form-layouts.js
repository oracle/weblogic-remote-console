/**
 * @license
 * Copyright (c) 2021, 2025 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'wrc-frontend/common/page-definition-helper',
  'wrc-frontend/core/utils',
  'ojs/ojlogger'
],
  function(
    oj,
    PageDefinitionHelper,
    CoreUtils,
    Logger
  ) {
    const i18n = {
      'tooltips': {
        'collapse': {'value': oj.Translations.getTranslatedString('wrc-common.tooltips.collapse.value')},
        'expand': {'value': oj.Translations.getTranslatedString('wrc-common.tooltips.expand.value')}
      }
    };

    function createSectionTitle(sectionId, titleText) {
      const title = document.createElement('div');
      title.classList.add('cfe-sections-form-layout-title');
      const a = document.createElement('a');
      a.setAttribute('href', '#');
      a.setAttribute('on-click', '[[sectionExpanderClickHandler]]');
      a.classList.add('cfe-sections-form-layout-title-arrow');
      const arrow = document.createElement('span');
      arrow.classList.add('oj-component-icon', 'oj-clickable-icon-nocontext', 'oj-collapsible-open-icon');
      arrow.setAttribute('title', i18n.tooltips.collapse.value);
      arrow.setAttribute('data-section-id', sectionId);
      a.append(arrow);
      const span = document.createElement('span');
      span.classList.add('cfe-sections-form-layout-title-text');
      span.innerText = titleText;
      title.append(a);
      title.append(span);
      return title;
    }

    /**
     *
     * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean}} options
     * @param pdjTypes
     * @param rdjData
     * @param sections
     * @param populateCallback
     * @returns {HTMLElement}
     * @private
     */
    function getSectionsFormLayout(options, pdjTypes, rdjData, sections, populateCallback) {
      // Upsert the values of the "name", "direction"
      // and "isReadOnly" properties, in the options
      // parameter.
      options['name'] = options['name'] || 'wlsform';
      options['direction'] = 'row';

      // Create the outer-most <pj-form-layout> that
      // will be the function's return value.
      const rootFormLayout = createRawFormLayout(options);

      // Loop through the sections in the PDJ
      sections.forEach((section, index) => {
        // If the section doesn't have a properties
        // property, just skip over it.
        if (CoreUtils.isNotUndefinedNorNull(section.properties)) {
          // Sections don't currently have anything that
          // specifies how many columns to have, or whether
          // the property orientation needs to be "across,
          // then down" or "down, up, down". This being the
          // case, we'll just use a slightly modified version
          // of the passed in options for every section.
          options['name'] = `wlsform-section-${index}`;
          options['className'] = 'cfe-sections-form-layout';
          options['maxColumns'] = '2';
          // Create nested formLayout for the section
          const formLayout = createRawFormLayout(options);
          if (CoreUtils.isNotUndefinedNorNull(section.title)) {
            // Section has a title, so add one as the first
            // DOM element in the formLayout.
            const title = createSectionTitle(options['name'], section.title);
            rootFormLayout.append(title);
          }
          // Call the populateCallback function to populate
          // the formLayout.
          populateCallback(section.properties, formLayout, pdjTypes, rdjData.data, options.isSingleColumn, options.isReadOnly);
          // Append the populated formLayout to the
          // outer-most formLayout, which is the return
          // value for the function.
          rootFormLayout.append(formLayout);
        }
      });
      return rootFormLayout;
    }

    /**
     *
     * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean}} options
     * @returns {HTMLElement}
     * @private
     */
    function createRawFormLayout(options) {
      const formLayout = document.createElement('oj-form-layout');

      if (CoreUtils.isNotUndefinedNorNull(options.fullWidth)) {
        formLayout.className = 'oj-formlayout-full-width';
      }

      if (CoreUtils.isNotUndefinedNorNull(options.name)) {
        formLayout.setAttribute('id', options.name);
      }

      if (CoreUtils.isNotUndefinedNorNull(options.className)) {
        formLayout.classList.add(options.className);
      }

      formLayout.setAttribute('label-edge', 'start');
      formLayout.setAttribute('label-width', options.labelWidthPcnt);
      formLayout.setAttribute('max-columns', options.maxColumns);
      formLayout.setAttribute('direction', options.direction);

      return formLayout;
    }

    /**
     *
     * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean}} options
     * @returns {HTMLElement}
     */
    function createFormLayout(options) {
      options.name = options.name || 'wlsform';
      options.direction = options.direction || 'row';
      options.labelEdge = options.labelEdge || 'start';
      options.wrapColSpan = options.wrapColSpan || true;
      options.isReadOnly = options.isReadOnly || false;

      const formLayout = document.createElement('oj-form-layout');

      formLayout.setAttribute('id', options.name);
      formLayout.setAttribute('label-edge', options.labelEdge);
      formLayout.setAttribute('label-width', options.labelWidthPcnt);
      formLayout.setAttribute('max-columns', options.maxColumns);
      formLayout.setAttribute('direction', options.direction);

      if (CoreUtils.isNotUndefinedNorNull(options.fullWidth)) {
        formLayout.classList.add('oj-formlayout-full-width');
      }

      if (options.wrapColSpan) {
        formLayout.setAttribute('colspan-wrap', 'wrap');
      }

      return formLayout;
    }

    function debugFlagsSliceCheck(properties) {
      const filteredProperties = properties.filter(property => property.type === 'boolean');
      return (filteredProperties.length === properties.length);
    }

    function handleSectionExpanderEvent(node) {
      const attr = node.attributes['data-section-id'];
      if (CoreUtils.isNotUndefinedNorNull(attr)) {
        const sectionId = attr.value;
        if (CoreUtils.isNotUndefinedNorNull(sectionId)) {
          const parentNode = document.getElementById(sectionId).parentNode;
          if (node.classList.contains('oj-collapsible-close-icon')) {
            node.classList.remove('oj-collapsible-close-icon');
            node.classList.add('oj-collapsible-open-icon');
            node.setAttribute('title', i18n.tooltips.collapse.value);
            parentNode.style.display = 'inline-block';
          }
          else {
            node.classList.remove('oj-collapsible-open-icon');
            node.classList.add('oj-collapsible-close-icon');
            node.setAttribute('title', i18n.tooltips.expand.value);
            parentNode.style.display = 'none';
          }
        }
      }
    }
    
    //public:
    return {
      /**
       * Custom error used to indicate that a ``pdjData.sliceForm.sections`` property was not present
       * @param {string} message - The error message
       * @param {object} [extra] - Optional data to associate with the error
       * @constructor
       * @extends Error
       * @type {{message: string, [extra]: object}}
       */
      SectionsPropertyNotFoundError: function SectionsPropertyNotFoundError(
        message,
        extra
      ) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
        if (extra) this.extra = extra;
      },
      /**
       * Determines if ``pdjData`` has a ``sliceForm.sections`` array, or not
       * @param {object} pdjData - The PDJ data for the form slice
       * @returns {boolean}
       */
      hasFormLayoutSections: function(pdjData) {
        let rtnval = this.hasCreateFormLayoutSections(pdjData);
        if (!rtnval) rtnval = this.hasSliceFormLayoutSections(pdjData);
        return rtnval;
      },
      hasCreateFormLayoutSections: function(pdjData) {
        return PageDefinitionHelper.hasCreateFormSections(pdjData);
      },
      hasSliceFormLayoutSections: function(pdjData) {
        return PageDefinitionHelper.hasSliceFormSections(pdjData);
      },
      /**
       * Determines if the value of ``key` is a property of ``pdjData.sliceForm.presentation`` or not.
       * @param {object} pdjData - The PDJ data for the form slice
       * @param {string} key - Search key
       * @returns {boolean}
       */
      hasFormLayoutType: function (pdjData, key) {
        let rtnval = false;
        if (CoreUtils.isNotUndefinedNorNull(pdjData.actionInputForm)) {
          if(key === 'singleColumn') rtnval = true;
        }
        else if (
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.presentation)
        ) {
          const presentation = pdjData.sliceForm.presentation;
          if (CoreUtils.isNotUndefinedNorNull(presentation[key])) {
            const result = presentation[key];
            rtnval = typeof result === 'boolean';
          }
        } else if (
          CoreUtils.isNotUndefinedNorNull(pdjData.createForm) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.createForm.presentation)
        ) {
          const presentation = pdjData.createForm.presentation;
          rtnval = presentation[key];
        }
        return rtnval;
      },
      /**
       * Returns a ``<oj-form-layout>`` tag for a "single column, checkboxes only" form, which has been configured using the values in ``options``.
       * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean}} options
       * @returns {HTMLElement}
       */
      createCheckBoxesFormLayout: function (options) {
        return createFormLayout(options);
      },
      /**
       * Returns a ``<oj-form-layout>`` tag for a "single column" form, which has been configured using the values in ``options``.
       * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean, fullWidth?: boolean}} options
       * @returns {HTMLElement}
       */
      createSingleColumnFormLayout: function (options) {
        return createFormLayout(options);
      },
      /**
       * Returns a ``<oj-form-layout>`` tag for a "two column" form, which has been configured using the values in ``options``.
       * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean, fullWidth?: boolean}} options
       * @returns {HTMLElement}
       */
      createTwoColumnFormLayout: function (options) {
        return createFormLayout(options);
      },
      /**
       * Returns a ``<oj-form-layout>`` tag for a "wizard" form, which has been configured using the values in ``options``.
       * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean}} options
       * @returns {HTMLElement}
       */
      createWizardFormLayout: function (options) {
        return createFormLayout(options);
      },
      /**
       * Returns a ``<oj-form-layout>`` tag that has nested ``<oj-form-layout>`` tags for each section item in the ``pdjData.sliceForm.sections`` array.
       * @param {{name: string, labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean}} options
       * @param {object} pdjTypes - A ``pdjTypes`` instance for the properties in the ``pdjData`` parameter
       * @param {object} rdjData - The RDJ data for the form slice
       * @param {object} pdjData - The PDJ data for the form slice
       * @param {function} populateCallback - Callback function that will populate the fields in the nested ``<oj-form-layout>`` tags
       * @returns {HTMLElement}
       */
      createSectionedFormLayout: function (
        options,
        pdjTypes,
        rdjData,
        pdjData,
        populateCallback
      ) {
        if (!this.hasFormLayoutSections(pdjData)) {
          // The consumer didn't call the public
          // this.hasFormLayoutSections() function before
          // calling this method, or they ignored the return
          // value. We need the pdjData.sliceForm.sections
          // property to be defined, so throw an Error.
          throw new this.SectionsPropertyNotFoundError(
            'pdjData object did not contain a \'sections\' property.'
          );
        }
        const sections = (options.isEditing ? pdjData.sliceForm.sections : pdjData.createForm.sections);

        return getSectionsFormLayout(
          options,
          pdjTypes,
          rdjData,
          sections,
          populateCallback
        );
      },

      /**
       * Returns a ``<oj-table>`` tag for a slice table on the form
       * @params {{onMenuAction: string, onBeforeOpen: string, menuItem: {id: string, iconFile: string, label: string}}} params
       * @returns {HTMLElement}
       */
      createSliceTableFormLayout: function (params) {
        function createCellTemplate() {
          const span = document.createElement('span');
          span.setAttribute('data-bind', 'html: cell.data.label');
    
          const cellTemplate = document.createElement('template');
          cellTemplate.setAttribute('slot', 'cellTemplate');
          cellTemplate.setAttribute('data-oj-as', 'cell');
    
          cellTemplate.content.appendChild(span);
    
          return cellTemplate;
        }
  
        function createHRefCellTemplate() {
          const bindIf1 = document.createElement('oj-bind-if');
          bindIf1.setAttribute('test', '[[typeof cell.data.tag !== "undefined"]]');

          const link = document.createElement('a');
          link.classList.add('cfe-table-cell-href');
          link.setAttribute('href', '#');
          link.setAttribute('data-column-name', '[[cell.data.name]]');
          link.setAttribute('data-column-type', '[[cell.data.type]]');
          link.setAttribute('on-click', '[[cell.data.listener]]');
    
          const span1 = document.createElement('span');
          span1.setAttribute('data-bind', 'html: cell.data.label');
    
          link.append(span1);
          bindIf1.append(link);
  
          const bindIf2 = document.createElement('oj-bind-if');
          bindIf2.setAttribute('test', '[[typeof cell.data.tag === "undefined"]]');

          const span2 = document.createElement('span');
          span2.setAttribute('data-bind', 'html: cell.data.label');
  
          bindIf2.append(span2);
          
          const hrefCellTemplate = document.createElement('template');
          hrefCellTemplate.setAttribute('slot', 'hrefCellTemplate');
          hrefCellTemplate.setAttribute('data-oj-as', 'cell');
    
          hrefCellTemplate.content.appendChild(bindIf1);
          hrefCellTemplate.content.appendChild(bindIf2);
    
          return hrefCellTemplate;
        }
  
        function createNoDataTemplate() {
          const noDataTemplate = document.createElement('template');
          noDataTemplate.setAttribute('slot', 'noData');

          const div = document.createElement('div');
          div.setAttribute('data-bind', 'text: i18n.labels.noData.value');

          noDataTemplate.content.appendChild(div);

          return noDataTemplate
        }

        const table = document.createElement('oj-table');
  
        const cellTemplate = createCellTemplate();
        table.appendChild(cellTemplate);
  
        const hrefCellTemplate = createHRefCellTemplate();
        table.appendChild(hrefCellTemplate);
  
        const noDataTemplate = createNoDataTemplate();
        table.appendChild(noDataTemplate);

        const contextMenu = document.createElement('oj-menu');
        contextMenu.setAttribute('slot', 'contextMenu');
        contextMenu.setAttribute('on-oj-menu-action', params.onMenuAction);
        contextMenu.setAttribute('on-oj-before-open', params.onBeforeOpen);
        contextMenu.setAttribute('aria-label', 'Copy to Clipboard Context Menu');

        for (const menuItem of params.menuItems) {
          const option = document.createElement('oj-option');
          option.setAttribute('id', menuItem.id);
          option.setAttribute('value', menuItem.id);
          const img = document.createElement('img');
          img.className = 'option-icon';
          img.setAttribute('src', `js/jet-composites/wrc-frontend/1.0.0/images/${menuItem.iconFile}.png`);
          img.setAttribute('alt', menuItem.label);
          option.append(img);
          const span = document.createElement('span');
          span.innerText = menuItem.label;
          option.append(span);
          contextMenu.append(option);
        }

        table.appendChild(contextMenu);

        return table;
      },
      /**
       *
       * @param {HTMLElement} event
       */
      handleSectionExpanderClicked: function (event) {
        let attr = event.target.attributes['data-section-id'];
        if (CoreUtils.isNotUndefinedNorNull(attr)) {
          handleSectionExpanderEvent(event.target);
        }
        else {
          attr = event.target.firstElementChild.attributes['data-section-id'];
          if (CoreUtils.isNotUndefinedNorNull(attr)) {
            handleSectionExpanderEvent(event.target.firstElementChild);
          }
        }
      }
    };
  }
);