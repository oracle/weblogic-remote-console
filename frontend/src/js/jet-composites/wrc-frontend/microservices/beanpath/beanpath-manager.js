/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function ( oj, ko, ArrayDataProvider, PerspectiveMemoryManager, PageDefinitionUtils, CoreUtils, Logger) {

    function BeanPathManager(beanTree, countObservable){
      this.beanTree = beanTree;
      this.beanPathHistoryCount = countObservable;
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(beanTree.type, beanTree.provider.id);
      this.beanPathHistory = ko.observableArray(getInitialBeanPathItems.call(this, beanTree));
      this.beanPathHistoryOptions = getBeanPathHistoryOptions(this.beanPathHistory);
      this.beanPathHistoryCount(this.beanPathHistory().length);
    }

    function getInitialBeanPathItems(beanTree) {
      let initialBeanPathItems = [];

      const perspectivesBeanPathHistory = PerspectiveMemoryManager.getProviderPerspectivesBeanPathHistory(beanTree.provider.id);
      if (Object.keys(perspectivesBeanPathHistory).length > 0) {
        initialBeanPathItems = Array.prototype.concat(...Object.values(perspectivesBeanPathHistory));
      }

      if (initialBeanPathItems.length > 0) {
        let pathParts = [];
        // The provider id in the value will be different, so
        // we need to update that using data in beanTree.
        for (const i in initialBeanPathItems) {
          pathParts = initialBeanPathItems[i].value.split('/').filter(e => e);
          if (pathParts[1] !== beanTree.provider.id) {
            pathParts[1] = beanTree.provider.id;
            initialBeanPathItems[i].value = `/${pathParts.join('/')}`;
          }
        }
      }
      return initialBeanPathItems;
    }

    function isValidBeanPathHistoryPath(path) {
      return (CoreUtils.isNotUndefinedNorNull(path) && CoreUtils.isNotUndefinedNorNull(path) && !path.startsWith('form')  && !path.startsWith('table'));
    }

    function trimPathParam(pathParam) {
      pathParam = PageDefinitionUtils.removeTrailingSlashes(pathParam);

      if (pathParam.startsWith('//')) {
        pathParam = pathParam.substring(2);
      }
      return pathParam;
    }

    function getBeanTreeTypeLabel(beanTreeType) {
      return oj.Translations.getTranslatedString(`wrc-content-area-header.title.${beanTreeType}`);
    }

    function getBeanPathHistoryOptions(beanPathHistory) {
      return new ArrayDataProvider(beanPathHistory, { keyAttributes: 'value' });
    }

    function updateBeanPathHistoryCount(count) {
      this.beanPathHistoryCount(count);
    }

    //public:
    BeanPathManager.prototype = {
      /**
       * @param {string} pathParam
       * @param {[string]} breadcrumbLabels
       */
      addBeanPath: function (pathParam, breadcrumbLabels) {
        if (CoreUtils.isUndefinedOrNull(pathParam) || pathParam.startsWith('undefined')) pathParam = '';

        const actualPathParam = trimPathParam(pathParam);
        const breadcrumbsPath = (breadcrumbLabels.length > 0 ? breadcrumbLabels.join('/') : actualPathParam);
        const breadcrumbsLabel = decodeURIComponent(breadcrumbsPath.replace(/\//g, ' | '));

        let result = ko.utils.arrayFirst(this.beanPathHistory(), (beanpath) => {
          return beanpath['label'] === breadcrumbsLabel;
        });

        if (CoreUtils.isNotUndefinedNorNull(result)) {
          result.label = breadcrumbsLabel;
        }

        if (isValidBeanPathHistoryPath(actualPathParam) && actualPathParam !== '/') {
          const historyOption = this.beanPathHistory().find(item => item.value === pathParam);
          if (CoreUtils.isUndefinedOrNull(historyOption)) {
            // Add path to beanPathHistory
            const newEntry = {
              value: actualPathParam,
              label: `${breadcrumbsLabel}`,
              perspective: {id: this.perspectiveMemory.perspective.id}
            };
            this.beanPathHistory.valueWillMutate();
            this.beanPathHistory.push(newEntry);
            this.beanPathHistory.valueHasMutated();
            PerspectiveMemoryManager.addProviderPerspectiveBeanPathHistory(
              this.beanTree.provider.id,
              this.perspectiveMemory.perspective.id,
              this.beanPathHistory()
            );
            getBeanPathHistoryOptions(this.beanPathHistory);
          }
        }
        updateBeanPathHistoryCount.call(this, this.beanPathHistory().length);
      },

      /**
       * @param {string} pathParam
       */
      removeBeanPath: function (pathParam) {
        if (CoreUtils.isUndefinedOrNull(pathParam) || pathParam.startsWith('undefined')) pathParam = '';

        pathParam = trimPathParam(pathParam);

        const filteredBeanPaths = this.beanPathHistory().filter(beanpath => beanpath.value !== pathParam);

        this.beanPathHistory(filteredBeanPaths);
        updateBeanPathHistoryCount.call(this, this.beanPathHistory().length);

        PerspectiveMemoryManager.setProviderPerspectiveBeanPathHistory(
          this.beanTree.provider.id,
          this.perspectiveMemory.perspective.id,
          this.beanPathHistory()
        );
      },

      findHistoryEntry: function(value) {
        return  this.beanPathHistory().find(item => item.value === value);
      },

      isHistoryEntry: function (value) {
        const option = this.getHistoryOption(value);
        return (CoreUtils.isNotUndefinedNorNull(option));
      },

      resetHistoryEntries: function (dataProvider) {
        const self = this;
        return new Promise(function (resolve) {
          const options = {
            provider: {
              id: (CoreUtils.isNotUndefinedNorNull(dataProvider) ? dataProvider.id : self.beanTree.provider.id)
            },
            connectivity: (CoreUtils.isNotUndefinedNorNull(dataProvider) ? dataProvider.connectivity : 'DETACHED')
          };

          PerspectiveMemoryManager.clearProviderPerspectivesBeanPathHistory(options);
          self.beanPathHistory.valueWillMutate();
          self.beanPathHistory.removeAll();
          self.beanPathHistory.valueHasMutated();

          updateBeanPathHistoryCount.call(self, self.beanPathHistory().length);

          resolve({succeeded: true});
        });
      },

      getBreadcrumbsPath: function (pathParam) {
        if (CoreUtils.isUndefinedOrNull(pathParam) || pathParam.startsWith('undefined')) pathParam = '';

        pathParam = trimPathParam(pathParam);

        const option = this.beanPathHistory().find(item => item.value === pathParam);
        return (CoreUtils.isNotUndefinedNorNull(option) ? option.label : pathParam);
      },

      getHistoryEntries: function () {
        const historyOptions = [];
        const perspectivesBeanPathHistory = PerspectiveMemoryManager.getProviderPerspectivesBeanPathHistory(this.beanTree.provider.id);
        if (Object.keys(perspectivesBeanPathHistory).length > 0) {
          const currentBeanPathItems = Array.prototype.concat(...Object.values(perspectivesBeanPathHistory));
          this.beanPathHistoryOptions = getBeanPathHistoryOptions(currentBeanPathItems);

          for (let [key, value] of Object.entries(perspectivesBeanPathHistory)) {
            const historyOption = {
              value: key,
              label: getBeanTreeTypeLabel(key),
              children: []
            };
            for (const item of value) {
              historyOption.children.push({
                label: item.label,
                value: item.value,
                perspective: {id: key}
              });
            }
            historyOptions.push(historyOption);
          }

        }
        return historyOptions;
      },

      getNavigatorPosition: function () {
        return PerspectiveMemoryManager.getProviderPerspectivesNavigatorPosition(this.beanTree.provider.id);
      },
  
      getNavigatorVisibility: function () {
        return PerspectiveMemoryManager.getProviderPerspectivesNavigatorVisibility(this.beanTree.provider.id);
      },
  
      setHistoryNavigatorVisibility: function (visible) {
        this.perspectiveMemory.setBreadcrumbsVisibility(visible);
      },
  
      getHistoryVisibility: function () {
        return PerspectiveMemoryManager.getProviderPerspectivesHistoryVisibility(this.beanTree.provider.id);
      },

      setHistoryVisibility: function (visible) {
        PerspectiveMemoryManager.setProviderPerspectivesHistoryVisibility(this.beanTree.provider.id, visible);
      }

    };

    // Return constructor function
    return BeanPathManager;
  }
);