/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['../../apis/data-operations', 'ojs/ojlogger'],
  function (DataOperations, Logger) {

  //public:
    return {
      Section:  Object.freeze({
        SERVERS_GLANCE: {name: "serversGlance"},
        SYSTEM_STATUS: {name: "systemStatus"}
      }),
      Entity: Object.freeze({
        AT_A_GLANCE: {name: "ataglance"}
      }),
      getData: function getData() {
        return DataOperations.ataglance.getServersGlance();
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