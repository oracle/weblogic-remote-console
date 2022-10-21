/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['js-yaml', 'wrc-frontend/microservices/common/id-generator', './data-provider', 'wrc-frontend/microservices/connection-management/domain-connection-manager', 'wrc-frontend/apis/data-operations', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (parser, IdGenerator, DataProvider, DomainConnectionManager, DataOperations, Runtime, CoreTypes, CoreUtils, Logger) {
    var dataproviders = [];

    /**
     *
     * @param {{id: string, name: string, type: string, beanTrees?: [BeanTree]}} entry
     * @returns {DataProvider}
     * @private
     */
    function addDataProvider(entry) {
      let newDataProvider;
      if (CoreUtils.isNotUndefinedNorNull(entry) && CoreUtils.isNotUndefinedNorNull(entry.id)) {
        const index = dataproviders.map(dataProvider => dataProvider.id).indexOf(entry.id);
        if (index === -1) {
          // This means that there was no match on entry.id
          // or entry.name, so create a new data provider and
          // add it to module-scoped dataproviders array.
          newDataProvider = new DataProvider(entry.id, entry.name, entry.type, entry.beanTrees || []);
          dataproviders.push(newDataProvider);
        }
        else {
          // Found an existing data provider with the same
          // id or name, so just return that.
          newDataProvider = dataproviders[index];
        }
      }

      return newDataProvider;
    }

    function removeDataProviderById(id) {
      if (CoreUtils.isNotUndefinedNorNull(id)) {
        const index = dataproviders.map(dataProvider => dataProvider.id).indexOf(id);
        if (index !== -1) {
          dataproviders.splice(index, 1);
        }
      }
    }

    return {
      // FortifyIssueSuppression(73D8764C3FE4B3A7E67ABBE65E55FFA5) Password Management: Password in Comment
      // Not a password, just an argument
      /**
       * <p><b>DON'T CALL THIS FUNCTION INSIDE A LOOP OR WHILE STATEMENT!!</b></p>
       * @param {{id?: string, name: string, type: string, url?: string, username?: string, password?: string, beanTrees?: [BeanTree]}} entry
       * @returns {DataProvider}
       */
      createAdminServerConnection: function(entry) {
        if (CoreUtils.isUndefinedOrNull(entry.id)) {
          if (!IdGenerator.exists(DataProvider.prototype.Type.ADMINSERVER.name)) {
            IdGenerator.create(DataProvider.prototype.Type.ADMINSERVER.name);
          }
          entry.id = `${IdGenerator.getNextId(DataProvider.prototype.Type.ADMINSERVER.name)}`;
        }

        const dataProvider = addDataProvider({id: entry.id, name: entry.name, type: entry.type, beanTrees: entry.beanTrees});
        if (CoreUtils.isNotUndefinedNorNull(entry.url)) dataProvider['url'] = entry.url;
        if (CoreUtils.isNotUndefinedNorNull(entry.username)) dataProvider['username'] = entry.username;
        if (CoreUtils.isNotUndefinedNorNull(entry.password)) dataProvider['password'] = entry.password;
        if (CoreUtils.isNotUndefinedNorNull(entry.username)) dataProvider['token'] = entry.token;
        if (CoreUtils.isNotUndefinedNorNull(entry.username)) dataProvider['expires'] = entry.expires;
        return dataProvider;
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      activateAdminServerConnection: async function(dataProvider) {
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          const isDeactivatedDataProvider = CoreUtils.isUndefinedOrNull(this.getDataProviderById(dataProvider.id));
          if (isDeactivatedDataProvider) {
            // We're working with a deactivated data provider. The entry
            // has been removed from the dataproviders map, but it has
            // everything needed to add it back.
            const entry = {
              id: dataProvider.id,
              name: dataProvider.name,
              type: dataProvider.type,
              beanTrees: dataProvider.beanTrees,
              url: dataProvider.url,
              username: dataProvider.username,
              password: dataProvider.password,
              token: dataProvider.token,
              expires: dataProvider.expires
            };
            // Add entry back into the dataproviders map
            dataProvider = this.createAdminServerConnection(entry);
          }
          const reply = await DomainConnectionManager.createConnection(dataProvider);
          if (isDeactivatedDataProvider) {
            reply.body.data.id = dataProvider.id;
            reply.body.data.name = dataProvider.name;
            dataProvider.populateFromResponse(reply.body.data);
          }
          return Promise.resolve(reply);
        }
        else {
          const response = {
            failureType: CoreTypes.FailureType.UNEXPECTED,
            failureReason: new Error('Required parameter is missing or null: \'id\'')
          };
          return Promise.reject(response);
        }
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @returns {Promise<{succeeded: boolean, data: any, failure?: any}>}
       */
      removeAdminServerConnection: (dataProvider) => {
        return new Promise((resolve, reject) => {
          const result = {succeeded: false};
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (dataProvider.state === 'connected') {
              DomainConnectionManager.removeConnection(dataProvider)
                .then(reply => {
                  removeDataProviderById(dataProvider.id);
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result['failure'] = response;
                  reject(result);
                });
            }
            else {
              removeDataProviderById(dataProvider.id);
              result.succeeded = true;
              result.data = dataProvider;
              resolve(result);
            }
          }
          else {
            result['failure'] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required parameter is missing or null: \'id\'')
            };
            reject(result);
          }
        });
      },
      /**
       * <p><b>DON'T CALL THIS FUNCTION INSIDE A LOOP OR WHILE STATEMENT!!</b></p>
       * @param {{id?: string, name: string, file?: string, fileContents?: string, beanTrees?: [BeanTree]}} entry
       * @returns {DataProvider}
       */
      createWDTModel: function(entry) {
        if (CoreUtils.isUndefinedOrNull(entry.id)) {
          if (!IdGenerator.exists(DataProvider.prototype.Type.MODEL.name)) {
            IdGenerator.create(DataProvider.prototype.Type.MODEL.name);
          }
          entry.id = `${IdGenerator.getNextId(DataProvider.prototype.Type.MODEL.name)}`;
        }

        const dataProvider = addDataProvider({id: entry.id, name: entry.name, type: DataProvider.prototype.Type.MODEL.name, beanTrees: entry.beanTrees});
        if (CoreUtils.isNotUndefinedNorNull(entry.file)) dataProvider['file'] = entry.file;
        if (CoreUtils.isNotUndefinedNorNull(entry.fileContents)) dataProvider['fileContents'] = entry.fileContents;
        if (CoreUtils.isNotUndefinedNorNull(entry.propProvider)) dataProvider['propProvider'] = entry.propProvider;
        if (CoreUtils.isNotUndefinedNorNull(entry.properties)) dataProvider['properties'] = entry.properties;
        return dataProvider;
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @param {FormData} formData
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      uploadWDTModel: async function(dataProvider, formData) {
        return DataOperations.model.createModel(dataProvider.id, formData);
      },
      /**
       *
       * @param {DataProvider} dataProvider
       */
      downloadWDTModel: function(dataProvider) {
        return DataOperations.model.downloadModel(dataProvider);
      },
      /**
       * @param {DataProvider} dataProvider
       * @param {string} searchValue
       * @returns {Promise<{succeeded: boolean, data?: string, messages?: [string], failure?: any}>}
       */
      searchWDTModel: function(dataProvider, searchValue) {
        return new Promise((resolve, reject) => {
          const result = {succeeded: false};
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              // Collect the simple search information and check if the search can be performed
              const searchUrl = dataProvider.beanTrees[0].simpleSearch;
              const searchPerspective = dataProvider.beanTrees[0].type;
              if (CoreUtils.isNotUndefinedNorNull(searchUrl) && CoreUtils.isNotUndefinedNorNull(searchValue) && (searchValue.length > 0)) {
                // Issue the search request and handle the results
                DataOperations.mbean.simpleSearch(searchUrl, searchValue)
                  .then(reply => {
                    result.succeeded = true;

                    // Check for messages to display about the search
                    if (CoreUtils.isNotUndefinedNorNull(reply.body.messages) && (reply.body.messages.length > 0)) {
                      result['messages'] = reply.body.messages;
                    }

                    // Provide the location of the search for routing
                    if (CoreUtils.isNotUndefinedNorNull(reply.body.data.resourceData)) {
                      const encodedResouceData = encodeURIComponent(reply.body.data.resourceData.resourceData);
                      result['data'] = ('/' + searchPerspective + '/' + encodedResouceData);
                    }
                    resolve(result);
                  })
                  .catch(response => {
                    // Check for messages to display about the search failure
                    if ((response.failureType === CoreTypes.FailureType.CBE_REST_API) &&
                      CoreUtils.isNotUndefinedNorNull(response.body.messages) && (response.body.messages.length > 0)) {
                      result['messages'] = response.body.messages;
                    }
                    else {
                      // Otherwise set the failure
                      result['failure'] = response;
                    }
                    // Resolve the promise so the caller can display messages or handle failure
                    resolve(result);
                  });
              }
            }
            else {
              // Resolve the promise wihtout any search
              resolve(result);
            }
          }
          else {
            result['failure'] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required parameter is missing or null: \'id\'')
            };
            reject(result);
          }
        });
      },
      /**
       * Returns fulfilled Promise with JSON
       * @param {Blob} data
       * @param {string} [mediaType="application/x-yaml"]
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      getWDTModelContent: function(data, mediaType) {
        return new Promise((resolve, reject) => {
          if (!mediaType || mediaType === '') mediaType = 'application/x-yaml';
          const reply = {
            body: {
              messages: []
            }
          };
          // WDT models can be .yaml files or .json files. They
          // are typically .yaml, because it results in smaller
          // files. Our CBE support for WDT models currently only
          // support JSON format, so the contents of a .yaml WDT
          // model needs to be converted to JSON before doing a
          // multipart POST.
          if (mediaType.indexOf('yaml') !== -1) {
            try {
              reply.body['data'] = parser.load(data);
              resolve(reply);
            }
            catch(err) {
              reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
              reply['failureReason'] = err;
              reject(reply);
            }
          }
          else if (mediaType.indexOf('json') !== -1) {
            try {
              reply.body['data'] = JSON.parse(data);
              resolve(reply);
            }
            catch(err) {
              reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
              reply['failureReason'] = err;
              reject(reply);
            }
          }
          else if (mediaType.indexOf('plain') !== -1) {
            try {
              reply.body['data'] = { contents: data };
              resolve(reply);
            }
            catch(err) {
              reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
              reply['failureReason'] = err;
              reject(reply);
            }
          }
          else {
            reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
            reply['failureReason'] = new Error(`Unsupported media type: ${mediaType}`);
            reject(reply);
          }
        });
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @param {string} propertyListProviderId
       * @returns {Promise<{succeeded: boolean, data: any}|*>}
       */
       updatePropertyListWDTModel: function(dataProvider, propertyListProviderId) {
        return new Promise((resolve, reject) => {
          const result = {succeeded: false};
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              DataOperations.model.updatePropertyList(dataProvider.id, propertyListProviderId)
                .then(reply => {
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result['failure'] = response;
                  reject(result);
                });
            }
            else {
              result.succeeded = true;
              result.data = dataProvider;
              resolve(result);
            }
          }
          else {
            result['failure'] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required dataprovider parameter is missing or null: \'id\'')
            };
            reject(result);
          }
        });
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @returns {Promise<{succeeded: boolean, data: any}|*>}
       */
      removeWDTModel: function(dataProvider) {
        return new Promise((resolve, reject) => {
          const result = {succeeded: false};
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              DataOperations.model.removeModel(dataProvider.id)
                .then(reply => {
                  removeDataProviderById(dataProvider.id);
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result['failure'] = response;
                  reject(result);
                });
            }
            else {
              removeDataProviderById(dataProvider.id);
              result.succeeded = true;
              result.data = dataProvider;
              resolve(result);
            }
          }
          else {
            result['failure'] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required parameter is missing or null: \'id\'')
            };
            reject(result);
          }
        });
      },
      /**
       * <p><b>DON'T CALL THIS FUNCTION INSIDE A LOOP OR WHILE STATEMENT!!</b></p>
       * @param {{id?: string, name: string, type: string, models?: [string], beanTrees?: [BeanTree]}} entry
       * @returns {DataProvider}
       */
      createWDTCompositeModel: function(entry) {
        if (CoreUtils.isUndefinedOrNull(entry.id)) {
          if (!IdGenerator.exists(DataProvider.prototype.Type.COMPOSITE.name)) {
            IdGenerator.create(DataProvider.prototype.Type.COMPOSITE.name);
          }
          entry.id = `${IdGenerator.getNextId(DataProvider.prototype.Type.COMPOSITE.name)}`;
        }

        const dataProvider = addDataProvider({id: entry.id, name: entry.name, type: entry.type, beanTrees: entry.beanTrees});
        if (CoreUtils.isNotUndefinedNorNull(entry.modelProviders)) dataProvider['modelProviders'] = entry.modelProviders;
        if (CoreUtils.isNotUndefinedNorNull(entry.models)) dataProvider['models'] = entry.models;
        return dataProvider;
      },
      /**
       * Activate the WDT Composite Model dataprovider
       * @param {DataProvider} dataProvider
       * @returns {Promise<{succeeded: boolean, data: any, failure?: any}>}
       */
      activateWDTCompositeModel: function(dataProvider) {
        return new Promise((resolve, reject) => {
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (CoreUtils.isUndefinedOrNull(this.getDataProviderById(dataProvider.id))) {
              // We're working with a deactivated data provider. The entry
              // has been removed from the dataproviders map, but it has
              // everything needed to add it back.
              const entry = {
                id: dataProvider.id,
                name: dataProvider.name,
                type: dataProvider.type,
                beanTrees: dataProvider.beanTrees
              };
              // Add entry back into the dataproviders map
              dataProvider = this.createWDTCompositeModel(entry);
            }
            DataOperations.composite.createComposite(dataProvider)
              .then(reply => {
                DataOperations.composite.useComposite(dataProvider)
                  .then(reply => {
                     resolve(reply);
                  })
                  .catch(response => {
                    reject(response);
                  });
              })
              .catch(response => {
                reject(response);
              });
          }
          else {
            const response = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required parameter is missing or null: \'dataProvider\'')
            };
            reject(response);
          }
        });
      },
      /**
       * Remove the WDT Composite Model dataprovider
       * @param {DataProvider} dataProvider
       * @returns {Promise<{succeeded: boolean, data: any, failure?: any}>}
       */
      removeWDTCompositeModel: function(dataProvider) {
        return new Promise((resolve, reject) => {
          const result = {succeeded: false};
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              DataOperations.composite.removeComposite(dataProvider.id)
                .then(reply => {
                  removeDataProviderById(dataProvider.id);
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result['failure'] = response;
                  reject(result);
                });
             }
             else {
              removeDataProviderById(dataProvider.id);
              result.succeeded = true;
              result.data = dataProvider;
              resolve(result);
             }
          }
          else {
            result['failure'] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required parameter is missing or null: \'dataProvider\'')
            };
            reject(result);
          }
        });
      },
      /**
       * <p><b>DON'T CALL THIS FUNCTION INSIDE A LOOP OR WHILE STATEMENT!!</b></p>
       * @param {{id?: string, name: string, file?: string, fileContents?: string, beanTrees?: [BeanTree]}} entry
       * @returns {DataProvider}
       */
       createPropertyList: function(entry) {
        if (CoreUtils.isUndefinedOrNull(entry.id)) {
          if (!IdGenerator.exists(DataProvider.prototype.Type.PROPERTIES.name)) {
            IdGenerator.create(DataProvider.prototype.Type.PROPERTIES.name);
          }
          entry.id = `${IdGenerator.getNextId(DataProvider.prototype.Type.PROPERTIES.name)}`;
        }

        const dataProvider = addDataProvider({id: entry.id, name: entry.name, type: DataProvider.prototype.Type.PROPERTIES.name, beanTrees: entry.beanTrees});
        if (CoreUtils.isNotUndefinedNorNull(entry.file)) dataProvider['file'] = entry.file;
        if (CoreUtils.isNotUndefinedNorNull(entry.fileContents)) dataProvider['fileContents'] = entry.fileContents;
        return dataProvider;
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @returns {Promise<{succeeded: boolean, data: any}|*>}
       */
       removePropertyList: function(dataProvider) {
        return new Promise((resolve, reject) => {
          const result = {succeeded: false};
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              DataOperations.properties.removePropertyList(dataProvider.id)
                .then(reply => {
                  removeDataProviderById(dataProvider.id);
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result['failure'] = response;
                  reject(result);
                });
            }
            else {
              removeDataProviderById(dataProvider.id);
              result.succeeded = true;
              result.data = dataProvider;
              resolve(result);
            }
          }
          else {
            result['failure'] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required parameter is missing or null: \'id\'')
            };
            reject(result);
          }
        });
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @param {FormData} formData
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
       uploadPropertyList: async function(dataProvider, formData) {
        return DataOperations.properties.createPropertyList(dataProvider.id, formData);
      },
      /**
       *
       * @param {DataProvider} dataProvider
       */
      downloadPropertyList: function(dataProvider) {
        return DataOperations.properties.downloadPropertyList(dataProvider);
      },
      /**
       * Returns fulfilled Promise with the data contents after checking against the media type
       * @param {string} data
       * @param {string} [mediaType="application/x-yaml"]
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      checkProviderUploadContent: function(data, mediaType) {
        return new Promise((resolve, reject) => {
          if (!mediaType || mediaType === '') mediaType = 'application/x-yaml';
          const reply = {
            body: {
              messages: []
            }
          };

          // Use the media type check if the data format complies...
          if (mediaType.indexOf('yaml') !== -1) {
            try {
              parser.load(data);
            }
            catch(err) {
              reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
              reply['failureReason'] = err;
              reject(reply);
            }
          }
          else if (mediaType.indexOf('json') !== -1) {
            try {
              JSON.parse(data);
            }
            catch(err) {
              reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
              reply['failureReason'] = err;
              reject(reply);
            }
          }
          else if (mediaType.indexOf('plain') !== -1) {
            try {
              // plain text
              reply.body['data'] = data;
            }
            catch(err) {
              reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
              reply['failureReason'] = err;
              reject(reply);
            }
          }
          else {
            reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
            reply['failureReason'] = new Error(`Unsupported media type: ${mediaType}`);
            reject(reply);
          }

          // Return the data for later upload...
          reply.body['data'] = data;
          resolve(reply);
        });
      },
      /**
       * @returns {DataProvider|undefined}
       */
      getLastActivatedDataProvider: function() {
        const dataProviderId = Runtime.getDataProviderId();
        let dataProvider = this.getDataProviderById(dataProviderId);
        if (CoreUtils.isUndefinedOrNull(dataProvider)) {
          // There is no data provider identifier set
          // at the runtime scope, so use CBE providers
          // API to get the list.
          this.listDataProviders()
            .then(reply => {
              reply.body.data.forEach((listItem) => {
                const index = dataproviders.map(item => item.id).indexOf(listItem.id);
                if (index !== -1) {
                  listItem.state = listItem.state || CoreTypes.Domain.ConnectState.DISCONNECTED.name;
                  dataproviders[index].putValue('state', listItem.state);
                  dataproviders[index].putValue('connectivity', listItem.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
                  if (listItem.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
                    dataproviders[index].putValue('activationDatetime', new Date());
                  }
                  dataProvider = dataproviders[index];
                } 
                else if (CoreUtils.isNotUndefinedNorNull(listItem.type)) {
                  // Here, the CBE has a data provider that the
                  // CFE doesn't have. We deal with that by adding
                  // the data provider to the CFE. To do that, we
                  // need the data provider type
                  const dataProviderType = DataProvider.prototype.typeFromName(listItem.type);
                  // Get next identifier for a given provider type
                  const nextId = this.getNextDataProviderId(dataProviderType);

                  dataProvider = addDataProvider({
                    id: nextId['id'],
                    name: listItem.name,
                    type: listItem.providerType
                  });
                  dataProvider.putValue('index', nextId.index);
                  dataProvider.populateFromResponse(listItem);
                }
              });
            });
        }
        return dataProvider;
      },
      /**
       *
       * @param {DataProvider.prototype.Type} dataProviderType
       * @returns {string}
       */
      getNextDataProviderId: function(dataProviderType) {
        let nextId;
        switch(dataProviderType) {
          case DataProvider.prototype.Type.ADMINSERVER:
            if (!IdGenerator.exists(DataProvider.prototype.Type.ADMINSERVER.name)) {
              IdGenerator.create(DataProvider.prototype.Type.ADMINSERVER.name);
            }
            nextId = IdGenerator.getNextId(DataProvider.prototype.Type.ADMINSERVER.name);
            break;
          case DataProvider.prototype.Type.MODEL:
            if (!IdGenerator.exists(DataProvider.prototype.Type.MODEL.name)) {
              IdGenerator.create(DataProvider.prototype.Type.MODEL.name);
            }
            nextId = IdGenerator.getNextId(DataProvider.prototype.Type.MODEL.name);
            break;
          case DataProvider.prototype.Type.COMPOSITE:
            if (!IdGenerator.exists(DataProvider.prototype.Type.COMPOSITE.name)) {
              IdGenerator.create(DataProvider.prototype.Type.COMPOSITE.name);
            }
            nextId = IdGenerator.getNextId(DataProvider.prototype.Type.COMPOSITE.name);
            break;
          case DataProvider.prototype.Type.PROPERTIES:
            if (!IdGenerator.exists(DataProvider.prototype.Type.PROPERTIES.name)) {
              IdGenerator.create(DataProvider.prototype.Type.PROPERTIES.name);
            }
            nextId = IdGenerator.getNextId(DataProvider.prototype.Type.PROPERTIES.name);
            break;
        }
        return nextId;
      },

      /**
       * @param {string} dataProviderId
       * @returns {DataProvider|undefined}
       */
      getDataProviderById: function(dataProviderId) {
        return dataproviders.find(dataProvider => dataProvider.id === dataProviderId);
      },
      /**
       * @param {string} dataProviderName
       * @returns {DataProvider|undefined}
       */
      getDataProviderByName: function(dataProviderName) {
        return dataproviders.find(dataProvider => dataProvider.name === dataProviderName);
      },
      /**
       *
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      listDataProviders: function() {
        return DataOperations.providers.listing();
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      quiesceDataProvider: function(dataProvider) {
        return new Promise((resolve, reject) => {
          const result = {succeeded: false};
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              DataOperations.providers.quiesce(dataProvider.id, dataProvider.getBackendProviderType())
                .then(reply => {
                  removeDataProviderById(dataProvider.id);
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result['failure'] = response;
                  reject(result);
                });
            }
            else {
              removeDataProviderById(dataProvider.id);
              result.succeeded = true;
              result.data = dataProvider;
              resolve(result);
            }
          }
          else {
            result['failure'] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error('Required parameter is missing or null: \'dataProvider\'')
            };
            reject(result);
          }
        });
      }

    };
  }
);
