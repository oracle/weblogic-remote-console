/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', 'wrc-frontend/core/utils/keyset-utils', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/change-management/change-manager', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojaccordion', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojrowexpander'],
  function(oj, ko, ArrayDataProvider, HtmlUtils, keySet, keySetUtils, Runtime, ChangeManager, PageDefinitionUtils, ViewModelUtils, CoreUtils, Logger){
    function ShoppingCartTabTemplate(viewParams) {
      var self = this;

      this.changeManagerDom = ko.observable({});
      this.additionsDom = ko.observable({});
      this.modificationsDom = ko.observable({});
      this.removalsDom = ko.observable({});
      this.restartDom = ko.observable({});

      this.changeManagerSections = ko.observableArray([
        {id: ChangeManager.Section.CHANGE_MANAGER.name, content: {}, count: ko.observable(0),
          label: oj.Translations.getTranslatedString('wrc-shoppingcart.sections.changeManager.label')
        },
        {id: ChangeManager.Section.ADDITIONS.name,content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString('wrc-shoppingcart.sections.additions.label')
        },
        {id: ChangeManager.Section.MODIFICATIONS.name, content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString('wrc-shoppingcart.sections.modifications.label')
        },
        {id: ChangeManager.Section.REMOVALS.name, content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString('wrc-shoppingcart.sections.removals.label')
        },
        {id: ChangeManager.Section.RESTART.name, content: [], count: ko.observable(0),
          label: oj.Translations.getTranslatedString('wrc-shoppingcart.sections.restart.label')
        }
      ]);
      this.displayOtherSections = ko.observable(true);

      this.i18n = {
        tabstrip: {
          tabs: ko.observableArray([
            {id: 'discard-tab-button', iconFile: 'discard-changes-blk_24x24', disabled: false, visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-shoppingcart.icons.discard.tooltip')
            },
            {id: 'commit-tab-button', iconFile: 'commit-changes-blk_24x24', disabled: false, visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-shoppingcart.icons.commit.tooltip')
            }
          ])
        }
      };

      this.tabNode = ChangeManager.Entity.SHOPPING_CART.name;
      this.canExitCallback = viewParams.canExitCallback;

      this.signalBindings = [];

      this.connected = function () {
        let binding = viewParams.signaling.readonlyChanged.add((newRO) => {
          setTabStripTabsVisibility(!newRO);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.perspectiveSelected.add((newPerspective) => {
          setTabStripTabsVisibility(newPerspective.id === 'configuration');
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        self.signalBindings.push(binding);

        const readonly = Runtime.isReadOnly();
        setTabStripTabsVisibility(!readonly);

        checkLockOwner();
      };

      this.disconnected = function () {
        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });
        self.signalBindings = [];
      };

      function setTabStripTabsVisibility(visible) {
        self.i18n.tabstrip.tabs().forEach(item =>{
          item.visible(visible)})
      }

      this.getCachedState = () => {
        Logger.log('[SHOPPINGCART] getCachedState() was called.');
        return {};
      };

      function checkLockOwner(){
        if (ChangeManager.getMostRecent().isLockOwner) loadChangeManagerSections();
      }

      function loadChangeManagerSections(){
        ChangeManager.getData()
          .then(data => {
            self.displayOtherSections(data.changeManager.supportsChanges);
            let section, ele;

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.ADDITIONS.name);
            section.content = data.data[ChangeManager.Section.ADDITIONS.name];

            if (section.content.length > 0) {
              section.count(section.content.length);
            }
            else {
              section.count(0);
            }

            ele = document.getElementById('additions-count');
            if (ele !== null) ele.innerHTML = section.label + ' (' + section.count() + ')';

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.MODIFICATIONS.name);
            section.content = data.data[ChangeManager.Section.MODIFICATIONS.name];
            section.count(section.content.length);
            ele = document.getElementById('modifications-count');
            if (ele !== null) ele.innerHTML = section.label + ' (' + section.count() + ')';

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.REMOVALS.name);
            section.content = data.data[ChangeManager.Section.REMOVALS.name];
            if (section.content.length > 0){
              section.count(section.content.length);
            }
            else {
              section.count(0);
            }
            ele = document.getElementById('removals-count');
            if (ele !== null) ele.innerHTML = section.label + ' (' + section.count() + ')';

            section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.RESTART.name);
            section.content = data.data[ChangeManager.Section.RESTART.name];
            if (CoreUtils.isNotUndefinedNorNull(section.content)) {
              section.count(section.content.length);
            }
            else {
              section.count(0);
            }
            ele = document.getElementById('restart-count');
            if (ele !== null) ele.innerHTML = section.label + ' (' + section.count() + ')';

            updateChangeManagerSection(data.changeManager);
          })
          .catch( error => {
            ViewModelUtils.failureResponseDefaultHandling(error);
          });
      }

      function updateChangeManagerSection(changeManager){
        if (changeManager !== null) {
          let section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.CHANGE_MANAGER.name);
          section.content = changeManager;
          section.count(1);

          self.i18n.tabstrip.tabs().forEach((tabButton) => {
            tabButton.disabled = (!changeManager.hasChanges);
            const ele = document.getElementById(tabButton.id);
            switch (tabButton.id) {
              case 'discard-tab-button':
                if (ele !== null) ele.src = 'js/jet-composites/wrc-frontend/1.0.0/images/discard-changes-' + (tabButton.disabled ? 'disabled' : 'blk') + '_24x24.png';
                break;
              case 'commit-tab-button':
                if (ele !== null) ele.src = 'js/jet-composites/wrc-frontend/1.0.0/images/commit-changes-' + (tabButton.disabled ? 'disabled' : 'blk') + '_24x24.png';
                break;
            }
          });

          const ele = document.getElementById('shoppingcart-tab');
          if (ele !== null) ele.src = 'js/jet-composites/wrc-frontend/1.0.0/images/shopping-cart-' + (changeManager.hasChanges ? 'non-empty' : 'empty') + '-tabstrip_24x24.png';
        }
      }

      this.shoppingCartTabButtonClickHandler = function(event) {
        let id;
        if (event.target.localName === 'img') {
          id = event.target.id;
        }

        const tabButton = self.i18n.tabstrip.tabs().find(button => button.id === id);
        if (typeof tabButton === 'undefined' || tabButton.disabled) {
          event.preventDefault();
          return false;
        }

        Logger.log(`id=${id}`);

        switch(id){
          case 'commit-tab-button':
            ViewModelUtils.setPreloaderVisibility(true);
            ChangeManager.commitChanges()
              .then((changeManager) => {
                viewParams.signaling.shoppingCartModified.dispatch(ChangeManager.Entity.SHOPPING_CART.name, 'commit', changeManager);
                viewParams.onTabStripContentChanged(ChangeManager.Entity.SHOPPING_CART.name, false);
              })
              .finally(() => {
                ViewModelUtils.setPreloaderVisibility(false);
              });
            break;
          case 'discard-tab-button':
            ViewModelUtils.setPreloaderVisibility(true);
            ChangeManager.discardChanges()
              .then((changeManager) => {
                viewParams.signaling.shoppingCartModified.dispatch(ChangeManager.Entity.SHOPPING_CART.name, 'discard', changeManager);
                viewParams.onTabStripContentChanged(ChangeManager.Entity.SHOPPING_CART.name, false);
              })
              .finally(() => {
                ViewModelUtils.setPreloaderVisibility(false);
              });
            break;
        }
      };

      this.identityKeyClickHandler = function(event) {
        const path = event.target.attributes['data-path'].value;
        if (CoreUtils.isUndefinedOrNull(path)) return;

        ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/configuration/${encodeURIComponent(path)}`, self.canExitCallback);
        viewParams.onTabStripContentVisible(false);
      }.bind(this);

      this.parentIdentityKeyClickHandler = function(event) {
        const dataKey = event.target.attributes['data-key'].value;
        const ele = document.querySelector('[name=\'' + dataKey +'\']');
        if (event.target.classList.contains('oj-fwk-icon-arrow03-e')) {
          event.target.classList.remove('oj-fwk-icon-arrow03-e');
          event.target.classList.add('oj-fwk-icon-arrow03-s');
          ele.style.display = 'inline-block';
        }
        else {
          event.target.classList.remove('oj-fwk-icon-arrow03-s');
          event.target.classList.add('oj-fwk-icon-arrow03-e');
          ele.style.display = 'none';
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

      function createChangeManagerDOM(content){
        let bindHtml = '<table id=\'change-manager-table\'>';
        for (const [key, value] of Object.entries(content)) {
          bindHtml += '<tr>';
          bindHtml += '<td class=\'table-key\'>' + key + '</td><td>' + value + '</td>';
          bindHtml += '</tr>';
        }
        bindHtml += '</table>';
        return { view: HtmlUtils.stringToNodeArray(bindHtml) };
      }

      function createAdditionsDOM(content){
        let bindHtml = '<p/>';
        if (content.length > 0) {
          bindHtml = '<table id=\'additions-table\'>';

          let data = {};

          content.forEach((entry) => {
            bindHtml += '<tr>';
            bindHtml += '<td class=\'table-key\'>';
            bindHtml += '<a href=\'#\' on-click=\'[[identityKeyClickHandler]]\' data-path=\'' + entry.resourceData + '\'>';
            bindHtml += '/' + entry.label;
            bindHtml += '</a>';
            bindHtml += '</tr>';
          });

          bindHtml += '</table>';
        }
        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self };
      }

      function createModificationsDOM(content){
        function getValueLabelsArray(value) {
          const labelsArray = [];
          for (const i in value) {
            labelsArray.push(value[i].value.label);
          }
          return JSON.stringify(labelsArray);
        }

        let bindHtml = '<p/>';
        if (content.length > 0) {
          bindHtml = '<table id=\'modifications-table\'>';

          let identityKeyHtml = '', identityProperty = '', pathLinkMap = {}, pathLink = '', pathKey;

          content.forEach((entry) => {
            pathLink = entry.bean.resourceData;
            pathKey = entry.bean.resourceData;
            if (!(pathLink in pathLinkMap)) {
              identityKeyHtml = '<tr>';
              identityKeyHtml += '<td class=\'table-key\'>';
              identityKeyHtml += '<a href=\'#\' on-click=\'[[parentIdentityKeyClickHandler]]\'>';
              identityKeyHtml += '<span class=\'oj-component-icon oj-clickable-icon-nocontext oj-fwk-icon-arrow03-e\' data-key=\'' + pathKey + '\'></span>';
              identityKeyHtml += '</a>';
              identityKeyHtml += '<a href=\'#\' on-click=\'[[identityKeyClickHandler]]\' data-path=\'' + pathLink + '\'>';
              identityKeyHtml += '/' + entry.bean.label;
              identityKeyHtml += '</a>';
              identityKeyHtml += '</td>';
              identityKeyHtml += '</tr>';
              identityKeyHtml += '<tr>';
              identityKeyHtml += '<td>';
              identityKeyHtml += '<pre class=\'table-key-content\' name=\'' + pathKey + '\'>';
              identityKeyHtml += '%%INNER_HTML%%</pre>';
              identityKeyHtml += '</td>';
              identityKeyHtml += '</tr>';

              pathLinkMap[pathLink] = {outerHtml: identityKeyHtml};
            }

            let innerHtml = '';

            entry.properties.forEach((property) => {
              const ovalue = property.oldValue.value;
              if (CoreUtils.isNotUndefinedNorNull(ovalue)) {
                innerHtml += '&nbsp;&nbsp;&nbsp;&nbsp;';
                innerHtml += property.label;
                innerHtml += ':<br/>';
                innerHtml += '\toldValue=';
                if (Array.isArray(ovalue)) {
                  innerHtml += getValueLabelsArray(ovalue) + '\n';
                }
                else if (ovalue != null){
                  innerHtml += (typeof ovalue === 'object' ? JSON.stringify(ovalue) : ovalue) + '\n';
                }
              }

              const nvalue = property.newValue.value;
              if (CoreUtils.isNotUndefinedNorNull(nvalue)) {
                innerHtml += '\tnewValue=';
                if (Array.isArray(nvalue)) {
                  innerHtml += getValueLabelsArray(nvalue) + '\n';
                }
                else if (nvalue != null){
                  innerHtml += (typeof nvalue === 'object' ? JSON.stringify(nvalue) : nvalue) + '\n';
                }
              }
              else {
                innerHtml += '\tnewValue=' + nvalue + ',\tset=' + property.newValue + '\n';
                innerHtml += '\n';
              }
            });

            if (pathLinkMap[pathLink].outerHtml.indexOf(identityProperty + '</a>:') === -1) {
              pathLinkMap[pathLink].outerHtml = pathLinkMap[pathLink].outerHtml.replace('%%INNER_HTML%%', innerHtml + '%%INNER_HTML%%');
            }
          });

          // Remove trailing "%%INNER_HTML%%" from each pathLinkMap
          // entry, and then append the entry to bindHtml variable
          Object.values(pathLinkMap).forEach((textblock) => {
            bindHtml += textblock.outerHtml.replace('%%INNER_HTML%%', '');
          });

          bindHtml += '</table>';
        }
        Logger.log(bindHtml);
        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self };
      }

      function createRemovalsDOM(content){
        let bindHtml = '<p/>';
        if (content.length > 0) {
          bindHtml = '<table id=\'removals-table\'>';

          let data = {};

          content.forEach((entry) => {
            bindHtml += '<tr>';
            bindHtml += '<td class=\'table-key\'>';
            bindHtml += '/' + entry.label;
            bindHtml += '</td>';
            bindHtml += '</tr>';
          });

          bindHtml += '</table>';
        }

        return { view: HtmlUtils.stringToNodeArray(bindHtml) };
      }

      function createRestartDOM(content){
        let bindHtml = '<p/>';
        if (content.length > 0) {
          bindHtml = '<table id=\'restart-table\'>';

          let data = {};

          content.forEach((entry) => {
            bindHtml += '<tr>';
            bindHtml += '<td class=\'table-key\'>';
            bindHtml += '<a href=\'#\' on-click=\'[[identityKeyClickHandler]]\' data-path=\'' + entry.resourceData + '\'>';
            bindHtml += '/' + entry.label;
            bindHtml += '</a>';
            bindHtml += '</tr>';
          });

          bindHtml += '</table>';
        }
        return { view: HtmlUtils.stringToNodeArray(bindHtml), data: self};
      }

    }

    return ShoppingCartTabTemplate;
  }
);
