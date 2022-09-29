/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout',  'ojs/ojarraydataprovider', 'wrc-frontend/apis/data-operations', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojknockout'],
  function (ko, ArrayDataProvider, DataOperations, ViewModelUtils, Runtime, PageDefinitionUtils, CoreTypes, CoreUtils, Logger) {
    function FormTabStrip(viewParams) {
      var self = this;

      this.sliceReadOnly;
      this.cancelSliceChange = false;
      this.currentSlice = '';

      this.tabDataProviders = ko.observableArray();
      this.tabArrays = ko.observableArray();
      this.level = 0;
      this.lastSelection = undefined;

      this.connected = function () {
      };

      this.disconnected = function () {
      };

      this.selectionChanged = function (d) {
        //the 'this' in the following line is bound to $current.data
        // (which is a tabDataProvider) in form.html
        self.currentSlice = this;
        const level = this.level;

        viewParams.signaling.formSliceSelected.dispatch({current: self.currentSlice});

        // initialize the slice history stack with the default tab
        if (CoreUtils.isUndefinedOrNull(this.sliceHistory)) {
          this.sliceHistory = [self.tabArrays()[0][0].name];
        }

        this.lastSelection = this.sliceHistory.pop();

        // Push name of clicked slice onto history stack
        this.sliceHistory.push(this.selection());

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
        const eventType = viewParams.onAutoSave(this.lastSelection);

        // Call canExit() function in form.js, passing in the value
        // returned from the autoSaveForm() call.
        viewParams.onCanExit(eventType)
          .then(result => {
            // result is a boolean indicating if form.js thinks
            // it's okay to change to the new slice.
            if (result) {
              // form.js says "Yes", so update slice using name of
              // currently selected tab, and the level that was used
              // earlier to do the splice on self.tabDataProviders
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
              this.selection(oldTab);
            }
          });
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

      this.updateSlice = function (newSliceName, level) {
        const isNonDefaultTab = newSliceName !== '';

        if (self.cancelSliceChange) {
          self.cancelSliceChange = false;
          return;
        }

        let rdj;

        let sliceParam = getQualifiedSlice(level);

        if (sliceParam !== '') {
          const pdjSlices = self?.pdjData?.sliceForm?.slices || self.pdjData?.sliceTable?.slices;

          if (pdjSlices) {
            const sliceName = (sliceParam.split('.'))[0];
            const index = pdjSlices.map(pdjSlice => pdjSlice.name).indexOf(sliceName);
            if (index === -1 && pdjSlices.length > 0) {
              // pdjSlices does not contain sliceName, so set
              // sliceParam to default slice (e.g. 'General')
              sliceParam = pdjSlices[0].name;
            }
          }
        }

        /*
         * If no slice name was passed in this is being invoked from the initial connect()
         * and we can rely on the data that is already present in the router.
         * Otherwise we are here due to a knockout event (user clicked on a tab) and
         * the data on the router needs to be refreshed as it refers to the old slice
         */
        async function getData() {
          if (newSliceName === '') {
            return {
              rdj: viewParams.parentRouter.data.rdjData(),
              pdj: viewParams.parentRouter.data.pdjData(),
            };
          } else {
            // Remove backendUrl from viewParams.parentRouter.data.rdjUrl()
            // and add slice query string
            const uri = `${viewParams.parentRouter.data
              .rdjUrl()
              .replace(Runtime.getBackendUrl(), '')}?slice=${sliceParam}`;

            return DataOperations.tabstrip.getSlice(uri)
              .then((reply) => {
                return {
                  rdj: reply.body.data.get('rdjData'),
                  pdj: reply.body.data.get('pdjData'),
                };
              });
          }
        }

        getData()
          .then((reply) => {
            rdj = reply.rdj;
            return reply.pdj;
          })
          .then((pdjData) => {
            // slice name is a parameter of the page description (pdj) uri
            const urlParams = new URLSearchParams(
              rdj.pageDescription.substring(rdj.pageDescription.indexOf('?'))
            );
            self.sliceName = urlParams.get('view');

            // Update the selected slices based on the returned page
            var sliceArray = self.sliceName.split('.');

            if (!pdjData.sliceForm && !pdjData.sliceTable ) {
              return;
            }

            let tabs = buildTabArrays(pdjData);

            function findChildTabs(tabs, tabName) {
              if (typeof tabs !== 'undefined')
                for (var i = 0; i < tabs.length; i++) {
                  if (tabs[i].name === tabName) {
                    return tabs[i].tabs;
                  }
                }
            }

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
                  keyAttributes: 'name',
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
                  continue;
                }
                subtabs = findChildTabs(subtabs, sliceArray[s]);

                if (CoreUtils.isUndefinedOrNull(subtabs)) {
                  break;
                }

                if (self.tabArrays().length <= s + 1) {
                  self.tabArrays.push(subtabs);
                  const dataProvider = {
                    level: tabLevel,
                    selection: ko.observable(sliceArray[s + 1]),
                    dataProvider: new ArrayDataProvider(subtabs, {
                      keyAttributes: 'name',
                    }),
                  };

                  self.tabDataProviders.push(dataProvider);
                } else if (!CoreUtils.isSame(self.tabArrays()[s + 1], subtabs)) {
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

            //refresh the header security warning link when goes to another tab.
            if (CoreUtils.isNotUndefinedNorNull(rdj.providerLinks)){
              const label = rdj.providerLinks[0].label;
              const resourceData = rdj.providerLinks[0].resourceData;
              if (CoreUtils.isNotUndefinedNorNull(label) && CoreUtils.isNotUndefinedNorNull(resourceData)){
                viewParams.signaling.domainSecurityWarning.dispatch({
                  linkLabel: label,
                  linkResourceData: resourceData
                });
              }
            }

            // only update pdj/rdj observables for the isNonDefaultTab
            // to avoid looping on hot rdj's (e.g. JVM Runtimes)
            if (isNonDefaultTab) {
              if (JSON.stringify(pdjData) !== JSON.stringify(viewParams.parentRouter.data.pdjData())) {
                viewParams.parentRouter.data.pdjData(pdjData);
              }

              if (JSON.stringify(rdj) !== JSON.stringify(viewParams.parentRouter.data.rdjData())) {
                viewParams.parentRouter.data.rdjData(rdj);
              }
            }

            if (
              CoreUtils.isNotUndefinedNorNull(rdj.data) &&
              CoreUtils.isNotUndefinedNorNull(rdj.data.Name)
            ) {
              const pageTitle = `${Runtime.getName()} - ${rdj.data.Name.value}`;
              viewParams.parentRouter.data.pageTitle(pageTitle);
            }

            self.pdjData = pdjData;
            self.rdjData = rdj;

            const isNonWritable = pdjData.sliceForm
              ? pdjData.sliceForm.readOnly === true
              : pdjData.sliceTable.readOnly === true;

            if (isNonWritable !== self.sliceReadOnly) {
              self.sliceReadOnly = isNonWritable;
              viewParams.signaling.nonwritableChanged.dispatch(isNonWritable);
            }

            if (viewParams.perspective.id === 'configuration') {
              viewParams.signaling.tabStripTabSelected.dispatch(
                'form-tabstrip',
                'shoppingcart',
                false
              );
            }
          })
          .catch((response) => {
            if (response.failureType === CoreTypes.FailureType.CONNECTION_REFUSED) {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
          });
      };

      function getQualifiedSlice(level) {
        let sliceParam = '';

        for (let i = 0; i <= level; i++) {
          if (typeof self.tabDataProviders()[i] !== 'undefined') {
            if (sliceParam !== '') sliceParam += '.';
            sliceParam += self.tabDataProviders()[i].selection();
          }
        }
        return sliceParam;
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