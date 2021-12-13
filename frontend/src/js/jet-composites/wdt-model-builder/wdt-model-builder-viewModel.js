/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'wrc-frontend/controller', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/provider-management/data-provider', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmessages', 'ojs/ojmodule', 'ojs/ojbinddom'],
  function (ko, ArrayDataProvider, HtmlUtils, Controller, PerspectiveManager, PerspectiveMemoryManager, DataProviderManager, DataProvider, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {

    function WdtModelBuilderComposite(context) {
      const self = this;

      const signaling = Controller.getSignaling();

      this.activatedProviders = [];
      this.modelFiles = {};

      this.moduleConfig = ko.observable({ view: [], viewModel: null });
      this.beanTree = ko.observable();
      this.navtreeDialog = {html: ko.observable({})};

      // START: knockout observables referenced in wdt-model-builder-view.html
      this.messages = ko.observableArray([]);
      this.messagesDataProvider = new ArrayDataProvider(this.messages);

      this.messagePosition = ko.observable({
        my: { vertical: 'top', horizontal: 'center' },
        at: { vertical: 'top', horizontal: 'center' },
        of: '#wdt-model-builder-container'
      });
      // END: knockout observables referenced in wdt-model-builder-view.html

      this.signalBindings = [];

      /**
       * <p>NOTE: You need to use "function() {...}.bind(this);", as opposed to "() => {...};", here :-)</>
       */
      this.connected = function(context) {

        this.setBusyContext();

        this.busyContext.whenReady()
          .then(() => {
            const resolve = this.addBusyState();
            Controller.setRoutes({
              "modeling/{path}": { label: "Modeling", value: "modeling", title: Runtime.getName() }
            });
            // Set the runtime property associated with the WRC-CFE's
            // application name. This needs to be done, because the
            // WRC-CFE uses that runtime property to set the Window
            // title. Normally, it is obtained from a WRC-CFE's config
            // file (wrc-frontend/config/console-frontend-jet.yaml), but
            // here we get it from a builder property.
            Runtime.setProperty(Runtime.PropertyName.CFE_NAME, context.properties.windowTitle);
            // Set runtime role based on value assigned to data-runtime-role
            // attribute.
            const ele = document.getElementById("wdt-model-builder-container");
            Runtime.setProperty(Runtime.PropertyName.CFE_ROLE, ele.getAttribute("data-runtime-role"));
            resolve();
          });

        let binding = signaling.popupMessageSent.add((message, autoTimeout) => {
          if (!message) {
            this.messages.removeAll();
          }
          else {
            if (CoreUtils.isNotUndefinedNorNull(message.severity) && ["confirmation", "info"].includes(message.severity) ) {
              message.autoTimeout = autoTimeout || 1500;
              const value = parseInt(message.autoTimeout);
              if (isNaN(value) || message.autoTimeout < 1000 || message.autoTimeout > 60000) {
                message.autoTimeout = 1500;
              }
            }
            this.messages.push(message);
          }
        });

        this.signalBindings.push(binding);

        binding = signaling.changesAutoDownloaded.add((dataProvider, modelContent) => {
          if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
            const params = {
              'bubbles': true,
              'detail': {'value': modelContent }
            };
            context.element.dispatchEvent(new CustomEvent('changesAutoDownloaded', params));
          }
        });

        this.signalBindings.push(binding);

      }.bind(this);

      /**
       * <p>NOTE: You need to use "function() {...}.bind(this);", as opposed to "() => {...};", here :-)</>
       */
      this.disconnected = function() {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      this.setBusyContext = () => {
        self.busyContext = Context.getContext(context.element).getBusyContext();
      };

      this.addBusyState = () => {
        const options = {"description": "WDT Model Builder - Waiting for data"};
        return self.busyContext.addBusyState(options);
      };

      this.createProvider = (name, fileContents) => {
        // Create entry from input parameters
        const entry = {name: name, file: name, fileContents: fileContents};
        // Use DataProviderManager to convert entry
        // into a DataProvider object.
        const dataProvider = DataProviderManager.createWDTModel(entry);
        // Set state of new dataProvider to "disconnected"
        dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
        // Use dataProvider to select (e.g. activate)
        // the provider in the WRC-CBE.
        selectWDTModel(dataProvider);
      };

      /**
       *
       * @param {DataProvider} dataProvider
       */
      this.deactivateProvider = (dataProvider) => {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          // Determine if dataProvider is in self.activatedProviders
          const index = self.activatedProviders.map(item => item.id).indexOf(dataProvider.id);
          if (index !== -1) {
            // It is, so go ahead and ask DataProviderManager
            // to deactivate (e.g. remove) session for it.
            DataProviderManager.removeWDTModel(self.activatedProviders[index])
              .then(result => {
                if (result.succeeded) {
                  // DataProviderManager was able to successfully
                  // deactivate the provider, so use filter to
                  // remove it from self.activatedProviders
                  self.activatedProviders = self.activatedProviders.filter(item => item.id !== result.data.id);
                  const params = {
                    'bubbles': true,
                    'detail': {'value': result }
                  };
                  context.element.dispatchEvent(new CustomEvent('providerDeactivated', params));
                }
              });
          }
        }
      };

      function handleProviderActivated(dataProvider) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          // Other parts of the WRC-CFE get the id of the
          // "last activated provider" from the WRC_CFE
          // runtime environment, so we want to go ahead
          // and update that before proceeding.
          Runtime.setDataProviderId(dataProvider.id);

          // Mimic what gallery.js does with beanTree object.
          dataProvider.beanTrees[0]["provider"] = {id: dataProvider.id, name: dataProvider.name};
          // Create reference to the modified beanTree object.
          self.beanTree(dataProvider.beanTrees[0]);

          // Create <navtree-dialog> element programmatically,
          // because navtree-manager.js needs the actual
          // beanTree, not a placeholder.
          const outerHTML = Controller.createNavtreeDialogHTML();
          self.navtreeDialog.html({ view: HtmlUtils.stringToNodeArray(outerHTML), data: self });
          const active = PerspectiveManager.activate("modeling");
          signaling.navtreeLoaded.dispatch(active);

          const perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(self.beanTree().type);
          const resourceDataFragment = (perspectiveMemory.navtree.resourceDataFragment !== null ? perspectiveMemory.navtree.resourceDataFragment : context.properties.resourceDataFragment);

          // Use self.beanTree to create string that will be
          // the resourceData used to render the page, initially
          // displayed in the builder.
          const resourceData = self.beanTree().navtree.replace("navtree", resourceDataFragment);
          // Create the parameter that will be the "path"
          // part of the "/modeling/{path}" route.
          Controller.getRootRouter().observableModuleConfig().params.ojRouter.parameters["path"] = ko.observable(encodeURIComponent(resourceData));
          // Use a go() to set the stateId of the router.
          Controller.getRootRouter().go("/modeling/" + encodeURIComponent(resourceData));
          // Load the "modeling" module
          Controller.loadModule("modeling")
            .then(moduleConfigPromise => {
              // Update <oj-module> with the JS module for
              // the "modeling" perspective.
              self.moduleConfig(moduleConfigPromise);
              const params = {
                'bubbles': true,
                'detail': {'value': dataProvider }
              };
              context.element.dispatchEvent(new CustomEvent('providerActivated', params));

              // For now, the cache of activated providers is
              // being managed by the WDT Model Builder, so go
              // ahead and add the activated provider to it.
              const index = self.activatedProviders.map(item => item.id).indexOf(dataProvider.id);
              if (index === -1) self.activatedProviders.push(dataProvider);
            });
        }
      }

      function getWDTModelFormData(dataProvider) {
        const formData = new FormData();
        // Add multipart section for model file, using
        // "model" as the part name.
        formData.append(
          'model',
          JSON.stringify(dataProvider["fileContents"])
        );
        // Add multipart section for data, using "data" as
        // the part name.
        formData.append(
          'data',
          JSON.stringify({
            name: dataProvider.id,
            providerType: "WDTModel"
          })
        );

        return formData;
      }

      function readWDTModelFile(dataProvider, blob) {
        return new Promise((resolve, reject) => {
          // Declare reader for reading model file.
          const reader = new FileReader();

          // Callback that will be called when the
          // reader.readAsText() function is called.
          // The blob argument will contain the
          // File/Blob object for the model file.
          reader.onload = (function (theBlob) {
            return function (event) {
              DataProviderManager.getWDTModelContent(event.target.result, blob.type)
                .then(reply => {
                  resolve(reply);
                })
                .catch(failure => {
                  reject(failure);
                });
            };
          })(blob);

          // Read in model file as a data URL.
          reader.readAsText(blob);
        });
      }

      async function uploadWDTModelFile(dataProvider) {
        const reply = await readWDTModelFile(dataProvider, self.modelFiles[dataProvider.id])
        dataProvider["fileContents"] = reply.body.data;
        return getWDTModelFormData(dataProvider);
      }

      function sendWDTModelFormData(dataProvider, formData) {
        DataProviderManager.uploadWDTModel(dataProvider, formData)
          .then(reply => {
            dataProvider.populateFromResponse(reply.body.data);
            handleProviderActivated(dataProvider);
          })
          .catch(response => {
            dataProvider.file = "";
            dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            delete dataProvider["fileContents"];
            if (CoreUtils.isError(response)) {
              response["failureReason"] = response;
            }
          });
      }

      function createWDTFileBlob(dataProvider) {
        const blob = self.modelFiles[dataProvider.id];
        if (CoreUtils.isNotUndefinedNorNull(blob)) {
          uploadWDTModelFile(dataProvider)
            .then(formData => {
              sendWDTModelFormData(dataProvider, formData);
              delete self.modelFiles[dataProvider.id];
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
      }

      function selectWDTModel(dataProvider) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          if (CoreUtils.isNotUndefinedNorNull(dataProvider.fileContents)) {
            // We're not connected, but we have the file contents.
            const blob = self.modelFiles[dataProvider.id];
            if (CoreUtils.isUndefinedOrNull(blob)) {
              const formData = getWDTModelFormData(dataProvider);
              sendWDTModelFormData(dataProvider, formData);
              delete self.modelFiles[dataProvider.id];
            }
          }
          else {
            createWDTFileBlob(dataProvider);
          }
        }
      }

    }

    WdtModelBuilderComposite.prototype = {
      _createProvider: function(name, fileContents) {
        this.createProvider(name, fileContents);
      },
      _deactivateProvider: function(dataProvider) {
        this.deactivateProvider(dataProvider);
      }
    };

    return WdtModelBuilderComposite;
  });