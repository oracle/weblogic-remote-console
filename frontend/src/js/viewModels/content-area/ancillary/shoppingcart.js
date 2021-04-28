/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', '../../../core/utils/keyset-utils', '../../../core/runtime', '../../../microservices/change-management/change-manager', '../../../microservices/page-definition/utils', '../../utils', 'ojs/ojlogger', 'ojs/ojaccordion', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojrowexpander'],
  function(oj, ko, ArrayDataProvider, HtmlUtils, keySet, keySetUtils, Runtime, ChangeManager, PageDefinitionUtils, ViewModelUtils, Logger){
    function ShoppingCartTabTemplate(viewParams) {
      var self = this;

      this.changeManagerDom = ko.observable({});
      this.additionsDom = ko.observable({});
      this.modificationsDom = ko.observable({});
      this.removalsDom = ko.observable({});
      this.restartDom = ko.observable({});

      this.changeManagerSections = ko.observableArray([
        {id: ChangeManager.Section.CHANGE_MANAGER.name, content: {}, count: ko.observable(0),
          label: oj.Translations.getTranslatedString("wrc-shoppingcart.sections.changeManager.label")
        },
        {id: ChangeManager.Section.ADDITIONS.name,content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString("wrc-shoppingcart.sections.additions.label")
        },
        {id: ChangeManager.Section.MODIFICATIONS.name, content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString("wrc-shoppingcart.sections.modifications.label")
        },
        {id: ChangeManager.Section.REMOVALS.name, content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString("wrc-shoppingcart.sections.removals.label")
        },
        {id: ChangeManager.Section.RESTART.name, content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString("wrc-shoppingcart.sections.restart.label")
        }
      ]);

      this.i18n = {
        tabstrip: {
          tabs: ko.observableArray([
            {id: "discard-tab-button", iconFile: "discard-changes-blk_24x24", disabled: false, visible: ko.observable(true),
              label: oj.Translations.getTranslatedString("wrc-shoppingcart.icons.discard.tooltip")
            },
            {id: "commit-tab-button", iconFile: "commit-changes-blk_24x24", disabled: false, visible: ko.observable(true),
              label: oj.Translations.getTranslatedString("wrc-shoppingcart.icons.commit.tooltip")
            }
          ])
        }
      };

      this.signalBindings = [];
      
      this.connected = function () {
        self.signalBindings.push(viewParams.signaling.readonlyChanged.add((newRO) => {
          self.i18n.tabstrip.tabs().forEach(item =>{ 
            item.visible(!newRO)})
        }));

        const readonly = Runtime.isReadOnly();
        self.i18n.tabstrip.tabs().forEach(item =>{
          item.visible(!readonly);
        });

        checkLockOwner();
      };

      this.disconnected = function () {
        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });
        self.signalBindings = [];
      };
      
      function checkLockOwner(){
        if (ChangeManager.getMostRecent().isLockOwner) loadChangeManagerSections();
      }

      function loadChangeManagerSections(){
        ChangeManager.getData()
          .then(data => {
            let section, ele;

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.ADDITIONS.name);
            section.content = data.data[ChangeManager.Section.ADDITIONS.name];

            if (section.content.length > 0) {
              section.count(section.content.length);
            }
            else {
              section.count(0);
            }

            ele = document.getElementById("additions-count");
            if (ele !== null) ele.innerHTML = section.label + " (" + section.count() + ")";

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.MODIFICATIONS.name);
            section.content = data.data[ChangeManager.Section.MODIFICATIONS.name];
            section.count(section.content.length);
            ele = document.getElementById("modifications-count");
            if (ele !== null) ele.innerHTML = section.label + " (" + section.count() + ")";

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.REMOVALS.name);
            section.content = data.data[ChangeManager.Section.REMOVALS.name];
            if (section.content.length > 0){
              section.count(section.content.length);
            }
            else {
              section.count(0);
            }
            ele = document.getElementById("removals-count");
            if (ele !== null) ele.innerHTML = section.label + " (" + section.count() + ")";

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.RESTART.name);
            section.content = data.data[ChangeManager.Section.RESTART.name];
            section.count(section.content.length);
            ele = document.getElementById("restart-count");
            if (ele !== null) ele.innerHTML = section.label + " (" + section.count() + ")";

            updateChangeManagerSection(data.changeManager);
          })
          .catch( error => {
            ViewModelUtils.failureResponseDefaultHandling(error);
          });
      }

      function updateChangeManagerSection(changeManager){
        if (changeManager !== null) {
          if (changeManager.supportsChanges) {
            let section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.CHANGE_MANAGER.name);
            section.content = changeManager;
            section.count(1);

            self.i18n.tabstrip.tabs().forEach((tabButton) => {
              tabButton.disabled = (!changeManager.hasChanges);
              const ele = document.getElementById(tabButton.id);
              switch (tabButton.id) {
                case "discard-tab-button":
                  if (ele !== null) ele.src = "../../images/discard-changes-" + (tabButton.disabled ? "disabled" : "blk") + "_24x24.png";
                  break;
                case "commit-tab-button":
                  if (ele !== null) ele.src = "../../images/commit-changes-" + (tabButton.disabled ? "disabled" : "blk") + "_24x24.png";
                  break;
              }
            });

            const ele = document.getElementById("shoppingcart-tab");
            if (ele !== null) ele.src = "../../images/shopping-cart-" + (changeManager.hasChanges ? "non-empty" : "empty") + "-tabstrip_24x24.png";
          }
          else {
            viewParams.onTabStripContentChanged(ChangeManager.Entity.SHOPPING_CART.name, false);
          }
        }
      }

      this.shoppingCartTabButtonClickHandler = function(event) {
        let id;
        if (event.target.localName === "img") {
          id = event.target.id;
        }

        const tabButton = self.i18n.tabstrip.tabs().find(button => button.id === id);
        if (typeof tabButton === "undefined" || tabButton.disabled) {
          event.preventDefault();
          return false;
        }

        Logger.log(`id=${id}`);

        switch(id){
          case "commit-tab-button":
            ChangeManager.commitChanges()
              .then((changeManager) => {
                viewParams.signaling.shoppingCartModified.dispatch(ChangeManager.Entity.SHOPPING_CART.name, "commit", changeManager);
                viewParams.onTabStripContentChanged(ChangeManager.Entity.SHOPPING_CART.name, false);
              });
            break;
          case "discard-tab-button":
            ChangeManager.discardChanges()
              .then((changeManager) => {
                viewParams.signaling.shoppingCartModified.dispatch(ChangeManager.Entity.SHOPPING_CART.name, "discard", changeManager);
                viewParams.onTabStripContentChanged(ChangeManager.Entity.SHOPPING_CART.name, false);
              });
            break;
        }
      };

      this.identityKeyClickHandler = function(event) {
        const path = event.target.attributes['data-path'].value;
        if (typeof path === "undefined") return;

        if (!path.includes("?slice=")) {
          viewParams.parentRouter.go("/configuration/" + encodeURIComponent(path.substring(1)));
          viewParams.onTabStripContentHidden(false);
        }
      }.bind(this);

      this.parentIdentityKeyClickHandler = function(event) {
        const dataKey = event.target.attributes["data-key"].value;
        const ele = document.querySelector("[name='" + dataKey +"']");
        if (event.target.classList.contains("oj-fwk-icon-arrow03-e")) {
          event.target.classList.remove("oj-fwk-icon-arrow03-e");
          event.target.classList.add("oj-fwk-icon-arrow03-s");
          ele.style.display = "inline-block";
        }
        else {
          event.target.classList.remove("oj-fwk-icon-arrow03-s");
          event.target.classList.add("oj-fwk-icon-arrow03-e");
          ele.style.display = "none";
        }
      }.bind(this);

      this.identityKeyTextAreaClickHandler = function(event) {
        self.identityKeyClickHandler(event);
      }.bind(this);

      this.changeManagerSectionBeforeExpand = function (event) {
        const vetoed = expandChangeManagerSection(event.target.id);
        if (vetoed) {
          // Veto the performance of the expand event altogether
          event.preventDefault();
        }
      }.bind(this);

      function expandChangeManagerSection(id){
        const section = self.changeManagerSections().find(item => item.id === id);
        if (section.count() === 0) {
          // Return true as the function's return value, so
          // expand event will be vetoed
          return true;
        }

        let bindDom;

        switch(section.id){
          case ChangeManager.Section.CHANGE_MANAGER.name:
            bindDom = createChangeManagerDOM(section.content);
            self.changeManagerDom(bindDom);
            break;
          case ChangeManager.Section.ADDITIONS.name:
            bindDom = createAdditionsDOM(section.content);
            self.additionsDom(bindDom);
            break;
          case ChangeManager.Section.MODIFICATIONS.name:
            bindDom = createModificationsDOM(section.content);
            self.modificationsDom(bindDom);
            break;
          case ChangeManager.Section.REMOVALS.name:
            bindDom = createRemovalsDOM(section.content);
            self.removalsDom(bindDom);
            break;
          case ChangeManager.Section.RESTART.name:
            bindDom = createRestartDOM(section.content);
            self.restartDom(bindDom);
            break;
        }

        return false;
      }

      function computeBreadCrumbsData(identities) {
        const appendData = function (data, item) {
          if (typeof item.property !== "undefined") {
            data.breadcrumbs.push(item.property);
            data.links.push(item.propertyLabel);
          }
          else if (typeof item.type !== "undefined") {
            data.breadcrumbs.push(item.type);
            data.links.push(item.typeLabel);
          }

          if (typeof item.key !== "undefined") {
            data.breadcrumbs.push(item.key);
            data.links.push(item.key);
          }
        };

        let data = {breadcrumbs: [], links: []}, multidata = {breadcrumbs: [], links: []};
        identities.forEach((identity, index) => {
          if (typeof identity.kind !== 'undefined') {
            const lastIndex = identity.path.length - 1;
            identity.path.forEach((item, index) => {
              appendData(data, item);
              if (index === lastIndex) {
                multidata.breadcrumbs.push(data.breadcrumbs.join("/"));
                multidata.links.push(data.links.join("/"));
                data = {breadcrumbs: [], links: []};
              }
            });
          }
          else {
            appendData(data, identity);
          }
        });

        if (multidata.links.length > 0) {
          data = {breadcrumbs: [], links: []};
          data.breadcrumbs.push(multidata.breadcrumbs.join(", /"));
          data.links.push(multidata.links.join(", /"));
        }

        return data;
      }

      function getIdentityGrouping(content) {
        let data = {}, labels = {};
        let identityGrouping = [];
        content.forEach((entry) => {
          let lastIndex;
          if (entry.identity.path.length > 0) {
            lastIndex = entry.identity.path.length - 1;
            data = computeBreadCrumbsData(entry.identity.path);
          }
          entry.identity.path.forEach((identity, index) => {
            if (index === lastIndex) {
              if (typeof entry.property !== "undefined") {
                let map = {}, labels = {};
                map["property"] = entry.property;
                map["kind"] = entry.identity.kind;
                if (typeof identity.typeLabel !== "undefined") labels["type"] = identity.typeLabel;
                if (typeof identity.propertyLabel !== "undefined") labels["type"] = identity.propertyLabel;
                labels = {type: identity.typeLabel, property: identity.propertyLabel};
                if (typeof entry.oldValue !== "undefined") {
                  if (entry.oldValue === null)
                    if (entry.newValue.kind === "collectionChild")
                      map["old"] = {kind: "collectionChild", value: {breadcrumbs: [], links: []}};
                    else
                      map["old"] = {kind: undefined, value: {value: "null", set: true}};
                  else if (Object.prototype.toString.call(entry.oldValue) === '[object Array]')
                    if (entry.oldValue.length > 0)
                      map["old"] = {kind: 'collectionChild', value: computeBreadCrumbsData(entry.oldValue)};
                    else
                      map["old"] = {kind: 'collectionChild', value: {breadcrumbs: [], links: []}};
                  else {
                    if (typeof entry.oldValue.value === 'object') {
                      entry.oldValue.value = PageDefinitionUtils.getPropertiesDisplayValue(entry.oldValue.value);
                    }
                    map["old"] = {kind: entry.identity.kind, value: entry.oldValue};
                  }
                }
                if (typeof entry.newValue !== "undefined") {
                  if (entry.newValue === null)
                    if (entry.oldValue.kind === "collectionChild")
                      map["new"] = {kind: "collectionChild", value: {breadcrumbs: [], links: []}};
                    else
                      map["new"] = {kind: undefined, value: {value: "null", set: true}};
                  else if (Object.prototype.toString.call(entry.newValue) === '[object Array]')
                    if (entry.newValue.length > 0)
                      map["new"] = {kind: 'collectionChild', value: computeBreadCrumbsData(entry.newValue)};
                    else
                      map["new"] = {kind: 'collectionChild', value: {breadcrumbs: [], links: []}};
                  else {
                    if (typeof entry.newValue.value === 'object') {
                      entry.newValue.value = PageDefinitionUtils.getPropertiesDisplayValue(entry.newValue.value);
                    }
                    map["new"] = {kind: entry.identity.kind, value: entry.newValue};
                  }
                }
                identityGrouping.push({path: data.breadcrumbs, links: data.links, labels: labels, data: map});
              }
            }
          });
        });
        return identityGrouping;
      }

      function createChangeManagerDOM(content){
        let bindHtml = "<table id='change-manager-table'>";
        for (let [key, value] of Object.entries(content)) {
          bindHtml += "<tr>";
          bindHtml += "<td class='table-key'>" + key + "</td><td>" + value + "</td>";
          bindHtml += "</tr>";
        }
        bindHtml += "</table>";
        return { view: HtmlUtils.stringToNodeArray(bindHtml) };
      }

      function createAdditionsDOM(content){
        let bindHtml = "<p/>";
        if (content.length > 0) {
          bindHtml = "<table id='additions-table'>";

          let data = {};

          content.forEach((entry) => {
            data = computeBreadCrumbsData(entry.identity.path);

            bindHtml += "<tr>";
            bindHtml += "<td class='table-key'>";
            bindHtml += "<a href='#' on-click='[[identityKeyClickHandler]]' data-path='/" + data.breadcrumbs.join("/") + "'>";
            bindHtml += "/" + data.links.join("/");
            bindHtml += "</a>";
            bindHtml += "</tr>";
          });

          bindHtml += "</table>";
        }
        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self };
      }

      function createModificationsDOM(content){
        let bindHtml = "<p/>";
        if (content.length > 0) {
          bindHtml = "<table id='modifications-table'>";

          let identityKeyHtml = "", identityProperty = "", pathLinkMap = {}, pathLink = "", pathKey;

          const identityGrouping = getIdentityGrouping(content);

          identityGrouping.forEach((entry) => {
            pathLink = entry.path.join("/");
            pathKey = entry.path.join("");
            if (!(pathLink in pathLinkMap)) {
              identityKeyHtml = "<tr>";
              identityKeyHtml += "<td class='table-key'>";
              identityKeyHtml += "<a href='#' on-click='[[parentIdentityKeyClickHandler]]'>";
              identityKeyHtml += "<span class='oj-component-icon oj-clickable-icon-nocontext oj-fwk-icon-arrow03-e' data-key='" + pathKey + "'></span>";
              identityKeyHtml += "</a>";
              identityKeyHtml += "<a href='#' on-click='[[identityKeyClickHandler]]' data-path='/" + pathLink + "'>";
              identityKeyHtml += "/" + entry.links.join("/");
              identityKeyHtml += "</a>";
              identityKeyHtml += "</td>";
              identityKeyHtml += "</tr>";
              identityKeyHtml += "<tr>";
              identityKeyHtml += "<td>";
              identityKeyHtml += "<pre class='table-key-content' name='" + pathKey + "'>";
              identityKeyHtml += "%%INNER_HTML%%</pre>";
              identityKeyHtml += "</td>";
              identityKeyHtml += "</tr>";

              pathLinkMap[pathLink] = {outerHtml: identityKeyHtml, properties: [entry.data.property]};
            }

            identityProperty = pathLinkMap[pathLink].properties.find(property => property === entry.data.property);
            if (typeof identityProperty === "undefined") {
              pathLinkMap[pathLink].properties.push(entry.data.property);
            }

            let innerHtml = "";

            if (typeof entry.data.old.value !== 'undefined') {
              if (entry.data.old.kind === 'collectionChild') {
                innerHtml += "&nbsp;&nbsp;&nbsp;&nbsp;";
                innerHtml += entry.data.property;
                innerHtml += ":<br/>";
                innerHtml += "\toldValue=";
                if (typeof entry.data.old.value.links !== 'undefined')
                  innerHtml += (entry.data.old.value.links.length > 0 ? "/" + entry.data.old.value.links.join("/") + "\n" : "\n");
                else
                  innerHtml += (entry.data.old.value !== null ? entry.data.old.value.value : "") + ",\tset=" + (entry.data.old.value !== null ? entry.data.old.value.set : "") + "\n";
              }
              else {
                innerHtml += "&nbsp;&nbsp;&nbsp;&nbsp;";
                innerHtml += entry.data.property;
                innerHtml += ":<br/>";
                innerHtml += "\toldValue=" + (entry.data.old.value !== null ? entry.data.old.value.value : "") + ",\tset=" + (entry.data.old.value !== null ? entry.data.old.value.set : "") + "\n";
              }
            }

            if (typeof entry.data.new.value !== 'undefined') {
              if (entry.data.new.kind === 'collectionChild') {
                innerHtml += "\tnewValue=";
                if (typeof entry.data.new.value.links !== 'undefined')
                  innerHtml += (entry.data.new.value.links.length > 0 ? "/" + entry.data.new.value.links.join("/") + "\n\n" : "\n\n");
                else {
                  innerHtml += entry.data.new.value.value + ",\tset=" + entry.data.new.value.set + "\n";
                  innerHtml += "\n";
                }
              }
              else {
                innerHtml += "\tnewValue=" + entry.data.new.value.value + ",\tset=" + entry.data.new.value.set + "\n";
                innerHtml += "\n";
              }
            }

            identityProperty = pathLinkMap[pathLink].properties.find(property => property === entry.data.property);
            if (typeof identityProperty !== "undefined") {
              // The CBE treats the "chosen" values of a multi-select as distinct values,
              // so we need this next if to prevent the property name associated with the
              // multi-select from appearing twice
              if (pathLinkMap[pathLink].outerHtml.indexOf(identityProperty + "</a>:") === -1) pathLinkMap[pathLink].outerHtml = pathLinkMap[pathLink].outerHtml.replace("%%INNER_HTML%%", innerHtml + "%%INNER_HTML%%");
            }
          });

          // Remove trailing "%%INNER_HTML%%" from each pathLinkMap
          // entry, and then append the entry to bindHtml variable
          Object.values(pathLinkMap).forEach((textblock) => {
            bindHtml += textblock.outerHtml.replace("%%INNER_HTML%%", "");
          });

          bindHtml += "</table>";
        }
        Logger.log(bindHtml);
        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self };
      }

      function createRemovalsDOM(content){
        let bindHtml = "<p/>";
        if (content.length > 0) {
          bindHtml = "<table id='removals-table'>";

          let data = {};

          content.forEach((entry) => {
            data = computeBreadCrumbsData(entry.identity.path);

            bindHtml += "<tr>";
            bindHtml += "<td class='table-key'>";
            bindHtml += "/" + data.links.join("/");
            bindHtml += "</td>";
            bindHtml += "</tr>";
          });

          bindHtml += "</table>";
        }

        return { view: HtmlUtils.stringToNodeArray(bindHtml) };
      }

      function createRestartDOM(content){
        let bindHtml = "<p/>";
        if (content.length > 0) {
          bindHtml = "<table id='restart-table'>";

          let data = {};

          content.forEach((entry) => {
            data = computeBreadCrumbsData(entry.identity.path);

            bindHtml += "<tr>";
            bindHtml += "<td class='table-key'>";
            bindHtml += "<a href='#' on-click='[[identityKeyClickHandler]]' data-path='/" + data.path.join("/") + "'>";
            bindHtml += "/" + data.links.join("/");
            bindHtml += "</a>";
            bindHtml += "</tr>";
          });

          bindHtml += "</table>";
        }
        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self};
      }

    }

    return ShoppingCartTabTemplate;
  }
);
