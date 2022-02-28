/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojlogger'],
  function (Logger) {
    /**
     *
     * @param properties
     * @param mode
     * @constructor
     */
    function PageDefinitionPages(properties, mode) {
      // Create instance-scope object for backing data
      // of pages
      this.backingData = {
        mode: mode,
        properties: properties,
        canBack: false,
        canNext: true,
        canFinish: false,
        isFinished: false,
        paging: {direction: 'next', current: 0, pages: []}
      };
    }

    function getPagingIndexProperties(index) {
      let properties = [];
      if (index < this.backingData.paging.pages.length) {
        properties = this.backingData.paging.pages[index];
      }
      return [...properties];
    }

    function goPreviousPage() {
      this.backingData.canBack = isValidFlow.call(this, 'back');
      if (this.backingData.canBack) {
        this.backingData.paging.current--;
      }
      else {
        this.backingData.paging.current = 0;
      }
    }

    function goNextPage() {
      if (isValidFlow.call(this, 'next')) {
        this.backingData.paging.current++;
      }
    }

    function isValidFlow(direction) {
      let index, rtnval = false;
      switch (direction) {
        case 'next':
          index = this.backingData.paging.pages.length;
          rtnval = (index > this.backingData.paging.current);
          break;
        case 'back':
          index = this.backingData.paging.current;
          rtnval = (index > 0);
          break;
      }
      return rtnval;
    }

    function isAddingBackingDataProperties() {
      const last = this.backingData.paging.pages.length - 1;
      return (last < this.backingData.paging.current);
    }

  //public:
    PageDefinitionPages.prototype = {
      filterBackingDataProperties: function (fieldName) {
        return this.backingData.properties.filter(property => property.name === fieldName);
      },

      findBackingDataProperty: function (fieldName) {
        return this.backingData.properties.find(property => property.name === fieldName);
      },

      getBackingDataProperties: function () {
        return [...this.backingData.properties];
      },

      getBackingDataPagingDirection: function () {
        return this.backingData.paging.direction;
      },

      setBackingDataPagingDirection: function (value) {
        if (['next', 'back'].includes(value)) {
          this.backingData.paging.direction = value;
        }
      },

      getBackingDataPagingProperties: function () {
        if (this.backingData.paging.direction === 'next') {
          const last = this.backingData.paging.pages.length - 1;
          const current = this.backingData.paging.current;
          if (current !== 0 && current > last) {
            this.backingData.paging.current--;
          }
        }
        return getPagingIndexProperties.call(this, this.backingData.paging.current);
      },

      markAsFinished: function () {
        if (this.backingData.mode.name === 'PAGING') this.backingData.canBack = false;
        this.backingData.canNext = false;
        this.backingData.canFinish = true;
        this.backingData.isFinished = true;
      },

      resetBackingDataFlowsAllowed: function () {
        if (this.backingData.mode.name === 'PAGING') this.backingData.canBack = false;
        this.backingData.canNext = true;
        this.backingData.canFinish = false;
        this.backingData.isFinished = false;
      },

      addBackingDataPagingPageProperties: function (properties) {
        if (!this.getCanFinish()) {
          if (isAddingBackingDataProperties.call(this)) {
            // This means this is the first time the first page
            // is being displayed. In that case, last will be
            // -1 and this.backingData.paging.current will be
            // 0, so add a page using properties parameter
            this.backingData.paging.pages.push(properties);
          }
        }
      },

      deleteBackingDataProperty: function (fieldName) {
        // Get index of matching attribute, in case we need to delete
        // it from this.backingData.properties. index will be something
        // other that -1, if that is the case.
        const index = this.backingData.properties.map(property => property.name).indexOf(fieldName);
        if (index !== -1) this.backingData.properties.splice(index, 1);
      },

      addBackingDataProperties: function (properties) {
        if (isAddingBackingDataProperties.call(this)) {
          // Append properties to this.backingData.properties. Use
          // push instead of concat, to avoid appending duplicates
          properties.forEach((property) => {
            const index = this.backingData.properties.map(property1 => property1.name).indexOf(property.name);
            if (index === -1) this.backingData.properties.push(property);
          });
        }
      },

      selectBackingDataProperties: function (direction) {
        if (this.backingData.mode.name === 'PAGING') {
          this.backingData.paging.direction = direction;
          if (direction === 'back') {
            goPreviousPage.call(this);
          }
        }
        if (direction === 'next') goNextPage.call(this);
      },

      getMode: function () {
        return this.backingData.mode;
      },

      getCanBack: function () {
        return (this.backingData.paging.current > 0);
      },

      getCanNext: function () {
        return this.backingData.canNext;
      },

      getCanFinish: function () {
        return this.backingData.canFinish;
      },

      isFinished: function () {
        return this.backingData.isFinished;
      }

    };

    // Return PageDefinitionPages constructor function
    return PageDefinitionPages;
  }
);
