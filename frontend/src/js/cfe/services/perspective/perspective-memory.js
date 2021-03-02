/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['./perspective-manager'],
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
        subtreeItem: null
      };
      this.contentPage = {
        path: null,
        slices: [],
        syncInterval: null,
        nthChildren: []
      };
      this.navtree = {
        keySet: null
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
      setSubtreeItem: function (groupName) {
        this.landingPage.subtreeItem = groupName;
      },
      subtreeItem: function () {
        return this.landingPage.subtreeItem;
      },
      setExpandedKeySet: function (keySet) {
        this.navtree.keySet = keySet;
      },
      expandedKeySet: function () {
        return this.navtree.keySet;
      },
      setContentPath: function (path) {
        this.contentPage.path = path;
      },
      contentPath: function () {
        return this.contentPage.path;
      },
      setContentSlice: function (slices) {
        this.contentPage.slices = slices;
      },
      contentSlice: function () {
        return this.contentPage.slices;
      },
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
      nthChildrenItems: function () {
        return this.contentPage.nthChildren;
      },
      getNthChildrenItem: function (name) {
        const index = getNthChildrenIndex.call(this, name);
        return (index !== -1 ? this.contentPage.nthChildren[index] : undefined);
      },
      setNthChildMinHeight: function (name, minHeight) {
        const index = getNthChildrenIndex.call(this, name);
        if (index !== -1) this.contentPage.nthChildren[index].minHeight = minHeight;
      }
    };

    // Return the class constructor
    return PerspectiveMemory;
  }
);