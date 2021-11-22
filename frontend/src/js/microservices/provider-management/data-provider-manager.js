/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['js-yaml', '../common/id-generator', './data-provider', '../connection-management/domain-connection-manager', '../../apis/data-operations', '../../core/runtime', '../../core/types', '../../core/utils', 'ojs/ojlogger'],
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
        if (CoreUtils.isNotUndefinedNorNull(entry.url)) dataProvider["url"] = entry.url;
        if (CoreUtils.isNotUndefinedNorNull(entry.username)) dataProvider["username"] = entry.username;
        if (CoreUtils.isNotUndefinedNorNull(entry.password)) dataProvider["password"] = entry.password;
        return dataProvider;
      },
      /**
       *
       * @param {DataProvider} dataProvider
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      activateAdminServerConnection: async function(dataProvider) {
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          return DomainConnectionManager.createConnection(dataProvider);
        }
        else {
          const response = {
            failureType: CoreTypes.FailureType.UNEXPECTED,
            failureReason: new Error("Required parameter is missing or null: 'id'")
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
            if (dataProvider.state === "connected") {
              DomainConnectionManager.removeConnection(dataProvider)
                .then(reply => {
                  removeDataProviderById(dataProvider.id);
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result["failure"] = response;
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
            result["failure"] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error("Required parameter is missing or null: 'id'")
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
        if (CoreUtils.isNotUndefinedNorNull(entry.file)) dataProvider["file"] = entry.file;
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
       * Returns fulfilled Promise with JSON
       * @param {Blob} data
       * @param {string} [mediaType="application/x-yaml"]
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      getWDTModelContent: function(data, mediaType) {
        return new Promise((resolve, reject) => {
          if (!mediaType || mediaType === "") mediaType = "application/x-yaml";
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
          if (mediaType.indexOf("yaml") !== -1) {
            try {
              reply.body["data"] = parser.safeLoad(data);
              resolve(reply);
            }
            catch(err) {
              reply["failureType"] = CoreTypes.FailureType.UNEXPECTED;
              reply["failureReason"] = err;
              reject(reply);
            }
          }
          else if (mediaType.indexOf("json") !== -1) {
            try {
              reply.body["data"] = JSON.parse(data);
              resolve(reply);
            }
            catch(err) {
              reply["failureType"] = CoreTypes.FailureType.UNEXPECTED;
              reply["failureReason"] = err;
              reject(reply);
            }
          }
          else {
            reply["failureType"] = CoreTypes.FailureType.UNEXPECTED;
            reply["failureReason"] = new Error(`Unsupported media type: ${mediaType}`);
            reject(reply);
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
            if (dataProvider.state === "connected") {
              DataOperations.model.removeModel(dataProvider.id)
                .then(reply => {
                  removeDataProviderById(dataProvider.id);
                  result.succeeded = true;
                  result.data = dataProvider;
                  resolve(result);
                })
                .catch(response => {
                  result["failure"] = response;
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
            result["failure"] = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              failureReason: new Error("Required parameter is missing or null: 'id'")
            };
            reject(result);
          }
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
                  dataproviders[index].putValue("state", listItem.state);
                  dataproviders[index].putValue("connectivity", listItem.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
                  if (listItem.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
                    dataproviders[index].putValue("activationDatetime", new Date());
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
                    id: nextId["id"],
                    name: listItem.name,
                    type: listItem.providerType
                  });
                  dataProvider.putValue("index", nextId.index);
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
       *
       * @returns {Promise<{body: {data?: *, messages: [*]}} |{failureType: string, failureReason: *}>}
       */
      listDataProviders: function() {
        return DataOperations.providers.listing();
      }

    };
  }
);
