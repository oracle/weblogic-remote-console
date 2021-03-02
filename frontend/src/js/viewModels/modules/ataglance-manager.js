/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['../../cfe/cbe-types', '../../cfe/common/utils', '../../cfe/common/runtime', '../../cfe/http/adapter', 'ojs/ojlogger'],
  function (CbeTypes, Utils, Runtime, HttpAdapter, Logger) {

    function getServiceConfigComponentURL(id){
      const serviceConfig = Runtime.getServiceConfig(CbeTypes.ServiceType.MONITORING);
      if (typeof serviceConfig === "undefined") throw new Error("'" + CbeTypes.ServiceType.MONITORING.name + "' service not defined in console-frontend-jet.yaml file.");
      const component = serviceConfig.components.lifecycle.find(item => item.id === id);
      return Runtime.getBaseUrl() + serviceConfig.path + "/data/" + component.uri;
    }

  //public:
    return {
      Section:  Object.freeze({
        SERVERS_GLANCE: {name: "serversGlance"},
        SYSTEM_STATUS: {name: "systemStatus"}
      }),
      Entity: Object.freeze({
        AT_A_GLANCE: {name: "ataglance"}
      }),
      getServersURL: function getServersURL() {
        return new Promise((resolve, reject) => {
          try {
            const serversURL = getServiceConfigComponentURL("view");
            resolve(serversURL);
          }
          catch (error) {
            reject(error);
          }
        });
      },
      getData: function getData() {
        return new Promise((resolve, reject) => {
          this.getServersURL()
          .then((serversURL) => {
            HttpAdapter.get(serversURL)
            .then((data) => {
              resolve(data);
            })
            .catch((response) => {
              if (typeof response.json !== "undefined") {
                response.json()
                .then((responseJSON) => {
                  Logger.error(responseJSON);
                  reject(responseJSON);
                });
              }
              else {
                reject(response);
              }
            });
          });
        });
      },
      getServers: function getServers(data){
        // data = {"data":[{"Type":"ServerLifeCycleRuntime","State":"RUNNING","identity":{"perspective":"monitoring","kind":"collectionChild","path":[{"type":"DomainRuntime","typeLabel":"Domain Runtime"},{"type":"ServerLifeCycleRuntime","typeLabel":"Server Life Cycle Runtime","property":"ServerStates","propertyLabel":"Server States","key":"AdminServer"}]},"Name":"AdminServer"},{"Type":"ServerLifeCycleRuntime","State":"SHUTDOWN","identity":{"perspective":"monitoring","kind":"collectionChild","path":[{"type":"DomainRuntime","typeLabel":"Domain Runtime"},{"type":"ServerLifeCycleRuntime","typeLabel":"Server Life Cycle Runtime","property":"ServerStates","propertyLabel":"Server States","key":"ManagedServer1"}]},"Name":"ManagedServer1"},{"Type":"ServerLifeCycleRuntime","State":"SHUTDOWN","identity":{"perspective":"monitoring","kind":"collectionChild","path":[{"type":"DomainRuntime","typeLabel":"Domain Runtime"},{"type":"ServerLifeCycleRuntime","typeLabel":"Server Life Cycle Runtime","property":"ServerStates","propertyLabel":"Server States","key":"ManagedServer2"}]},"Name":"ManagedServer2"},{"Type":"ServerLifeCycleRuntime","State":"SHUTDOWN","identity":{"perspective":"monitoring","kind":"collectionChild","path":[{"type":"DomainRuntime","typeLabel":"Domain Runtime"},{"type":"ServerLifeCycleRuntime","typeLabel":"Server Life Cycle Runtime","property":"ServerStates","propertyLabel":"Server States","key":"ManagedServer3"}]},"Name":"ManagedServer3"},{"Type":"ServerLifeCycleRuntime","State":"SHUTDOWN","identity":{"perspective":"monitoring","kind":"collectionChild","path":[{"type":"DomainRuntime","typeLabel":"Domain Runtime"},{"type":"ServerLifeCycleRuntime","typeLabel":"Server Life Cycle Runtime","property":"ServerStates","propertyLabel":"Server States","key":"server1"}]},"Name":"server1"},{"Type":"ServerLifeCycleRuntime","State":"SHUTDOWN","identity":{"perspective":"monitoring","kind":"collectionChild","path":[{"type":"DomainRuntime","typeLabel":"Domain Runtime"},{"type":"ServerLifeCycleRuntime","typeLabel":"Server Life Cycle Runtime","property":"ServerStates","propertyLabel":"Server States","key":"server2"}]},"Name":"server2"}],"pageDefinition":"ServerLifeCycleRuntimeMBean?view=table","weblogicVersion":"14.1.1.0.0"}
        let servers = [];
        data.data.forEach((server) => {
          servers.push({
            name: server.Name,
            state: server.State
          });
        });

        return servers;
      },
      getServer: function getServer(data, name){
        let server;
        if (typeof name !== "undefined" && name.length > 0) {
          server = data.data.find(server => server.name === name);
        }
        return server;
      }
    };

  }
);