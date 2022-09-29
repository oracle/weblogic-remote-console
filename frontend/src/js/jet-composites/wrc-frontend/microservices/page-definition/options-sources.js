/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/integration/controller', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/data-management/cbe-data-storage', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', './utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/cbe-types', 'ojs/ojlogger'],
  function (oj, ko, ModuleElementUtils, Controller, Runtime, CbeDataStorage, DataOperations, MessageDisplaying, PageDefinitionUtils, CoreUtils, CbeTypes, Logger) {

    const i18n = {
      menus: {
        more: {
          optionsSources: {
            view: {
              disabled: ko.observable(false), visible: ko.observable(true),
              label: ko.observable(oj.Translations.getTranslatedString('wrc-pdj-options-sources.menus.more.optionsSources.view.label', '{0}'))
            },
            create: {
              disabled: ko.observable(false), visible: ko.observable(true),
              label: ko.observable(oj.Translations.getTranslatedString('wrc-pdj-options-sources.menus.more.optionsSources.create.label', '{0}'))
            },
            edit: {
              disabled: ko.observable(false), visible: ko.observable(true),
              label: ko.observable(oj.Translations.getTranslatedString('wrc-pdj-options-sources.menus.more.optionsSources.edit.label', '{0}'))
            }
          }
        }
      }
    };

    /**
     * No-arg constructor
     */
    function PageDefinitionOptionsSources() {
    }

    function getPropertyName(event) {
      // Get the more menu id based on the property name in the event.
      return event.currentTarget.id.substring('moreIcon_'.length);
    }

    /**
     * Simulates adding, updating and removing kebab's menu items, using ``menuItems``.
     * <p>The term <i>simulate</i> is used, because you cannot actually remove &lt;oj-option> elements from a &lt;oj-menu> that has been displayed. You can only <i>replace the attributes</i> of the &lt;oj-option>, which is what we use <code>menuItems</code> for. <code>menuItems</code> is an array of JS objects, each of which has the following properties:</p>
     * <ul>
     *   <li>classes - Array of CSS classes that need to be assigned to the <code>oj-option</code> element.</li>
     *   <li>role - Role attribute that JET uses for the menu item.</li>
     *   <li>index - Array index of the associated <code>optionsSource</code> object.</li>
     *   <li>id - Unique identifier for the menu item.</li>
     *   <li>value - Value for the menu item.</li>
     *   <li>disabled - Boolean stating if menu item is disabled (true) or not (false).</li>
     *   <li>visible - Boolean stating if menu item is visible (true) or not (false).</li>
     *   <li>label - Label for the menu item.</li>
     * </ul>
     * @param {HTMLElement} moreMenu
     * @param {{classes: string[], role: string, index: Number, id: string, value: string, disabled: boolean, visible: boolean, label: string}[]} menuItems
     */
    function upsertMoreMenuItems(moreMenu, menuItems) {
      const childNodes = moreMenu.childNodes;

      for (let i = 0, j = 0; i < childNodes.length; i++, j++) {
        if (!menuItems[j].visible) j++;
        if (j < menuItems.length) {
          childNodes[i].classList.add(...menuItems[j].classes);
          childNodes[i].setAttribute('role', menuItems[j].role);
          childNodes[i].setAttribute('data-index', menuItems[j].index);
          childNodes[i].setAttribute('id', menuItems[j].id);
          childNodes[i].setAttribute('value', menuItems[j].id);
          childNodes[i].setAttribute('disabled', menuItems[j].disabled);
          childNodes[i].innerText = menuItems[j].label;
        }
        else {
          childNodes[i].innerText = null;
        }
      }
    }

    /**
     * Returns a JS object containing data associated with the chosen kebab menu item.
     * <p>This data include things like:</p>
     * <ul>
     *   <li>path - Array index of the associated <code>optionsSource</code> object.</li>
     *   <li>action - String literal of one of the following: "view", "create" and "edit"</li>
     *   <li>perspectiveId - String identifier for perspective associated with the chosen kebab menu item.</li>
     *   <li>property - JS object with properties for the name and label, of the property associated with the chosen kebab menu item.</li>
     * </ul>
     * @param {object} event
     * @param {object} rdjData
     * @returns {{name: string,path: string|null, action: string|null, property?: {name: string, label: string}}}
     */
    function getOptionsSourceConfig(event, rdjData) {
      function isOptionsSourcesProperty(propertyName, rdjData) {
        return (CoreUtils.isNotUndefinedNorNull(rdjData.data))
          && (CoreUtils.isNotUndefinedNorNull(rdjData.data[propertyName]))
          && (CoreUtils.isNotUndefinedNorNull(rdjData.data[propertyName].optionsSources));
      }

      const propertyName = getPropertyName(event);
      const optionsSourceConfig = {name: propertyName, path: null, action: null};

      if (isOptionsSourcesProperty(propertyName, rdjData)) {
        const index = Number(event.target.attributes['data-index'].value);
        const optionsSource = rdjData.data[propertyName].optionsSources[index];
        // Using workaround code here, because we need to wait
        // until after the CBE refactor to get the data that
        // the CFE needs here.
        const idParts = event.target.value.split('_');
        // idParts will contain 4 array items:
        // [0] = "moreMenuItem"
        // [1] = "view", "create" or "edit"
        // [2] = type name
        switch (idParts[1]) {
          case 'view':
            optionsSourceConfig['perspectiveId'] = event.currentTarget.attributes['data-perspective-id'].value;
            optionsSourceConfig['path'] = optionsSource.resourceData;
            optionsSourceConfig['action'] = 'view';
            break;
          case 'create':
            optionsSourceConfig['perspectiveId'] = event.currentTarget.attributes['data-perspective-id'].value;
            optionsSourceConfig['path'] = optionsSource.resourceData;
            optionsSourceConfig['property'] = {name: propertyName, label: PageDefinitionUtils.displayNameFromIdentity(optionsSource)};
            optionsSourceConfig['action'] = 'create';
            break;
          case 'edit':
            optionsSourceConfig['perspectiveId'] = event.currentTarget.attributes['data-perspective-id'].value;
            optionsSourceConfig['path'] = optionsSource.resourceData;
            optionsSourceConfig['action'] = 'edit';
            break;
        }
      }
      return optionsSourceConfig;
    }

    /**
     * Returns an array of parameters/attributes for the kebab's menu items
     * @param {string} propertyName - The name of the MBean property the kebab menu is for.
     * @param {{kind: string, perspective: string, path: Array}[]|""} propertyValue - Either an ``identity`` object or an empty string. For the former, it's rdjData.data[propertyName].value
     * @param {{kind: string, perspective: string, path: Array}[]} optionsSources
     * @returns {{menuItems: {index: Number, classes: string[], id: string, label: string, disabled: boolean, visible: boolean}[]}} - An array of parameters/attributes for the kebab's menu items
     */
    function createMoreMenuParams(propertyName, propertyValue, optionsSources) {
      function addBeforeAfterDividerClasses() {
        const index = params.menuItems.map(menuItem => menuItem.label).indexOf('---');
        if (index !== -1) {
          params.menuItems[index - (params.menuItems[index - 1].visible ? 1 : 2)].classes.push('oj-menu-item-before-divider');
          params.menuItems[index + 1].classes.push('oj-menu-item-after-divider');
        }
      }

      const params = {menuItems: []};

      // First, we need to know the type associated with
      // rdjData.data[propertyName].value. We can call
      // PageDefinitionUtils.typeNameFromIdentity() to
      // get that. An empty string will be returned.
      const propertyValueType = PageDefinitionUtils.propertyValueTypeFromIdentity(propertyValue);

      for (let i = 0; i < optionsSources.length; i++) {
        const typeName = PageDefinitionUtils.typeNameFromIdentity(optionsSources[i]);
        const typeLabel = PageDefinitionUtils.typeLabelFromIdentity(optionsSources[i]);
        const propertyLabel = PageDefinitionUtils.propertyLabelFromIdentity(optionsSources[i]);
        if (i !== 0) {
          // We need a menu item separator here, so create a
          // menu item that will cause the addFieldIcons()
          // method in the PageDefinitionFields, to generate
          // one.
          params.menuItems.push({
            index: i,
            role: 'separator',
            classes: ['oj-complete', 'oj-menu-divider'],
            id: `moreMenuItem_separator_${i}`,
            label: '',
            disabled: false,
            visible: true
          });
        }
        params.menuItems.push({
          index: i,
          role: 'presentation',
          classes: ['oj-complete', 'oj-menu-item'],
          id: `moreMenuItem_view_${typeName}`,
          label: i18n.menus.more.optionsSources.view.label().replace('{0}', propertyLabel),
          disabled: i18n.menus.more.optionsSources.view.disabled(),
          visible: i18n.menus.more.optionsSources.view.visible()
        });

        // At this point, the create option is added except if the type is a JDBC data source.
        // Once the overlay supports the wizard form, this restriction should be removed.
        if (typeName !== 'JDBCSystemResource') {
          params.menuItems.push({
            index: i,
            role: 'presentation',
            classes: ['oj-complete', 'oj-menu-item'],
            id: `moreMenuItem_create_${typeName}`,
            label: i18n.menus.more.optionsSources.create.label().replace('{0}', typeLabel),
            disabled: i18n.menus.more.optionsSources.create.disabled(),
            visible: i18n.menus.more.optionsSources.create.visible()
          });
        }

        const identityKey = PageDefinitionUtils.getNameFromCollectionChild(propertyValue);
        i18n.menus.more.optionsSources.edit.visible(typeName === propertyValueType);

        params.menuItems.push({
          index: i,
          role: 'presentation',
          classes: ['oj-complete', 'oj-menu-item'],
          id: `moreMenuItem_edit_${typeName}`,
          label: i18n.menus.more.optionsSources.edit.label().replace('{0}', identityKey),
          disabled: i18n.menus.more.optionsSources.edit.disabled(),
          visible: i18n.menus.more.optionsSources.edit.visible()
        });
      }

      addBeforeAfterDividerClasses();

      return params;
    }

    /**
     * Recreates the parameters/attributes for the kebab's menu items, using the value of ``newPropertyValue``.
     * @param {string} propertyName - The name of the MBean property the kebab menu is for
     * @param {{kind: string, perspective: string, path: Array}[]|""} newPropertyValue - Either an ``identity`` object or an empty string. For the former, it's typically one of the legal values from the dropdown, associated with the kebab menu.
     */
    function recreateMoreMenuParams(propertyName, newPropertyValue) {
      const menuId = `moreMenu_${propertyName}`;
      const moreMenu = document.getElementById(menuId);
      if (CoreUtils.isNotUndefinedNorNull(moreMenu)) {
        moreMenu.setAttribute('data-property-value', JSON.stringify(newPropertyValue));
        const optionsSources = JSON.parse(moreMenu.attributes['data-options-sources'].value);
        const params = createMoreMenuParams(propertyName, newPropertyValue, optionsSources);

        upsertMoreMenuItems(moreMenu, params.menuItems);
      }
    }


  //public:
    PageDefinitionOptionsSources.prototype = {
      /**
       * Displays the kebab popup menu.
       * @param {HTMLElement} event - The event associated with the mouse click on the kebab icon
       */
      showMoreMenuItems: (event) => {
        const propertyName = getPropertyName(event);
        const menuId = `moreMenu_${propertyName}`;
        const moreMenu = document.getElementById(menuId);
        // Open the popup associated with the kebab menu.
        moreMenu.open(event);
        const childNodes = moreMenu.childNodes;
        const lastChild = childNodes[childNodes.length - 1];
        lastChild.classList.remove('oj-menu-divider');
      },

      /**
       * Callback function for when the value of the ``propertyName`` field changes.
       * <p>Will get called when the user selects a different legal value from the dropdown, which is associated with the kebab menu.</p>
       * @param {string} propertyName - The name of the MBean property the kebab menu is for.
       * @param {{kind: string, perspective: string, path: Array}|""} newPropertyValue - Either an ``identity`` object or an empty string.
       */
      propertyValueChanged: (propertyName, newPropertyValue) => {
        if (CoreUtils.isNotUndefinedNorNull(newPropertyValue) || newPropertyValue === '') {
          recreateMoreMenuParams(propertyName, newPropertyValue);
        }
      },

      /**
       * Handle the selected kebab menu item.
       * <p>A configuration object is created during the handling of this kebab menu item. This configuration becomes the return value for the function.</p>
       * @param {HTMLElement} event - The event associated with the chosen kebab menu item
       * @param {*} rdjData - RDJ data returned from the CBE
       * @param {*} viewParams - Parameters used when creating the FormViewModel instance.
       * @param {function} canExitCallback
       * @returns {{name: string,path: string|null, action: string|null, breadcrumbs?: string, property?: {name: string, label: string}}}
       */
      handleMenuItemSelected: (event, rdjData, viewParams, canExitCallback) => {
        const optionsSourceConfig = getOptionsSourceConfig(event, rdjData);
        PageDefinitionUtils.setPlacementRouterParameter(viewParams.parentRouter, 'detached');

        switch (optionsSourceConfig.action) {
          case 'view':
            canExitCallback('exit')
              .then(reply => {
                if (reply) {
                  viewParams.parentRouter.go(`/${viewParams.perspective.id}/${encodeURIComponent(optionsSourceConfig.path)}`)
                    .then(result => {
                      PageDefinitionUtils.setPlacementRouterParameter(viewParams.parentRouter, 'embedded');
                      if (CoreUtils.isNotUndefinedNorNull(result) && CoreUtils.isNotUndefinedNorNull(result.hasChanged) && result.hasChanged) {
                        // router.go() was successful, so dispatch signals
                        // regarding the navtree state.
                        viewParams.signaling.navtreeSelectionCleared.dispatch();
                        viewParams.signaling.navtreeUpdated.dispatch({path: optionsSourceConfig.path});
                      }
                    });
                }
              });
            break;
          case 'edit': {
            const menuId = `moreMenu_${optionsSourceConfig.name}`;
            const moreMenu = document.getElementById(menuId);
            const propertyValue = JSON.parse(moreMenu.attributes['data-property-value'].value);
            if (propertyValue !== '') {
              optionsSourceConfig['path'] = propertyValue.resourceData;
            }
            canExitCallback('exit')
              .then(reply => {
                if (reply) {
                  viewParams.parentRouter.go(`/${viewParams.perspective.id}/${encodeURIComponent(optionsSourceConfig.path)}`)
                    .then(result => {
                      if (CoreUtils.isNotUndefinedNorNull(result) && CoreUtils.isNotUndefinedNorNull(result.hasChanged) && result.hasChanged) {
                        // router.go() was successful, so dispatch signals
                        // regarding the navtree state.
                        viewParams.signaling.navtreeSelectionCleared.dispatch();
                        viewParams.signaling.navtreeUpdated.dispatch({path: optionsSourceConfig.path});
                      }
                    });
                }
              });
            break;
          }
          case 'create':
            optionsSourceConfig['breadcrumbs'] = optionsSourceConfig.path;
            break;
        }
        return optionsSourceConfig;
      },

      /**
       * Returns a JS object containing the parameters/attributes for building the kebab menu and menu items.
       * @param {string} propertyName - The name of the MBean property the kebab menu is for.
       * @param {string} propertyLabel - The label of the MBean property the kebab menu is for.
       * @param {object} propertyData - The rdjData for ``propertyName``, which is where the optionsSources data is located.
       * @param {string} perspectiveId - The id of the ``perspective``
       * @param {boolean} disabled
       * @returns {{buttonId: string, menuId: string, propertyLabel: string, optionsSources: object, menuItems: {index: Number, classes: string[], id: string, label: string, disabled: boolean, visible: boolean}[]}} - JS object containing the parameters/attributes for building the kebab menu and menu items.
       */
      getMoreMenuParams: (propertyName, propertyLabel, propertyData, perspectiveId, disabled) => {
        // Convert null propertyValue to empty string
        const propertyValue = propertyData.value || '';
        return {
          disabled: disabled,
          buttonId: `moreIcon_${propertyName}`,
          menuId: `moreMenu_${propertyName}`,
          propertyLabel: propertyLabel,
          propertyValue: JSON.stringify(propertyValue),
          perspectiveId: perspectiveId,
          optionsSources: JSON.stringify(propertyData.optionsSources),
          menuItems: createMoreMenuParams(propertyName, propertyValue, propertyData.optionsSources).menuItems
        };
      },

      /**
       * Create moduleConfig object for an overlay-dialog V-VM
       * @param {*} viewParams - Parameters used when creating the FormViewModel instance.
       * @param {{name: string,path: string|null, action: string|null, breadcrumbs: string, property?: {name: string, label: string}}} optionsSourceConfig
       * @param {function} updateShoppingCartCallback?
       * @param {function} refreshFormCallback?
       * @returns {Promise<T | {rules} | never>}
       */
      createOverlayFormDialogModuleConfig: (viewParams, optionsSourceConfig, updateShoppingCartCallback, refreshFormCallback, saveContentCallback) => {
        const uri = `${optionsSourceConfig.path}?dataAction=new`;
        return DataOperations.mbean.new(uri)
          .then(reply => {
            let childRouter = viewParams.parentRouter.getChildRouter('form');
            if (CoreUtils.isNotUndefinedNorNull(childRouter)) childRouter.dispose();
            childRouter = viewParams.parentRouter.createChildRouter('form');
            childRouter.data = {
              pageTitle: ko.observable(reply.body.data.get('pageTitle')),
              rdjUrl: ko.observable(reply.body.data.get('rdjUrl')),
              rdjData: ko.observable(reply.body.data.get('rdjData')),
              pdjUrl: ko.observable(reply.body.data.get('pdjUrl')),
              pdjData: ko.observable(reply.body.data.get('pdjData')),
              rawPath: ko.observable(optionsSourceConfig.path)
            };
            return ModuleElementUtils.createConfig({
              viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/overlay-form-dialog.html`,
              viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/overlay-form-dialog`,
              params: {
                parentRouter: childRouter,
                signaling: viewParams.signaling,
                perspective: viewParams.perspective,
                beanTree: viewParams.beanTree,
                title: PageDefinitionUtils.filterPathSegments(optionsSourceConfig.breadcrumbs, 'data').join('/'),
                property: optionsSourceConfig.property,
                onSaveSuceeded: updateShoppingCartCallback,
                onFormRefresh: refreshFormCallback,
                onSaveContent: saveContentCallback
              }
            });
          });
      }

    };

    // Return PageDefinitionOptionsSources constructor function
    return PageDefinitionOptionsSources;
  }
);
