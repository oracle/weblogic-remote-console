/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'wrc-frontend/integration/controller', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/provider-management/data-provider', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/parsers/yaml', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'wrc-frontend/integration/panel_resizer', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmessages', 'ojs/ojmodule', 'ojs/ojbinddom'],
  function (oj, ko, ArrayDataProvider, HtmlUtils, Controller, PerspectiveManager, PerspectiveMemoryManager, DataProviderManager, DataProvider, MessageDisplaying, YamlParser, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {

    function WdtModelDesignerComposite(context) {
      const self = this;

      this.i18n = {
        buttons: {
          yes: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.yes.label')
          },
          no: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.no.label')
          },
          ok: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.ok.label')
          },
          cancel: {
            disabled: false,
            visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
          }
        },
        images: {
          preloader: {
            iconFile: 'preloader-rounded-blocks-grn_12x64x64'
          }
        },
        dialog: {
          title: ko.observable(''),
          instructions: ko.observable(''),
          prompt: ko.observable('')
        }
      };

      const signaling = Controller.getSignaling();

      this.activatedProviders = [];
      this.modelFiles = {};

      this.moduleConfig = ko.observable({view: [], viewModel: null});
      this.beanTree = ko.observable();
      this.navtree = {html: ko.observable({})};

      // START: knockout observables referenced in wdt-model-designer-view.html
      this.readonly = ko.observable(typeof context.properties.readonly !== 'undefined' ? context.properties.readonly: false);
      this.popupMessage = {
        category: ko.observable(),
        summary: ko.observable(),
        detail: ko.observable()
      };
      this.messages = ko.observableArray([]);
      this.messagesDataProvider = new ArrayDataProvider(this.messages);

      this.messagePosition = ko.observable({
        my: {vertical: 'top', horizontal: 'center'},
        at: {vertical: 'top', horizontal: 'center'},
        of: '#wdt-model-designer-container'
      });
      // END: knockout observables referenced in wdt-model-designer-view.html

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory('modeling');

      this.signalBindings = [];

      this.connected = function (context) {
        this.setBusyContext();

        this.busyContext.whenReady()
          .then(() => {
            const resolve = this.addBusyState();
            Controller.setRoutes({
              'modeling/{path}': {label: 'Modeling', value: 'modeling'}
            });
            // Set runtime role based on value assigned to data-runtime-role
            // attribute.
            const container = document.getElementById('wdt-model-designer-container');

            if (container !== null) {
              // div#wdt-model-designer-container is a horizontal splitter,
              // which uses a little JQuery extension we wrote called
              // panel_resizer. We need to invoke the "spllit" method on
              // that, before proceeding.
              $('#wdt-model-designer-container').split({limit: 10});
              // See the runtime role using the "data-runtime-role" attribute
              // that's on the div#wdt-model-designer-container element. We need
              // to do that, because the runtime role drives logic used in the
              // module that make up the wrc-frontend JET Pack.
              Runtime.setProperty(Runtime.PropertyName.CFE_ROLE, container.getAttribute('data-runtime-role'));
              container.setAttribute('offsetHeight', container.parentElement.offsetHeight);
              $('#navtree-container').css({
                'display': 'inline-flex',
                'width': self.perspectiveMemory.navtree.width
              });
              $('#table-form-container').css({
                'display': 'inline-flex'
              });
            }

            self.modelConsole = document.querySelector('div.wkt-right-pane > oj-collapsible');
            new ResizeObserver(() => {
              if (self.modelConsole) {
                signaling.modelConsoleSizeChanged.dispatch(self.modelConsole.offsetHeight);
              }
            }).observe(self.modelConsole);

            ViewModelUtils.setCustomCssProperty('paging-bottom', '5rem');
            resolve();
          });

        let binding = signaling.popupMessageSent.add((message, autoTimeout) => {
          if (CoreUtils.isNotUndefinedNorNull(message.blocking)) {
            this.popupMessage.category(message.category);
            this.popupMessage.summary(message.summary);
            this.popupMessage.detail(message.detail);
            const popup = document.getElementById('wdt-model-designer-popup');
            popup.open('#wdt-model-designer-container');
          }
          else {
            this.messages([]);
            if (CoreUtils.isNotUndefinedNorNull(message.severity) && ['confirmation', 'info'].includes(message.severity)) {
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

        binding = signaling.formSliceSelected.add((selectedSlice) => {
          if (selectedSlice.path) {
            const delimPos = selectedSlice.path.indexOf('/data/');
            if (delimPos !== -1) {
              self.perspectiveMemory.contentPage.resourceDataFragment = selectedSlice.path.substring(delimPos + 1);
              self.perspectiveMemory.contentPage.slices = [];
            }
          }
          if (selectedSlice.current) {
            self.perspectiveMemory.contentPage.slices.push(selectedSlice.current);
          }
        });

        this.signalBindings.push(binding);

        binding = signaling.changesAutoDownloaded.add((dataProvider, modelContent) => {
          if (dataProvider && dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {

            YamlParser.parse(modelContent)
              .then(fileContents => {
                const injectDomainInfoProps = modelContent.replace(/\s/g, '') === context.properties.modelTemplate.domain.replace(/\s/g, '');
                const index = dataProvider.modelProperties.map(property => property.Name).indexOf('WebLogicAdminUserName');
                if (index === -1 &&  injectDomainInfoProps){
                  modelContent = '';
                }
                dataProvider['fileContents'] = fileContents;
                getModelProperties(dataProvider, (dataProvider.hadEmptyModelContents ? !injectDomainInfoProps : !dataProvider.hadEmptyModelContents ))
                  .then(reply => {
                    dataProvider['modelProperties'] = (CoreUtils.isUndefinedOrNull(reply.body.data)  ? [] : reply.body.data);
                    const params = {
                      'bubbles': true,
                      'detail': {'value': modelContent, 'properties': dataProvider.modelProperties}
                    };
                    context.element.dispatchEvent(new CustomEvent('changesAutoDownloaded', params));
                  });
              })
              .catch(error => {
                ViewModelUtils.failureResponseDefaultHandling(error);
              });
          }
        });

        this.signalBindings.push(binding);

        binding = signaling.modelArchiveUpdated.add((dataProvider, options) => {
          if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
            const params = {
              'bubbles': true,
              'detail': { 'options': options}
            };
            context.element.dispatchEvent(new CustomEvent('archiveUpdated', params));
          }
        });

        this.signalBindings.push(binding);

        binding = signaling.backendConnectionRefused.add((source, backendUrl) => {
          const params = {
            'bubbles': true,
            'detail': {'value': backendUrl}
          };
          context.element.dispatchEvent(new CustomEvent('connectionLostRefused', params));
        });

        this.signalBindings.push(binding);
      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => {
          binding.detach();
        });

        self.signalBindings = [];
      }.bind(this);

      this.propertyChanged = function (context) {
        switch (context.property) {
          case 'visible':
            $('#wdt-model-designer-container').css({'display': context.value ? 'inline-flex' : 'none'});
            break;
          case 'readonly':
            self.readonly(context.value);
        }
      };

      this.setBusyContext = () => {
        self.busyContext = Context.getContext(context.element).getBusyContext();
      };

      this.addBusyState = () => {
        const options = {'description': 'WDT Model Designer - Waiting for data'};
        return self.busyContext.addBusyState(options);
      };

      this.setBackendUrlPort = (urlPort) => {
        Runtime.setProperty('console-backend.url', `http://localhost:${urlPort}`);
        Logger.info(`[WDT-MODEL-DESIGNER] Runtime.getBackendUrl()=${Runtime.getBackendUrl()}`);
      };

      this.createProvider = (options) => {
        options['hadEmptyModelContents'] = (CoreUtils.isUndefinedOrNull(options.fileContents) || options.fileContents.trim() == '');

        if (options.hadEmptyModelContents) {
          options.fileContents = context.properties.modelTemplate.domain;
        }

        YamlParser.parse(options.fileContents)
          .then(data => {
            // Create entry from input parameters
            const entry = {name: options.name, file: options.name, fileContents: data};
            // Use DataProviderManager to convert entry
            // into a DataProvider object.
            const dataProvider = DataProviderManager.createWDTModel(entry);
            // Add hadEmptyModelContents to data provider
            dataProvider.putValue('hadEmptyModelContents', options.hadEmptyModelContents);
            // Add model properties to data provider
            dataProvider.putValue('modelProperties', options.modelProperties);
            // Add model archive to data provider
            dataProvider.putValue('modelArchive', options.modelArchive);
            // Set state of new dataProvider to "disconnected"
            dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            // Use dataProvider to select (e.g. activate)
            // the provider in the WRC-CBE.
            selectWDTModel(dataProvider);
          })
          .catch(failure => {
            let responseErrorMessages = [];
            failure = {failureReason: failure};
            if (failure?.failureReason?.name === 'YAMLException') {
              responseErrorMessages.push({
                detail: ViewModelUtils.getYAMLExceptionFailureMessage(failure)
              });
              responseErrorMessages.push({
                detail: oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.wktModelContent.detail')
              });
              MessageDisplaying.displayErrorMessagesHTML(
                responseErrorMessages,
                oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.wktModelContent.summary')
              );
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            }
          });
      };

      this.selectLastVisitedSlice = () => {
        if (CoreUtils.isNotUndefinedNorNull(self.perspectiveMemory.contentPage.slices)) {
          setTimeout(() => {
            const viewModel = self.moduleConfig().viewModel.wlsModuleConfig().viewModel;
            if (CoreUtils.isNotUndefinedNorNull(viewModel)) {
              const moduleConfigPromise = viewModel.formTabStripModuleConfig;
              if (CoreUtils.isNotUndefinedNorNull(moduleConfigPromise)) {
                moduleConfigPromise
                  .then(moduleConfig => {
                    if (CoreUtils.isNotUndefinedNorNull(moduleConfig.viewModel.tabDataProviders)) {
                      for (const slice of self.perspectiveMemory.contentPage.slices) {
                        if (moduleConfig.viewModel.tabDataProviders()[slice.level]) {
                          moduleConfig.viewModel.tabDataProviders()[slice.level].selection(slice.selection());
                        }
                        else {
                          moduleConfig.viewModel.updateSlice(slice, slice.level);
                        }
                      }
                      self.perspectiveMemory.contentPage.slices = [];
                    }
                  });
              }
            }
          }, 1000);
        }
      };

      this.resize = () => {
        $('#wdt-model-designer-container').css({
          'height': `${context.element.offsetHeight}px`
        });
        $('#navtree-container').css({
          'height': `${context.element.offsetHeight}px`,
          'max-height': `${context.element.offsetHeight}px`,
          'width': self.perspectiveMemory.navtree.width
        });
        $('#wdt-model-designer-content').css({
          'height': `${context.element.offsetHeight}px`,
          'max-height': `${context.element.offsetHeight}px`,
          'width': '100%'
        });
        $('#content-area-container').css({
          'height': `${context.element.offsetHeight}px`,
          'max-height': `${context.element.offsetHeight}px`
        });
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
            const start = async (index) => {
              // It is, so go ahead and ask DataProviderManager
              // to deactivate (e.g. remove) session for it.
              const result = await DataProviderManager.removeWDTModel(self.activatedProviders[index]);
              if (result.succeeded) {
                // DataProviderManager was able to successfully
                // deactivate the provider, so use filter to
                // remove it from self.activatedProviders
                self.activatedProviders = self.activatedProviders.filter(item => item.id !== result.data.id);
                const params = {
                  'bubbles': true,
                  'detail': {'value': result}
                };
                context.element.dispatchEvent(new CustomEvent('providerDeactivated', params));
              }
            };
            start(index).then();
          }
        }
      };

      this.getModelChanges = (dataProvider) => {
        return DataProviderManager.downloadWDTModel(dataProvider);
      };

      this.search = (searchValue) => {
        const dataprovider = DataProviderManager.getLastActivatedDataProvider();
        DataProviderManager.searchWDTModel(dataprovider, searchValue)
          .then(result =>{
            if (CoreUtils.isNotUndefinedNorNull(result.messages)) {
              MessageDisplaying.displayResponseMessages(result.messages);
            }
            if (CoreUtils.isNotUndefinedNorNull(result.failure)) {
              ViewModelUtils.failureResponseDefaultHandling(result.failure);
            }
            if ((result.succeeded) && CoreUtils.isNotUndefinedNorNull(result.data)) {
              Controller.getRootRouter().go(result.data);
            }
          })
          .catch(error => {
            ViewModelUtils.failureResponseDefaultHandling(error.failure);
          });
      };

      this.setConsoleState = (value) =>{
        signaling.consoleStateChange.dispatch(value);
      };

      this.closeIconListener = (event) => {
        const popup = document.getElementById('wdt-model-designer-popup');
        popup.close();
      };

      async function getModelProperties(dataProvider, injectDomainInfoProps=true) {
        const reply = {body: {data: (injectDomainInfoProps ? dataProvider.modelProperties : undefined )}};
        if (reply.body.data) {
          // dataProvider.modelProperties wasn't undefined or nullt
          if (reply.body.data.length === 0 && dataProvider.hadEmptyModelContents) {
            reply.body.data = [
              {'uid': 0, 'Name': 'WebLogicAdminUserName', 'Value': '', Override: undefined},
              {'uid': 1, 'Name': 'WebLogicAdminPassword', 'Value': '', Override: undefined}
            ];
          }
          else {
            const adminUserName = dataProvider?.fileContents?.domainInfo?.AdminUserName;
            if (adminUserName && adminUserName === '@@PROP:WebLogicAdminUserName@@') {
              const index = dataProvider.modelProperties.map(property => property.Name).indexOf('WebLogicAdminUserName');
              if (index === -1) addModelProperty(reply.body.data, 'WebLogicAdminUserName');
            }
            // FortifyIssueSuppression Password Management: Hardcoded Password
            // Not a password, just a variable name
            const adminPassword = dataProvider?.fileContents?.domainInfo?.AdminPassword;
            // FortifyIssueSuppression Password Management: Hardcoded Password
            // Not a password, just a variable name
            if (adminPassword && adminPassword === '@@PROP:WebLogicAdminPassword@@') {
              const index = dataProvider.modelProperties.map(property => property.Name).indexOf('WebLogicAdminPassword');
              if (index === -1) addModelProperty(reply.body.data, 'WebLogicAdminPassword');
            }
          }
        }
        return Promise.resolve(reply);
      }

      function getNextUID(properties) {
        let uid = -1;
        properties.forEach((property) => {
          if (property.uid > uid) uid = property.uid;
        });
        return ++uid;
      }

      function addModelProperty(modelProperties, propertyName, propertyValue = '') {
        if (modelProperties) {
          const index = modelProperties.map(property => property.Name).indexOf(propertyName);
          if (index === -1) {
            const property = {
              uid: getNextUID(modelProperties),
              Name: propertyName,
              Value: propertyValue,
              Override: undefined
            };
            modelProperties.push(property);
          }
        }
      }

      function removeModelProperty(modelProperties, propertyName) {
        if (CoreUtils.isNotUndefinedNorNull(propertyName)) {
          if (modelProperties) {
            const index = modelProperties.map(property => property.Name).indexOf(propertyName);
            if (index !== -1) {
              modelProperties.splice(index, 1);
            }
          }
        }
      }

      function displayResourceDataFragment(dataProvider) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          // Other parts of the WRC-CFE get the id of the
          // "last activated provider" from the WRC_CFE
          // runtime environment, so we want to go ahead
          // and update that before proceeding.
          Runtime.setDataProviderId(dataProvider.id);

          // Mimic what gallery.js does with beanTree object.
          dataProvider.beanTrees[0]['provider'] = {id: dataProvider.id, name: dataProvider.name};
          // Create reference to the modified beanTree object.
          self.beanTree(dataProvider.beanTrees[0]);

          // Create <cfe-navtree> element programmatically,
          // because navtree-manager.js needs the actual
          // beanTree, not a placeholder.
          const outerHTML = Controller.createNavtreeHTML();
          self.navtree.html({view: HtmlUtils.stringToNodeArray(outerHTML), data: self});
          const active = PerspectiveManager.activate('modeling');
          signaling.navtreeLoaded.dispatch(active);

          const resourceDataFragment = (self.perspectiveMemory.contentPage.resourceDataFragment !== null ? self.perspectiveMemory.contentPage.resourceDataFragment : context.properties.resourceDataFragment);
          // Use self.beanTree to create string that will be
          // the resourceData used to render the page, initially
          // displayed in the wdt-model-designer.
          const resourceData = self.beanTree().navtree.replace('navtree', resourceDataFragment);
          // Create the parameter that will be the "path"
          // part of the "/modeling/{path}" route.
          Controller.getRootRouter().observableModuleConfig().params.ojRouter.parameters['path'] = ko.observable(encodeURIComponent(resourceData));
          // Use a go() to set the stateId of the router.
          Controller.getRootRouter().go('/modeling/' + encodeURIComponent(resourceData));
          // Set cursor to BUSY
        }
      }

      function handleProviderActivated(dataProvider) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          displayResourceDataFragment(dataProvider);
          ViewModelUtils.setPreloaderVisibility(true);
          // Load the "modeling" module
          Controller.loadModule('modeling')
            .then(moduleConfigPromise => {
              // Update <oj-module> with the JS module for
              // the "modeling" perspective.
              self.moduleConfig(moduleConfigPromise);
              const params = {
                'bubbles': true,
                'detail': {'value': dataProvider}
              };
              context.element.dispatchEvent(new CustomEvent('providerActivated', params));

              // For now, the cache of activated providers is
              // being managed by the WDT Model Designer, so go
              // ahead and add the activated provider to it.
              const index = self.activatedProviders.map(item => item.id).indexOf(dataProvider.id);
              if (index === -1) self.activatedProviders.push(dataProvider);
            })
            .finally(() => {
              ViewModelUtils.setPreloaderVisibility(false);
            });
        }
      }

      function getWDTModelFormData(dataProvider) {
        const formData = new FormData();
        // Add multipart section for model file, using
        // "model" as the part name.
        formData.append(
          'model',
          JSON.stringify(dataProvider['fileContents'])
        );
        // Add multipart section for data, using "data" as
        // the part name.
        formData.append(
          'data',
          JSON.stringify({
            name: dataProvider.id,
            providerType: 'WDTModel'
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
        dataProvider['fileContents'] = reply.body.data;
        return getWDTModelFormData(dataProvider);
      }

      function sendWDTModelFormData(dataProvider, formData) {
        DataProviderManager.uploadWDTModel(dataProvider, formData)
          .then(reply => {
            dataProvider.populateFromResponse(reply.body.data);
            handleProviderActivated(dataProvider);
          })
          .catch(response => {
            dataProvider.file = '';
            dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            delete dataProvider['fileContents'];
            let responseErrorMessages = [];
            const correctiveAction = oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.wktModelContent.detail');
            if (CoreUtils.isError(response)) {
              responseErrorMessages.push({detail: response});
              responseErrorMessages.push({detail: correctiveAction});
            }
            else {
              const details = [];
              response.body.messages.forEach((message) => {
                responseErrorMessages.push({detail: message.message});
              });
              responseErrorMessages.push({detail: correctiveAction});
            }
            MessageDisplaying.displayErrorMessagesHTML(
              responseErrorMessages,
              oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.wktModelContent.summary')
            );
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

    WdtModelDesignerComposite.prototype = {
      _createProvider: function (options) {
        this.createProvider(options);
      },
      _deactivateProvider: function (dataProvider) {
        this.deactivateProvider(dataProvider);
      },
      _selectLastVisitedSlice: function () {
        this.selectLastVisitedSlice();
      },
      _resize: function () {
        this.resize();
      },
      _setBackendUrlPort: function (urlPort) {
        this.setBackendUrlPort(urlPort);
      }
    };

    return WdtModelDesignerComposite;
  }
);
