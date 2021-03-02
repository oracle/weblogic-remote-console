/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', '../../../cfe/utils/keyset-utils', '../../../cfe/common/runtime', '../../modules/ataglance-manager', 'ojs/ojlogger', 'ojs/ojaccordion', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojrowexpander', 'ojs/ojgauge'],
  function(ko, ArrayDataProvider, HtmlUtils, keySet, keySetUtils, Runtime, AtAGlanceManager, Logger){
    function AtAGlanceTabTemplate(viewParams) {
      const self = this;

      this.i18n = {
        "labels": {
          "running": { value: "RUNNING"},
          "shutdown": { value: "SHUTDOWN"},
          "serverStates": { value: "Server States"},
          "systemStatus": { value: "System Status"},
          "healthState": {
            "failed": { value: "Failed"},
            "critical": { value: "Critical"},
            "overloaded": { value: "Overloaded"},
            "warning": { value: "Warning" },
            "ok": { value: "OK" }
          }
        },
        "descriptions": {
          "healthState": {value: "Health of Running Servers as of"}
        },
        "headers": {
          "serverStates": [
            {value: "Name"},
            {value: "State"}
          ]
        }
      };

      this.runningServers = ko.observableArray([]);
      this.shutdownServers = ko.observableArray([]);

      this.serversGlanceDom = ko.observable({});
      this.systemStatusDom = ko.observable({});

      this.serversGlanceExpanded = ko.observable(false);
      this.systemGlanceExpanded = ko.observable(false);

      this.atAGlanceSections = ko.observableArray([
        { id: AtAGlanceManager.Section.SERVERS_GLANCE.name, label: self.i18n.labels.serverStates.value, servers: []},
        { id: AtAGlanceManager.Section.SYSTEM_STATUS.name, label: self.i18n.labels.systemStatus.value,
          content: { description: self.i18n.descriptions.healthState.value + " ",
            healthState: [
              {id: "failed", label: self.i18n.labels.healthState.failed.value, value: 0, color: "#c91107"},
              {id: "critical", label: self.i18n.labels.healthState.critical.value, value: 0, color: "#f54b1f"},
              {id: "overloaded", label: self.i18n.labels.healthState.overloaded.value, value: 0, color: "#f5851f"},
              {id: "warning", label: self.i18n.labels.healthState.warning.value, value: 0, color: "#fefc2b"},
              {id: "ok", label: self.i18n.labels.healthState.ok.value, value: 0, color: "#9eac8d"}
            ]
          }
        }
      ]);

      this.connected = function () {
        loadAtAGlanceSections(true);
      }.bind(this);

      function loadAtAGlanceSections(expandAfterLoad){
        AtAGlanceManager.getData()
        .then((data) => {
          const servers = AtAGlanceManager.getServers(data);
          self.atAGlanceSections()[0].servers = servers;
          self.runningServers(servers.filter(server => server.state === "RUNNING"));
          self.shutdownServers(servers.filter(server => server.state === "SHUTDOWN"));
          const healthState = self.atAGlanceSections()[1].content.healthState;
          healthState.find(state => state.id === "ok").value = self.runningServers().length;
          self.serversGlanceExpanded(expandAfterLoad);
          self.systemGlanceExpanded(expandAfterLoad);
        })
        .catch( (error) => {
          viewParams.signaling.popupMessageSent.dispatch({
            severity: 'error',
            summary: error,
            detail: ''
          });
        });
      }

      this.identityKeyClickHandler = function(event) {
        Logger.log(`data-path=${event.target.attributes['data-path'].value}`);
        /*
            TODO: Select keys path in monitoring navtree
         */
      }.bind(this);

      this.atAGlanceSectionBeforeExpand = function (event) {
        const section = self.atAGlanceSections().find(item => item.id === event.target.id);
        if (typeof section === "undefined") {
          // Veto the performance of the expand event altogether
          event.preventDefault();
          // Return false as the function's return value
          return false;
        }

        let bindDom;

        switch(section.id){
          case AtAGlanceManager.Section.SERVERS_GLANCE.name: {
            bindDom = serversGlanceDOM(section);
            self.serversGlanceDom(bindDom);
            break;
          }
          case AtAGlanceManager.Section.SYSTEM_STATUS.name: {
            bindDom = systemStatusDOM(section.content);
            self.systemStatusDom(bindDom);
            const minHeightVariable = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--system-status-expand-min-height"), 10);
            document.documentElement.style.setProperty("--servers-glance-dom-calc-min-height", `${minHeightVariable}px`);
            break;
          }
        }
      }.bind(this);

      this.atAGlanceSectionCollapse = function (event) {
        const minHeightVariable = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--system-status-collapse-min-height"), 10);
        document.documentElement.style.setProperty("--servers-glance-dom-calc-min-height", `${minHeightVariable}px`);
      }.bind(this);

      function serversGlanceDOM(section){
        let bindHtml = "";

        bindHtml += "<div class='ataglance-row'>";

        bindHtml += "<div class='ataglance-col' style='width: 67%;'>";
        bindHtml += "<table id='servers-glance-table' class='fixed-header'>";
        bindHtml += "<thead>";
        bindHtml += "<tr class='servers-glance-table-hdr'>";
        bindHtml += "<th>" + self.i18n.headers.serverStates[0].value + "</th>";
        bindHtml += "<th>" + self.i18n.headers.serverStates[1].value + "</th>";
        bindHtml += "</tr>";
        bindHtml += "</thead>";
        bindHtml += "<tbody>";

        section.servers.forEach((server) => {
          bindHtml += "<tr class='servers-glance-table-row'>";
          bindHtml += "<td>" + server.name + "</td>";
          bindHtml += "<td>" + server.state + "</td>";
          bindHtml += "</tr>";
        });

        bindHtml += "</tbody>";
        bindHtml += "</table>";
        bindHtml += "</div>";

        bindHtml += "<div class='ataglance-col' style='width: 30%;'>";
        bindHtml += "<oj-status-meter-gauge ";
        bindHtml += "label.text='" + self.i18n.labels.running.value + "'";
        bindHtml += "color='#9eac8d'";
        bindHtml += "min='0'";
        bindHtml += "max='" + section.servers.length + "'";
        bindHtml += "metric-label.text='" + self.runningServers().length + "'";
        bindHtml += "value='" + self.runningServers().length + "'";
        bindHtml += "start-angle='180'";
        bindHtml += "angle-extent='180'";
        bindHtml += "orientation='circular'";
        bindHtml += "class='circular-status-meter-common circular-status-meter-large'";
        bindHtml += ">";
        bindHtml += "</oj-status-meter-gauge>";
        bindHtml += "<oj-status-meter-gauge ";
        bindHtml += "label.text='" + self.i18n.labels.shutdown.value + "'";
        bindHtml += "color='#4e4e4e'";
        bindHtml += "min='0'";
        bindHtml += "max='" + section.servers.length + "'";
        bindHtml += "metric-label.text='" + self.shutdownServers().length + "'";
        bindHtml += "value='" + self.shutdownServers().length + "'";
        bindHtml += "start-angle='180'";
        bindHtml += "angle-extent='180'";
        bindHtml += "orientation='circular'";
        bindHtml += "class='circular-status-meter-common circular-status-meter-large'";
        bindHtml += ">";
        bindHtml += "</oj-status-meter-gauge>";
        bindHtml += "</div>";

        bindHtml += "</div>";

        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self };
      }

      function systemStatusDOM(content){
        let fillPercentage, bindHtml = "";

        bindHtml = "<div id='status-description'>" + content.description + " " + new Date().toLocaleTimeString() + "</div>";

        content.healthState.forEach((item) => {
          fillPercentage = Math.fround((item.value / 4) / 2);
          bindHtml += "<div class='ataglance-row'>";

          if (item.id === "ok") {
            bindHtml += "<div class='ataglance-col' style='background-color: " + item.color + ";width: " + (fillPercentage * 100) + "%;'><p/></div>";
            bindHtml += "<div class='ataglance-col' style='background-color: #ffffff;width: " + (50 - (fillPercentage * 100)) + "%;'><p/></div>";
          }
          else {
            bindHtml += "<div class='ataglance-col' style='background-color: #ffffff;width: 25%;'><p/></div>";
            bindHtml += "<div class='ataglance-col' style='background-color: #ffffff;width: 25%;'><p/></div>";
          }

          bindHtml += "<a href='#' on-click='[[identityKeyClickHandler]]'>";
          bindHtml += "<div class='ataglance-col' style='background-color: #ffffff;' data-path='/Servers?filter=" + item.id +"'>" + item.label + " (" + item.value + ")</div>";
          bindHtml += "</a>";

          bindHtml += "</div>";
        });

        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self };
      }

    }

    return AtAGlanceTabTemplate;
  }
);