/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojcontext', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule', 'ojs/ojinputsearch'],
  function(oj, ko, DataOperations, MessageDisplaying, ViewModelUtils, Runtime, CoreTypes, CoreUtils, Context) {
    function SimpleSearchTemplate(viewParams){
      const self = this;

      this.i18n = {
        header: {
          placeholders: {
            search: { value: oj.Translations.getTranslatedString('wrc-common.placeholders.search.value') }
          }
        }
      };

      this.simpleSearchPerspective = ko.observable();
      this.simpleSearchResourceData = ko.observable();
      this.simpleSearchValue = ko.observable('');

      this.signalBindings = [];

      this.connected = function () {
        let binding = viewParams.signaling.backendConnectionLost.add(() => {
          // disable the simple search
          this.simpleSearchResourceData(null);
          setSimpleSearchState(false);
        });

        self.signalBindings.push(binding);

        //setup for security warning link.
        binding = viewParams.signaling.dataProviderSelected.add(dataProvider => {
          this.canExitCallback = undefined;
          // setup the simple search
          this.simpleSearchPerspective(dataProvider.beanTrees[0].type);
          this.simpleSearchResourceData(dataProvider.beanTrees[0].simpleSearch);
          setSimpleSearchState(CoreUtils.isNotUndefinedNorNull(this.simpleSearchResourceData()));
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            // disable the simple search
            this.simpleSearchResourceData(null);
            setSimpleSearchState(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.beanTreeChanged.add(newBeanTree => {
          if (newBeanTree.type !== 'home') {
            // switch the simple search
            this.simpleSearchPerspective(newBeanTree.type);
            this.simpleSearchResourceData(newBeanTree.simpleSearch);
            setSimpleSearchState(CoreUtils.isNotUndefinedNorNull(this.simpleSearchResourceData()));
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);


      this.handleSimpleSearchAction = (event) => {
        const searchValue = event.detail.value;
        ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
          .then(reply => {
            if (reply) {
              const searchUrl = self.simpleSearchResourceData();
              const searchPerspective = self.simpleSearchPerspective();
              if (CoreUtils.isNotUndefinedNorNull(searchUrl) && CoreUtils.isNotUndefinedNorNull(searchValue) && (searchValue.length > 0)) {
                DataOperations.mbean.simpleSearch(searchUrl, searchValue)
                  .then(reply => {
                    // Check for messages to display about the search
                    if (CoreUtils.isNotUndefinedNorNull(reply.body.messages) && (reply.body.messages.length > 0)) {
                      MessageDisplaying.displayResponseMessages(reply.body.messages);
                    }
                    // Route to the search results
                    if (CoreUtils.isNotUndefinedNorNull(reply.body.data.resourceData)) {
                      const encodedResouceData = encodeURIComponent(reply.body.data.resourceData.resourceData);
                      viewParams.parentRouter.go(`/${searchPerspective}/${encodedResouceData}`);
                    }
                  })
                  .catch(response => {
                    if ((response.failureType === CoreTypes.FailureType.CBE_REST_API) &&
                      CoreUtils.isNotUndefinedNorNull(response.body.messages) && (response.body.messages.length > 0)) {
                      MessageDisplaying.displayResponseMessages(response.body.messages);
                    }
                    else {
                      ViewModelUtils.failureResponseDefaultHandling(response);
                    }
                  });
              }
            }
          })
          .catch(failure => {
            ViewModelUtils.failureResponseDefaultHandling(failure);
          });
      };

      // Perform the enable or disable of the simple search control in the header
      function setSimpleSearchState(enabled) {
        const ojDisabledClass = 'oj-disabled';
        const searchElement = '#cfe-simple-search';
        const ojInputSearch = document.querySelector(searchElement);
        const htmlInputText = document.querySelector(searchElement + ' input[type="text"]');
        if (enabled) {
          if (htmlInputText !== null) {
            htmlInputText.disabled = false;
          }
          if (ojInputSearch !== null) {
            ojInputSearch.classList.remove(ojDisabledClass);
          }
        }
        else {
          self.simpleSearchValue('');
          if (htmlInputText !== null) {
            htmlInputText.disabled = true;
          }
          if (ojInputSearch !== null) {
            ojInputSearch.classList.add(ojDisabledClass);
          }
        }
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(() => {
          setSimpleSearchState(CoreUtils.isNotUndefinedNorNull(this.simpleSearchResourceData()));
        });

    }

    return SimpleSearchTemplate;
  }
);