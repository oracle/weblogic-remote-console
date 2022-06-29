/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
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
        nthChildren: []
      };
      this.navtree = {
        keySet: null,
        width: '300px'
      };
      this.tabstrip = {
        tab: {
          'shoppingcart': {cachedState: {}},
          'dataproviders': {cachedState: {}},
          'ataglance': {cachedState: {}}
        }
      };
    }

    function getNthChildrenIndex(name) {
      return this.contentPage.nthChildren.map(nthChild => nthChild.name).indexOf(name);
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
      getTabstripTabCachedState: function (tabId) {
        return this.tabstrip.tab[tabId].cachedState;
      },
      setTabstripTabCachedState: function (tabId, value) {
        this.tabstrip.tab[tabId] = {cachedState: value};
      }
    };

    // Return the class constructor
    return PerspectiveMemory;
  }
);
