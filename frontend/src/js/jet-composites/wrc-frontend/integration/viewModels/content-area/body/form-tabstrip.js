/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout',  'ojs/ojarraydataprovider', 'wrc-frontend/apis/data-operations', 'wrc-frontend/common/page-definition-helper', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojknockout'],
  function (ko, ArrayDataProvider, DataOperations, PageDefinitionHelper, ViewModelUtils, Runtime, PageDefinitionUtils, CoreTypes, CoreUtils, Logger) {
    function FormTabStrip(viewParams) {
      const self = this;

      this.sliceReadOnly;
      this.cancelSliceChange = false;
      this.currentSlice = '';

      this.tabDataProviders = ko.observableArray();
      this.tabArrays = ko.observableArray();
      this.level = 0;

      this.setTabStripVisibility = function (visibility = true) {
        $('#form-tabstrip-container').css({display: (visibility ? 'inline-flex' : 'none')});
      };

      this.selectionChanged = function (event) {
        // NOTE: The 'this' variable in the following line is bound
        // to $current.data, which is the tabDataProviders observable
        // array. tabDataProviders is referenced in form-tabstrip.html
        onSelectionChanged(this);
      };

      this.getCurrentSlice = function() {
        return self.currentSlice;
      };

      this.getSliceName = function() {
        return self.sliceName;
      };

      this.getCancelSliceChange = function () {
        return self.cancelSliceChange;
      };
  
      /**
       * Attempts to select the slice name assigned to `lastVisitedSlice' parameter.
       * @param {object} lastVisitedSlice
       * @param {string} [rdjUrl=viewParams.parentRouter.data.rdjUrl()]
       */
      this.selectLastVisitedSlice = function (lastVisitedSlice, rdjUrl = viewParams.parentRouter.data.rdjUrl()) {
        self.setTabStripVisibility(true);
        viewParams.parentRouter.data.rdjUrl(rdjUrl);
        if (CoreUtils.isNotUndefinedNorNull(lastVisitedSlice) && lastVisitedSlice !== '') {
          self.updateSlice(lastVisitedSlice, lastVisitedSlice.level);
        }
      };

      this.updateSlice = function (newSliceName, level) {
        if (self.cancelSliceChange) {
          self.cancelSliceChange = false;
          return;
        }

        let sliceParam = getQualifiedSlice(level);

        if (sliceParam !== '') {
          if (PageDefinitionHelper.hasPDJData(viewParams.parentRouter)) {
            const pdjData = viewParams.parentRouter.data.pdjData();
            let pdjSlices = [];
            if (PageDefinitionHelper.hasSliceFormSlices(pdjData)) pdjSlices = pdjData.sliceForm.slices;
            if (PageDefinitionHelper.hasSliceTableSlices(pdjData)) pdjSlices = pdjData.sliceTable.slices;
            
            if (pdjSlices.length > 0) {
              const rootSliceName = (sliceParam.split('.'))[0];
              const index = pdjSlices.findIndex(pdjSlice => pdjSlice.name === rootSliceName);
              if (index === -1 && pdjSlices.length > 0) {
                // pdjSlices array does not contain rootSliceName, so
                // set sliceParam to default slice (e.g. 'General')
                sliceParam = pdjSlices[0].name;
              }
            }
          }
        }

        /**
         * Gets RDJ and PDJ data for the fields associated with the `newSliceName` slice.
         * <p>If an empty string was assigned to the </code>newSliceName</code>, then <code>viewParams.parentRouter.data.rdjData()</code> and <code>viewParams.parentRouter.data.pdjData()</code> are returned.</p>
         */
        async function getData() {
          /**
           * Created the url to get the RDJ containing the fields for a slice, using `?slice=<sliceParamValue>` as the query string parameter.
           * <p>Optionally removes backendUrl the url, if it is present.</p>
           * @param {string} rdjUrl
           * @param {string} sliceParamValue
           * @returns {string}
           * @private
           */
          function getRDJUri(rdjUrl, sliceParamValue) {
            // Remove scheme://host:port from rdjUrl, if present
            let uri = rdjUrl.replace(Runtime.getBackendUrl(), '');
            // Get query string parameters.
            const urlParams = PageDefinitionUtils.getURLParams(uri);
            // Check for query string parameter named "slice".
            if (urlParams.has('slice')) {
              // Found one, so see if sliceParamValue has a value.
              if (sliceParamValue !== '') {
                // It does, so replace it with sliceParamValue
                urlParams.set('slice', sliceParamValue);
                // Build value assigned to return variable
                uri = decodeURIComponent(urlParams.toString());
              }
            }
            else if (sliceParamValue !== '') {
              // There was no query string parameter named "slice"
              // and sliceParamValue is not an empty string, so
              // add a "slice" parameter using the value assigned
              // to sliceParamValue as the value.
              uri = `${uri}?slice=${sliceParamValue}`;
            }
            return uri;
          }

          if (newSliceName === '') {
            // This means we're definitely not selecting the
            // last visited slice.
            return {
              rdj: viewParams.parentRouter.data.rdjData(),
              pdj: viewParams.parentRouter.data.pdjData()
            };
          }
          else {
            // This means we might be selecting the last visited
            // slice, so we need to check for a dot ('.') in the
            // sliceParam variable to figure out what value to use
            // for the "slice" query string parameter.
            let sliceParamValue;
            if (sliceParam.indexOf('.') !== -1) {
              // There's a dot, so check if the value assigned to
              // the newSliceName.selection observable matches the
              // end of sliceParam. Id so, then use sliceParam for
              // the value of the "slice" query string parameter.
              // Otherwise, use the value that is assigned to the
              // newSliceName.selection observable.
              sliceParamValue = (sliceParam.endsWith(newSliceName.selection()) ? sliceParam : newSliceName.selection());
            }
            else {
              // There is no dot in sliceParam, so just use it as
              // the value of the "slice" query string parameter.
              sliceParamValue = sliceParam;
            }

            // Construct the uri used to retrieve the RDJ, which
            // will have a "slice" query string parameter with
            // sliceParamValue as the value.
            const uri = getRDJUri(viewParams.parentRouter.data.rdjUrl(), sliceParamValue);

            // Turn on the "busy" preloader
            ViewModelUtils.setPreloaderVisibility(true);

            // Get the RDJ/PDJ for the slice
            return DataOperations.tabstrip.getSlice(uri)
              .then(reply => {
                // Return a JS object with the RDJ/PDJ values
                // from the reply.
                return {
                  rdj: reply.body.data.get('rdjData'),
                  pdj: reply.body.data.get('pdjData')
                };
              })
              .finally(() => {
                // Tuen off the "busy" preloader
                ViewModelUtils.setPreloaderVisibility(false);
              });
          }
        }

        // The following getData() function doesn't block, so
        // don't pull code after it that you don't intend to
        // execute in parallel with it.
        
        getData()
          .then(reply => {
            // The presence of reply.pdj is guaranteed, so you don't
            // need to use optional chaining here.
            if (reply.pdj.sliceForm || reply.pdj.sliceTable) {
              // Set sliceName module-scoped variable to value assigned
              // to the "view" query string parameter.
              self.sliceName = PageDefinitionUtils.getSliceFromUrl(reply.rdj.pageDescription);

              // Update the JS objects that represent the tabs
              // used in the multi-level tabstrip.
              updateTabs(reply.pdj, self.sliceName);

              // Update observables in viewParams.parentRouter.data
              // from reply.
              updateParentRouterData(viewParams.parentRouter, reply, (newSliceName !== ''));

              // Update module-scoped variables that have to
              // do with the slice being read-only or not.
              updateSliceReadOnlyVariable(reply.pdj);
            }
  
          })
          .catch(response => {
            if (response.failureType === CoreTypes.FailureType.CONNECTION_REFUSED) {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
          });
      };
  
      /**
       * Routine that demystifies the binding of the tabDataProviders
       * observable array, to the `selection` property of oj-tab-bar.
       * @param {object|string} newSelection
       * @private
       */
      function onSelectionChanged(newSelection) {
        self.currentSlice = newSelection;
    
        const level = newSelection.level;
    
        // initialize the slice history stack with the default tab
        if (CoreUtils.isUndefinedOrNull(newSelection.sliceHistory)) {
          newSelection.sliceHistory = [self.tabArrays()[0][0].name];
        }
    
        newSelection.lastSelection = newSelection.sliceHistory.pop();
    
        // Push name of clicked slice onto history stack
        newSelection.sliceHistory.push(newSelection.selection());
    
        // Remove all the elements in the self.tabDataProviders
        // observableArray, starting at level + 1. The objective
        // is to remove any tabs selected on a level greater
        // that the current value of the self.level instance-scope
        // variable.
        self.tabDataProviders.splice(level + 1);
    
        // Remove all the elements in the self.tabArrays
        // observableArray, starting at level + 1. The objective
        // is to remove any tabs selected on a level greater
        // that the current value of the self.level instance-scope
        // variable.
        self.tabArrays.splice(level + 1);
    
        // Call autoSaveForm() function in form.js, passing in the
        // name of the most recently selected tab. That function
        // is only called from here, so form.js can use that fact
        // to figure out if the call to canExit() is attributable
        // to clicking a tab, or clicking a breadcrumb link.
        const eventType = viewParams.onAutoSave(newSelection.lastSelection);
    
        // Call canExit() function in form.js, passing in the value
        // returned from the autoSaveForm() call.
        viewParams.onCanExit(eventType)
          .then(result => {
            // result is a boolean indicating if form.js thinks
            // it's okay to change to the new slice.
            if (result) {
              // form.js says "Yes", so update slice using name
              // of currently selected tab, and the level that
              // was used earlier to set the self.tabDataProviders
              // and self.tabArrays instance-scope observableArray
              // variables.
              self.updateSlice(self.currentSlice, level + 1);
            }
            else {
              // form.js says "No", so set cancelSliceChange to
              // true.
              self.cancelSliceChange = true;
          
              // Set slice back to the previous selection.
              const oldTab = self.tabDataProviders()[level].lastSelection;
              newSelection.selection(oldTab);
            }
          });
      }
  
      /**
       *
       * @param {object} pdjData
       * @param {string} sliceName
       * @private
       */
      function updateTabs(pdjData, sliceName) {
        function findChildTabs(tabs, tabName) {
          let rtnval;
          if (CoreUtils.isNotUndefinedNorNull(tabs)) {
            for (let i = 0; i < tabs.length; i++) {
              if (tabs[i].name === tabName) {
                rtnval = tabs[i].tabs;
                break;
              }
            }
          }
          return rtnval;
        }

        const sliceArray = (typeof sliceName === 'string' ? sliceName.split('.') : []);
        const tabs = buildTabArrays(pdjData);

        if ((tabs.length !== 1 && self.tabArrays().length === 0) || !CoreUtils.isSame(tabs, self.tabArrays()[0])) {
          self.tabArrays.removeAll();
          self.tabArrays.push(tabs);
        }

        let tabLevel = 0;

        if (tabs.length !== 1 && self.tabDataProviders().length === 0) {
          self.tabDataProviders.push({
            level: tabLevel,
            selection: ko.observable(sliceArray[0]),
            dataProvider: new ArrayDataProvider(self.tabArrays()[0], {
              keyAttributes: 'name'
            }),
          });
        }

        tabLevel++;

        // loop through the selected tabs and populate tab
        // dataproviders
        let subtabs = tabs;
        for (let s = 0; s < sliceArray.length; s++) {
          for (let ix = 0; ix < subtabs.length; ix++) {
            if (sliceArray[s] !== subtabs[ix].name) {
              // Current sliceArray element isn't equal to
              // subtabs[ix], so move onto the next subtabs
              // array element.
              continue;
            }

            // sliceArray[s] equals subtabs[ix], so assign
            // subtabs[ix].tabs to the subtabs array.
            subtabs = findChildTabs(subtabs, sliceArray[s]);

            if (CoreUtils.isUndefinedOrNull(subtabs)) {
              // Break out of the subtabs for-loop, if
              // subtabs is now undefined.
              break;
            }

            if (self.tabArrays().length <= s + 1) {
              // This means subtabs is not undefined, and
              self.tabArrays.push(subtabs);
              const dataProvider = {
                level: tabLevel,
                selection: ko.observable(sliceArray[s + 1]),
                dataProvider: new ArrayDataProvider(subtabs, {
                  keyAttributes: 'name',
                }),
              };

              self.tabDataProviders.push(dataProvider);
            }
            else if (!CoreUtils.isSame(self.tabArrays()[s + 1], subtabs)) {
              self.tabArrays.pop();
              self.tabArrays.push(subtabs);

              const dataProvider = {
                level: tabLevel,
                selection: ko.observable(sliceArray[s + 1]),
                dataProvider: new ArrayDataProvider(subtabs, {
                  keyAttributes: 'name',
                }),
              };
              self.tabDataProviders.pop();
              self.tabDataProviders.push(dataProvider);
            }

            tabLevel++;
            break;
          }
        }
      }
  
      /**
       *
       * @param {object} parentRouter
       * @param {{rdj: object, pdj: object}} reply
       * @param {boolean} isNonDefaultTab
       * @private
       */
      function updateParentRouterData(parentRouter, reply, isNonDefaultTab) {
        // only update pdj/rdj observables for the isNonDefaultTab
        // to avoid looping on hot rdj's (e.g. JVM Runtimes)
        if (isNonDefaultTab) {
          let changePageTitle = false;
          if (JSON.stringify(reply.pdj) !== JSON.stringify(parentRouter.data.pdjData())) {
            parentRouter.data.pdjData(reply.pdj);
            changePageTitle = true;
          }
      
          if (JSON.stringify(reply.rdj) !== JSON.stringify(parentRouter.data.rdjData())) {
            parentRouter.data.rdjData(reply.rdj);
          }

          // Update the page title when the PDJ changes
          if (changePageTitle) {
            const titleName = Runtime.getName();
            const titlePage = reply.pdj.helpPageTitle;
            const pageTitle = (titlePage ? `${titleName} - ${titlePage}` : titleName);

            // Set document title as the form/table is not connected, just rendered again!
            document.title = pageTitle;
            parentRouter.data.pageTitle(pageTitle);
          }
        }
      }
  
      function updateSliceReadOnlyVariable(pdjData) {
        const isNonWritable = (pdjData.sliceForm ? pdjData.sliceForm.readOnly === true : pdjData.sliceTable.readOnly === true);
    
        if (isNonWritable !== self.sliceReadOnly) {
          self.sliceReadOnly = isNonWritable;
          viewParams.signaling.nonwritableChanged.dispatch(isNonWritable);
        }
      }
  
      /**
       * Use `level` as the exit when value for a for loop, which Loops through `self.tabDataProviders` to create a dot-delimited string of the hierarchy for a slice.
       * <p>This works because <code>self.tabDataProviders()[i]</code> returns </p>
       * @param level
       * @returns {string}
       */
      function getQualifiedSlice(level) {
        const sliceParams = [];
  
        for (let i = 0; i <= level; i++) {
          const sliceParam = self.tabDataProviders()[i];
          if (typeof sliceParam !== 'undefined') {
            sliceParams.push(sliceParam.selection());
          }
        }
  
        return sliceParams.join('.');
      }
    }

    function buildTabArrays(pdj) {
      let tabArray = [];

      function tabFromSlice(slice) {
        return { name: slice.name, label: slice.label };
      }

      // create Tabs recursively from an element in a pdj
      function createTabs(levelTabs, pdjElement) {
        if (CoreUtils.isNotUndefinedNorNull(pdjElement.slices)) {
          pdjElement.slices.forEach((levelSlice) => {
            levelTabs.push(tabFromSlice(levelSlice));

            if (CoreUtils.isNotUndefinedNorNull(levelSlice.slices)) {
              levelTabs[levelTabs.length - 1].tabs = [];
              createTabs(levelTabs[levelTabs.length - 1].tabs, levelSlice);
            }
          });
        }
      }

      createTabs(tabArray, pdj.sliceForm || pdj.sliceTable);

      return tabArray;
    }

    FormTabStrip.prototype = {
      buildTabArrays: buildTabArrays
    };

    return FormTabStrip;
  }
);