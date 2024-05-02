/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * @typedef NthChild
 * @type {{name: string, row: number, col: number, [minHeight]: string}}
 */
define(['wrc-frontend/microservices/perspective/perspective-manager'],
  function(PerspectiveManager){
    function PerspectiveMemory(perspectiveId){
      this.perspective = PerspectiveManager.getById(perspectiveId);
      this.beanPathHistory = {
        items: [],
        visibility: false
      };
      this.breadcrumbs = {
        items: [],
        visibility: false,
        navigator: {
          visibility: false,
          position: 0,
          icons: {
            previous: {state: 'disabled'},
            next: {state: 'disabled'}
          }
        }
      };
      this.help = {
        visibility: false
      };
      this.instructions = {
        visibility: true
      };
      this.landingPage = {
        expandableName: null
      };
      this.contentPage = {
        path: null,
        resourceDataFragment: null,
        slices: [],
        syncInterval: null,
        nthChildren: [],
        switches: {
          addToArchive: []
        }
      };
      this.navtree = {
        keySet: null,
        width: '300px'
      };
      this.tabstrip = {
        tab: {
          'shoppingcart': {cachedState: {}},
          'provider-management': {cachedState: {}},
          'tips': {cachedState: {}},
          'ataglance': {cachedState: {}}
        }
      };
      this.wizard = {usedIf: {}};
    }

    function getNthChildrenIndex(name) {
      return this.contentPage.nthChildren.map(nthChild => nthChild.name).indexOf(name);
    }

    /**
     *
     * @param {string} key
     * @param {string} fieldName
     * @returns {{hasKey: boolean, hasFieldName: boolean, index?: number}}
     * @private
     */
    function hasAddToArchiveSwitchValue(key, fieldName) {
      // Declare return variable, using false as the
      // default values for the hasKey and hasFieldName
      // properties
      let result = {hasKey: false, hasFieldName: false};
      // Check to see if values assigned to the key
      // and fieldName parameters, are not undefined
      // or null.
      if ((typeof key !== 'undefined' && key !== null) &&
        (typeof fieldName !== 'undefined' && fieldName !== null)
      ) {
        // They aren't, so use built-in map function
        // to look for index of JS object in addToArchive
        // array, with a name that matches key.
        const index = this.contentPage.switches.addToArchive.findIndex(item => item.name === key);
        if (index !== -1) {
          // Found one, so figure out the fieldName
          // for switch value we're working with.
          if (fieldName.startsWith('Source')) fieldName = 'SourcePath';
          if (fieldName.startsWith('Plan')) fieldName = 'PlanPath';
          // Use index to declare const variable for
          // JS object found in addToArchive array.
          const data = this.contentPage.switches.addToArchive[index];
          // Update hasKey JS property in return
          // variable for this function.
          result.hasKey =  true;
          // Update hasFieldName JS property in
          // return variable for this function.
          result.hasFieldName = (typeof data[fieldName] !== 'undefined');
          // Add index JS object to return variable
          // for this function.
          result['index'] = index;
        }
      }
      return result;
    }

    PerspectiveMemory.prototype = {
      perspective: function () {
        return this.perspective;
      },
      history: function () {
        return this.beanPathHistory.items;
      },
      setHistory: function (items) {
        return this.beanPathHistory.items = items;
      },
      setHistoryVisibility: function (visible) {
        this.beanPathHistory.visibility = visible;
      },
      historyVisibility: function () {
        return this.beanPathHistory.visibility;
      },
      breadcrumbs: function () {
        return this.breadcrumbs.items;
      },
      setBreadcrumbs: function (items) {
        return this.breadcrumbs.items = items;
      },
      setBreadcrumbsVisibility: function (visible) {
        this.breadcrumbs.visibility = visible;
      },
      breadcrumbsVisibility: function () {
        return this.breadcrumbs.visibility;
      },
      setHelpVisibility: function (visible) {
        this.help.visibility = visible;
      },
      helpVisibility: function () {
        return this.help.visibility;
      },
      setInstructionsVisibility: function (visible) {
        this.instructions.visibility = visible;
      },
      instructionsVisibility: function () {
        return this.instructions.visibility;
      },
      /**
       *
       * @param {string} value
       */
      setExpandableName: function (value) {
        this.landingPage.expandableName = value;
      },
      /**
       *
       * @returns {PerspectiveMemory.expandableName|(function())|null}
       */
      expandableName: function () {
        return this.landingPage.expandableName;
      },
      /**
       *
       * @param keySet
       */
      setExpandedKeySet: function (keySet) {
        this.navtree.keySet = keySet;
      },
      /**
       *
       * @returns {null|*}
       */
      expandedKeySet: function () {
        return this.navtree.keySet;
      },
      /**
       *
       * @param path
       */
      setContentPath: function (path) {
        this.contentPage.path = path;
      },
      /**
       *
       * @returns {*}
       */
      contentPath: function () {
        return this.contentPage.path;
      },
      /**
       *
       * @param slices
       */
      setContentSlice: function (slices) {
        this.contentPage.slices = slices;
      },
      /**
       *
       * @returns {Array|*}
       */
      contentSlice: function () {
        return this.contentPage.slices;
      },
      /**
       *
       * @param {NthChild} nthChild
       */
      upsertNthChildrenItem: function (nthChild) {
        const index = getNthChildrenIndex.call(this, nthChild.name);
        if (index === -1) {
          this.contentPage.nthChildren.push(nthChild);
        }
        else {
          const nthChild1 = this.contentPage.nthChildren[index];
          if (nthChild.row !== nthChild1.row) this.contentPage.nthChildren[index].row = nthChild.row;
          if (nthChild.col !== nthChild1.col) this.contentPage.nthChildren[index].col = nthChild.col;
        }
      },
      /**
       * Returns the array of a ``NthChild`` items stored in the perspective object.
       * <p><b>This array is a mutable reference, as a convenience!!</b>
       * @returns {NthChild[]}
       */
      nthChildrenItems: function () {
        return this.contentPage.nthChildren;
      },
      /**
       * Returns the ``NthChild`` item that has ``name`` property equal to the value of the ``name`` parameter.
       * @param {string} name - The value assigned to the ``name` property of a ``NthChild``
       * @returns {NthChild|undefined} - Returns the found ``NthChild`` item, or ``undefined`` if there is no ``NthChild`` item with the value assigned to the ``name`` parameter
       */
      getNthChildrenItem: function (name) {
        const index = getNthChildrenIndex.call(this, name);
        return (index !== -1 ? this.contentPage.nthChildren[index] : undefined);
      },
      /**
       * Sets the ``minHeight`` property of ``NthChild`` item with the specified ``name``.
       * @param {string} name
       * @param {string} minHeight - Ex. "240px"
       */
      setNthChildMinHeight: function (name, minHeight) {
        const index = getNthChildrenIndex.call(this, name);
        if (index !== -1) this.contentPage.nthChildren[index].minHeight = minHeight;
      },
      /**
       * Determine value of switch associated with a given `key` and `fieldName`.
       * @param {string} key
       * @param {string} fieldName
       * @param {string|null} fieldValue
       * @returns {boolean}
       * @example
       *  const value = self.perspectiveMemory.computeAddToArchiveSwitchValue.call(self.perspectiveMemory, rdjData.data['Name'].value, 'SourcePath', rdjData.data['SourcePath'].value);
       */
      computeAddToArchiveSwitchValue: function(key, fieldName, fieldValue) {
        // Declare return variable, using false
        // as the default value.
        let archiveSwitchValue = false;
        // Check to see if values assigned to the key,
        // fieldName and fieldValue parameters, are
        // not undefined or null.
        if ((typeof key !== 'undefined' && key !== null) &&
          (typeof fieldName !== 'undefined' && fieldName !== null) &&
          (typeof fieldValue !== 'undefined' && fieldValue !== null)
        ) {
          // They aren't, so use value assigned to
          // fieldValue to determine value of the
          // return variable. Set it to true, if
          // fieldValue starts with "wlsdeploy/".
          // Otherwise, assign false.
          archiveSwitchValue = (fieldValue.trim().startsWith('wlsdeploy/'));
          // We're computing the switch value, but
          // we should still use this opportunity
          // to update the addToArchive array, if
          // we can.
          const index = this.contentPage.switches.addToArchive.findIndex(item => item.name === key);
          if (index !== -1) {
            if (fieldName.startsWith('Source')) fieldName = 'SourcePath';
            if (fieldName.startsWith('Plan')) fieldName = 'PlanPath';
            this.contentPage.switches.addToArchive[index][fieldName] = archiveSwitchValue;
          }
        }
        return archiveSwitchValue;
      },
      /**
       * Add or update switch value associated with a given `key` and `fieldName`.
       * @param {string} key
       * @param {string} fieldName
       * @param {boolean} switchValue
       * @example
       *  const key = self.rdjData.data['Name'].value;
       *  const fieldName = 'SourcePath';
       *  const switchValue = false;
       *  self.perspectiveMemory.upsertAddToArchiveSwitchValue.call(self.perspectiveMemory, key, fieldName, switchValue);
       */
      upsertAddToArchiveSwitchValue: function(key, fieldName, switchValue) {
        // Check to see if values assigned to the key,
        // fieldName and fieldValue parameters, are
        // not undefined or null.
        if ((typeof key !== 'undefined' && key !== null) &&
          (typeof fieldName !== 'undefined' && fieldName !== null) &&
          (typeof switchValue !== 'undefined' && switchValue !== null)
        ) {
          // They aren't, so figure out the fieldName
          // for switch value we're working with.
          if (fieldName.startsWith('Source')) fieldName = 'SourcePath';
          if (fieldName.startsWith('Plan')) fieldName = 'PlanPath';
          // Call function that determines if there
          // is already a JS object in addToArchive
          // array, associated with key.
          const result = hasAddToArchiveSwitchValue.call(this, key, fieldName);
          if (result.hasKey) {
            // Found one, so upsert fieldName property
            // with switchValue.
            this.contentPage.switches.addToArchive[result.index][fieldName] = switchValue;
          }
          else if (key !== '') {
            // This means key wasn't undefined, null
            // or an empty string, and we need to add
            // a new JS object to the addToArchive
            // array.
            const data = {name: key};
            data[fieldName] = switchValue;
            this.contentPage.switches.addToArchive.push(data);
          }
        }
      },
      /**
       * Remove switch value data associated with a given `key`.
       * @param {string} key
       * @example
       *  const key = 'tst';
       *  self.perspectiveMemory.removeAddToArchiveSwitchValue.call(self.perspectiveMemory, key);
       */
      removeAddToArchiveSwitchValue: function(key) {
        // Check to see if key is not undefined or null.
        if (typeof key !== 'undefined' && key !== null) {
          // It isn't, so use built-in map function
          // to look for index of JS object in
          // addToArchive array, with a name that
          // matches key.
          const index = this.contentPage.switches.addToArchive.findIndex(item => item.name === key);
          if (index !== -1) {
            // Found one, so use index and built-in
            // splice function to remove JS object
            // from addToArchive array.
            this.contentPage.switches.addToArchive.splice(index, 1);
          }
        }
      },
      getTabstripTabCachedState: function (tabId) {
        return this.tabstrip.tab[tabId].cachedState;
      },
      setTabstripTabCachedState: function (tabId, value) {
        this.tabstrip.tab[tabId] = {cachedState: value};
      },
      removeWizardUsedIfData: function (key) {
        if (typeof key !== 'undefined' && key !== null) {
          delete this.wizard.usedIf[key];
        }
      },
      removeAllWizardUsedIfData: function () {
        this.wizard.usedIf = {};
      },
      upsertWizardUsedIfData: function (key, fieldName, fieldValue) {
        if ((typeof key !== 'undefined' && key !== null) &&
            (typeof fieldName !== 'undefined' && fieldName !== null)
        ) {
          let entry = this.wizard.usedIf[key];
          if (typeof entry === 'undefined') {
            this.wizard.usedIf[key] = [];
            entry = this.wizard.usedIf[key];
          }
          const index = entry.findIndex(item => item.property === fieldName);
          if (index !== -1) {
            entry[index].value = fieldValue;
          }
          else {
            entry.push({property: fieldName, value: fieldValue});
          }
        }
      },
      getWizardUsedIfData: function (key) {
        let data = [];
        if (typeof key !== 'undefined' && key !== null) {
          const entry = this.wizard.usedIf[key];
          if (typeof entry !== 'undefined') data = entry;
        }
        return data;
      }
    };

    // Return the class constructor
    return PerspectiveMemory;
  }
);