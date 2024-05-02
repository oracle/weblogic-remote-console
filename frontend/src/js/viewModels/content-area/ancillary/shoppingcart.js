/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', 'wrc-frontend/core/utils/keyset-utils', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/change-management/change-manager', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojaccordion', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojrowexpander'],
  function(oj, ko, ArrayDataProvider, HtmlUtils, keySet, keySetUtils, Runtime, ChangeManager, PerspectiveManager, PageDefinitionUtils, ViewModelUtils, CoreUtils, Logger){
    function ShoppingCartTabTemplate(viewParams) {
      const self = this;

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
            {id: 'discard-tab-button', iconFile: ko.observable('oj-ux-ico-cart-abandon'), disabled: ko.observable(true), visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-shoppingcart.icons.discard.tooltip')
            },
            {id: 'commit-tab-button', iconFile: ko.observable('oj-ux-ico-cart-add'), disabled: ko.observable(true), visible: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-shoppingcart.icons.commit.tooltip')
            }
          ])
        },
        'icons': {
          'ancillary': {
            'contentItem': {
              id: 'shoppingcart',
              iconFile: ko.observable('shopping-cart-non-empty-blk_24x24'),
              tooltip: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.shoppingcart.label')
            }
          },
          'close': {
            iconFile: 'dialog-close-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.buttons.close.label')
          }
        },
        'titles': {
          'ancillary': {
            'contentItem': {value: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.shoppingcart.label')}
          }
        }
      };

      this.tabNode = ChangeManager.Entity.SHOPPING_CART.name;
      this.canExitCallback = viewParams.canExitCallback;
      this.perspective = undefined;

      this.signalBindings = [];

      this.connected = function () {
        let binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });
  
        self.signalBindings.push(binding);
      };

      this.disconnected = function () {
        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });
        self.signalBindings = [];
      };
  
      this.onOjFocus = function (event) {
        removeDialogResizableHandleNodes(event);
        self.perspective = PerspectiveManager.current();
        loadChangeManagerSections();
      };
  
      this.onOjBeforeClose = function (event) {
        viewParams.onClose(self.tabNode);
      };
  
      this.closeIconClickHandler = function(event) {
        viewParams.onClose(self.tabNode);
      };
  
      this.getCachedState = () => {
        return {};
      };

      function checkLockOwner(){
        const changeManager = ChangeManager.getMostRecent();
        if (changeManager.isLockOwner) {
          loadChangeManagerSections();
        }
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
            expandChangeManagerSections();
            updateShoppingCartIconFile(data.changeManager);
          })
          .catch( error => {
            ViewModelUtils.failureResponseDefaultHandling(error);
          });
      }

      function updateShoppingCartIconFile(changeManager) {
        const iconFile = (changeManager.isLockOwner && changeManager.hasChanges ? 'shopping-cart-non-empty-tabstrip_24x24' : 'shopping-cart-empty-tabstrip_24x24');
        self.i18n.icons.ancillary.contentItem.iconFile(iconFile);
      }

      function updateChangeManagerSection(changeManager){
        if (changeManager !== null) {
          let section = self.changeManagerSections().find(item => item.id === ChangeManager.Section.CHANGE_MANAGER.name);
          section.content = changeManager;
          section.count(1);

          self.i18n.tabstrip.tabs().forEach((tabButton) => {
            setIconbarIconsEnablement(tabButton, !changeManager.hasChanges);
          });

          const ele = document.getElementById('shoppingcart-tab');
          if (ele !== null) ele.src = 'js/jet-composites/wrc-frontend/1.0.0/images/shopping-cart-' + (changeManager.hasChanges ? 'non-empty' : 'empty') + '-tabstrip_24x24.png';
        }
      }
  
      function setIconbarIconsEnablement(iconbarIcon, state) {
        if (CoreUtils.isNotUndefinedNorNull(iconbarIcon)) {
          const index = self.i18n.tabstrip.tabs().findIndex(item => item.id === iconbarIcon.id);
          if (index !== -1) {
            self.i18n.tabstrip.tabs()[index].disabled(state);
          }
        }
      }

      function setAllIconbarIconsEnablement(state) {
        for (const iconbarIcon of self.i18n.tabstrip.tabs()) {
          setIconbarIconsEnablement(iconbarIcon, state);
        }
      }
    
      this.shoppingCartTabButtonClickHandler = function(event) {
        function getButtonId(event) {
          let id;
          if (event.type === 'click') {
            if (event.target.localName === 'span') {
              // The id for the button will be on the event.target element, if the icon
              // was clicked with the mouse.
              id = event.target.id;
            }
            else if (event.pointerType === '') {
              // The id for the button will be on the event.target.firstElementChild
              // element, if the the Enter key was press when the icon had focus.
              if (event.target.firstElementChild.localName === 'span') {
                id = event.target.firstElementChild.id;
              }
            }
          }
          return id;
        }

        const buttonId = getButtonId(event);

        const tabButton = self.i18n.tabstrip.tabs().find(button => button.id === buttonId);
        if (typeof tabButton === 'undefined' || tabButton.disabled()) {
          event.preventDefault();
          return false;
        }

        switch(buttonId){
          case 'commit-tab-button':
            ViewModelUtils.setPreloaderVisibility(true);
            ChangeManager.commitChanges()
              .then((changeManager) => {
                viewParams.signaling.shoppingCartModified.dispatch(ChangeManager.Entity.SHOPPING_CART.name, 'commit', changeManager);
              })
              .finally(() => {
                ViewModelUtils.setPreloaderVisibility(false);
                viewParams.onClose(self.tabNode);
              });
            break;
          case 'discard-tab-button':
            ViewModelUtils.setPreloaderVisibility(true);
            ChangeManager.discardChanges()
              .then((changeManager) => {
                viewParams.signaling.shoppingCartModified.dispatch(ChangeManager.Entity.SHOPPING_CART.name, 'discard', changeManager);
              })
              .finally(() => {
                ViewModelUtils.setPreloaderVisibility(false);
                viewParams.onClose(self.tabNode);
              });
            break;
        }
      };

      this.identityKeyClickHandler = function(event) {
        const path = event.target.attributes['data-path'].value;
        if (CoreUtils.isUndefinedOrNull(path)) return;

        ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/configuration/${encodeURIComponent(path)}`, self.canExitCallback);
      }.bind(this);

      function handleParentIdentityEvent(node) {
        const attr = node.attributes['data-key'];
        if (CoreUtils.isNotUndefinedNorNull(attr)) {
          const dataKey = attr.value;
          const ele = document.querySelector('[name=\'' + dataKey +'\']');
          if (node.classList.contains('oj-fwk-icon-arrow03-e')) {
            node.classList.remove('oj-fwk-icon-arrow03-e');
            node.classList.add('oj-fwk-icon-arrow03-s');
            ele.style.display = 'inline-block';
          }
          else {
            node.classList.remove('oj-fwk-icon-arrow03-s');
            node.classList.add('oj-fwk-icon-arrow03-e');
            ele.style.display = 'none';
          }
        }
      }

      this.parentIdentityKeyClickHandler = function(event) {
        let attr = event.target.attributes['data-key'];
        if (CoreUtils.isNotUndefinedNorNull(attr)) {
          handleParentIdentityEvent(event.target);
        }
        else {
          attr = event.target.firstElementChild.attributes['data-key'];
          if (CoreUtils.isNotUndefinedNorNull(attr)) {
            handleParentIdentityEvent(event.target.firstElementChild);
          }
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

      function expandChangeManagerSections() {
        const nodeList = document.querySelectorAll('oj-accordion[id="shoppingcart-tab"] > oj-collapsible');
        if (nodeList !== null) {
          const arr = Array.from(nodeList);
          arr.forEach((node) => {
            expandChangeManagerSection(node.id);
            node.expanded = true;
          });
        }
      }

      function expandChangeManagerSection(id){
        const section = self.changeManagerSections().find(item => item.id === id);
        //regardless of the count, we need to rebuild the dom, otherwise, the
        //obsoleted changes will still be there when user expand each section.
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
        let bindHtml = '<table id=\'change-manager-table\' aria-hidden=\'true\'>';
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
          bindHtml = '<table id=\'additions-table\' aria-hidden=\'true\'>';

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
            const itemValue = value[i].value;
            const itemDisplay = CoreUtils.isNotUndefinedNorNull(itemValue.label) ? itemValue.label : itemValue;
            labelsArray.push(itemDisplay);
          }
          return JSON.stringify(labelsArray);
        }

        function getValueLabel(value) {
          var itemDisplay = value;
          if (typeof value === 'object') {
            itemDisplay = CoreUtils.isNotUndefinedNorNull(value.label) ? value.label : JSON.stringify(value);
          }
          return itemDisplay;
        }

        let bindHtml = '<p/>';
        if (content.length > 0) {
          bindHtml = '<table id=\'modifications-table\' aria-hidden=\'true\'>';

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
              innerHtml += '&nbsp;&nbsp;&nbsp;&nbsp;';
              innerHtml += property.label;
              innerHtml += ':<br/>';

              const ovalue = property.oldValue.value;
              if (CoreUtils.isNotUndefinedNorNull(ovalue)) {
                innerHtml += '\toldValue=';
                if (Array.isArray(ovalue)) {
                  innerHtml += getValueLabelsArray(ovalue) + '\n';
                }
                else if (ovalue != null){
                  innerHtml += getValueLabel(ovalue) + '\n';
                }
              }

              const nvalue = property.newValue.value;
              if (CoreUtils.isNotUndefinedNorNull(nvalue)) {
                innerHtml += '\tnewValue=';
                if (Array.isArray(nvalue)) {
                  innerHtml += getValueLabelsArray(nvalue) + '\n';
                }
                else if (nvalue != null){
                  innerHtml += getValueLabel(nvalue) + '\n';
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
          bindHtml = '<table id=\'removals-table\' aria-hidden=\'true\'>';

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
          bindHtml = '<table id=\'restart-table\' aria-hidden=\'true\'>';

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

      function removeDialogResizableHandleNodes(event) {
        const nodeList = document.querySelectorAll(`#${event.currentTarget.id} .oj-resizable-handle`);
        if (nodeList !== null) {
          let arr = Array.from(nodeList);
          for (let i in arr.reverse()) {
            const classList = nodeList[i].className.split(' ').filter(e => e);
            if (!['oj-resizable-w', 'oj-resizable-sw','oj-resizable-s'].includes(classList.at(-1))) {
              nodeList[i].remove();
            }
          }
        }
      }
    }

    return ShoppingCartTabTemplate;
  }
);
