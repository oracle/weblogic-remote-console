/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojhtmlutils',
    'wrc-frontend/microservices/tips/tips-manager',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/apis/message-displaying',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/utils',
    'ojs/ojknockout',
    'ojs/ojmodule-element',
    'ojs/ojmodule',
    'ojs/ojcheckboxset'
  ],
  function (
    oj,
    ko,
    ArrayDataProvider,
    HtmlUtils,
    TipsManager,
    ViewModelUtils,
    MessageDisplaying,
    Runtime,
    CoreUtils
  ) {
    function TipsTemplate(viewParams) {
      const self = this;
      
      this.i18n = {
        'icons': {
          'ancillary': {
            'contentItem': {
              id: 'tips',
              iconFile: 'tips-icon-blk_24x24',
              tooltip: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.tips.label')
            }
          },
          'close': {
            iconFile: 'dialog-close-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.buttons.close.label')
          },
          'filter': {
            iconFile: 'oj-ux-ico-filter',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.filter.value')
          }
        },
        'popups': {
          'tips': {
            'title': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.title'),
            'checkboxes': {
              'hideall': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.hideall'),
              'productivity': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.productivity'),
              'personalization': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.personalization'),
              'whereis': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.whereis'),
              'accessibility': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.accessibility'),
              'connectivity': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.connectivity'),
              'security': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.security'),
              'other': oj.Translations.getTranslatedString('wrc-ancillary-content.popups.tips.checkboxes.other')
            }
          }
        },
        'titles': {
          'ancillary': {
            'contentItem': {value: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.tips.label')}
          }
        }
      };
      
      this.tabNode = 'tips';
      this.canExitCallback = viewParams.canExitCallback;
      this.tipsCards = [];
      this.allCategories = ko.observable([]);
      this.includedCategories = ko.observableArray([]);
      this.filteredTipsCards = ko.observableArray();
      
      this.signalBindings = [];
      
      this.connected = function () {
        self.tipsCards = loadTipsCards();
        self.allCategories(loadAllCategories());
        self.includedCategories(TipsManager.getCategories());
        self.tipsFiltersChanged();
        
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
      
      function loadTipsCards() {
        const dataArray = TipsManager.getAllVisible();
        
        dataArray.forEach((tip) => {
          tip['tag'] = oj.Translations.getTranslatedString(`wrc-ancillary-content.tips.labels.${tip.category}.value`);
          tip['title'] = oj.Translations.getTranslatedString(`wrc-ancillary-content.tips.cards.${tip.id}.title`);
          tip['content'] = {
            view: HtmlUtils.stringToNodeArray(oj.Translations.getTranslatedString(`wrc-ancillary-content.tips.cards.${tip.id}.descriptionHTML`).replace('on-click', 'on-click="[[tipsItemClickHandler]]"')),
            data: self
          };
        });
        
        return dataArray;
      }
      
      function loadAllCategories() {
        const dataArray = TipsManager.getAllCategories();
        
        dataArray.forEach((category) => {
          category['label'] = oj.Translations.getTranslatedString(`wrc-ancillary-content.tips.labels.${category.id}.value`);
          category['option'] = oj.Translations.getTranslatedString(`wrc-ancillary-content.popups.tips.checkboxes.${category.id}`);
        });
        
        return dataArray;
      }
      
      this.tipsFiltersChanged = (event) => {
        if (CoreUtils.isNotUndefinedNorNull(event)) {
          if (event.detail.value[0] === 'hideall') {
            if (event.detail.value.length === 2) {
              self.includedCategories(self.includedCategories().filter(category => category !== 'hideall'));
            }
            else {
              self.includedCategories(['hideall']);
            }
          }
          else if (event.detail.value.length === 0 &&
            event.detail.previousValue[0] === 'hideall'
          ) {
            self.includedCategories(TipsManager.getCategories());
          }
        }
        self.filteredTipsCards(self.tipsCards.filter(card => self.includedCategories().includes(card.category)));
      };
      
      this.onOjFocus = function (event) {
        removeDialogResizableHandleNodes(event);
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
      
      this.tipsItemClickHandler = function(event) {
        const attr = event.currentTarget.attributes['data-url'];
        if (CoreUtils.isNotUndefinedNorNull(attr)) {
          const dataUrl = attr.value.replace('@@docsURL@@', Runtime.getDocsURL());
          ViewModelUtils.openExternalURL(dataUrl);
        }
      };
      
      this.launchTipsFilterPopup = function (event) {
        openTipsFilterPopup('tipsFilterPopup');
      };
      
      function openTipsFilterPopup(popupElementId) {
        const popup = closeTipsFilterPopup(popupElementId);
        if (popup !== null) {
          popup.open();
        }
      }
      
      function closeTipsFilterPopup(popupElementId) {
        const popup = document.getElementById(popupElementId);
        if (popup !== null) {
          if (popup.isOpen()) popup.close();
        }
        return popup;
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
    
    return TipsTemplate;
  }
);