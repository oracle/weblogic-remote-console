/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'ojs/ojarraydataprovider', '../perspective/perspective-memory-manager', 'ojs/ojlogger', '../page-definition/utils', '../../core/utils'],
  function (ko, ArrayDataProvider, PerspectiveMemoryManager, Logger, PageDefinitionUtils, CoreUtils) {

    function BeanPathManager(beanTree, countObservable){
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(beanTree.type);
      this.beanPathHistory = ko.observableArray(this.perspectiveMemory.history());
      this.beanPathHistoryOptions = new ArrayDataProvider(this.beanPathHistory, { keyAttributes: 'value' });
      this.beanPathHistoryCount = countObservable;
    }

    function isValidBeanPathHistoryPath(path) {
      return (CoreUtils.isNotUndefinedNorNull(path) && CoreUtils.isNotUndefinedNorNull(path) && !path.startsWith("form")  && !path.startsWith("table"));
    }

    function trimPathParam(pathParam) {
      pathParam = PageDefinitionUtils.removeTrailingSlashes(pathParam);

      if (pathParam.startsWith("//")) {
        pathParam = pathParam.substring(2);
      }
      return pathParam;
    }

  //public:
    BeanPathManager.prototype = {
      /**
       * @param {string} pathParam
       * @param {[string]} breadcrumbLabels
       */
      addBeanPath: function (pathParam, breadcrumbLabels) {
        if (CoreUtils.isUndefinedOrNull(pathParam) || pathParam.startsWith("undefined")) pathParam = "";

        const actualPathParam = trimPathParam(pathParam);
        const breadcrumbsPath = (breadcrumbLabels.length > 0 ? breadcrumbLabels.join("/") : actualPathParam);

        let result = ko.utils.arrayFirst(this.beanPathHistory(), (beanpath) => {
          return beanpath['value'] === actualPathParam;
        });

        const breadcrumbsLabel = decodeURIComponent(breadcrumbsPath.replace(/\//g, " | "));
        if (CoreUtils.isNotUndefinedNorNull(result)) {
          result.label = breadcrumbsLabel;
        }
        else if (isValidBeanPathHistoryPath(actualPathParam) && actualPathParam !== "/") {
          // Only add Path if it's not already in beanPathHistory
          this.beanPathHistory.push({
            value: actualPathParam,
            label: breadcrumbsLabel
          });
        }
        this.beanPathHistoryCount(this.beanPathHistory().length);
      },

      /**
       * @param {string} pathParam
       */
      removeBeanPath: function (pathParam) {
        if (CoreUtils.isUndefinedOrNull(pathParam) || pathParam.startsWith("undefined")) pathParam = "";

        pathParam = trimPathParam(pathParam);

        const filteredBeanPaths = this.beanPathHistory().filter(beanpath => beanpath.value !== pathParam);

        this.beanPathHistory(filteredBeanPaths);
        this.beanPathHistoryCount(this.beanPathHistory().length);
        this.perspectiveMemory.setHistory(this.beanPathHistory());
      },

      isHistoryOption: function (value) {
        const option = this.beanPathHistory().find(item => item.value === value);
        return (CoreUtils.isNotUndefinedNorNull(option));
      },

      resetHistory: function () {
        this.beanPathHistory.valueWillMutate();
        this.beanPathHistory.removeAll();
        this.beanPathHistory.valueHasMutated();
        this.beanPathHistoryCount(this.beanPathHistory().length);
      },

      getBreadcrumbsPath: function (pathParam) {
        if (CoreUtils.isUndefinedOrNull(pathParam) || pathParam.startsWith("undefined")) pathParam = "";

        pathParam = trimPathParam(pathParam);

        const option = this.beanPathHistory().find(item => item.value === pathParam);
        return (CoreUtils.isNotUndefinedNorNull(option) ? option.label : pathParam);
      },

      getHistoryOptions: function () {
        return this.beanPathHistoryOptions;
      },

      saveHistoryOptions: function (folderName) {
      },

      loadHistoryOptions: function (folderName) {
      },

      getHistoryVisibility: function () {
        return this.perspectiveMemory.historyVisibility();
      },

      setHistoryVisibility: function (visible) {
        this.perspectiveMemory.setHistoryVisibility(visible);
      }

    };

    // Return constructor function
    return BeanPathManager;
  }
);
