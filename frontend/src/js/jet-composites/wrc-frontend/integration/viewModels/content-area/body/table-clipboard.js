/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'wrc-frontend/core/parsers/yaml',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils'
],
function (
  oj,
  YamlParser,
  MessageDisplaying,
  ViewModelUtils,
  CoreUtils
) {
    function copyTableMenuAction(name, options) {
      const table = document.querySelector(options.selector);

      if (table !== null) {
        if (name === 'copyText') {
          const text = getTableAsText(table);
          copyTableToClipboard(text);
        }
        else if (name === 'copyJSON') {
          const json = contentAsJSON(table);
          copyTableToClipboard(JSON.stringify(json));
        }
        else if (name === 'copyYAML') {
          getTableAsYAML(table)
            .then(yaml => {
              copyTableToClipboard(yaml);
            })
            .catch(err => {
              MessageDisplaying.displayMessage({
                severity: 'error',
                summary: err
              });
            });
        }
      }
    }

    function copyTableToClipboard(content) {
      navigator.permissions.query({name: 'clipboard-write'})
        .then(result => {
          if (result.state === 'granted' || result.state === 'prompt') {
            const start = async (content) => {
              try {
                await navigator.clipboard.writeText(content);
                MessageDisplaying.displayMessage({
                  severity: 'confirmation',
                  summary: oj.Translations.getTranslatedString('wrc-common.messages.tableCopiedToClipboard.summary')
                }, 2500);
              }
              catch (err) {
                MessageDisplaying.displayMessage({
                  severity: 'error',
                  summary: err
                });
              }
            };
            start(content);
          }
          else {
            MessageDisplaying.displayMessage({
              severity: 'error',
              summary: oj.Translations.getTranslatedString('wrc-common.messages.browserPermissionDenied.summary'),
              detail: oj.Translations.getTranslatedString('wrc-common.messages.browserPermissionDenied.detail')
            });
          }
        })
        .catch(failure => {
          MessageDisplaying.displayMessage({
            severity: 'error',
            summary: failure
          }, 5000);
        });
    }

    function contentAsJSON(table) {
      const headers = table.columns.filter(column => !column.name.startsWith('_')).map(({name}) => name);
      const rows = [];
      for (const row of table.data.data) {
        const entry = {};
        for (const [key, value] of Object.entries(row)) {
          if (headers.includes(key)) entry[key] = value;
        }
        if (Object.keys(entry).length > 0) rows.push(entry);
      }
      return {
        headers: headers,
        rows: rows
      };
    }

    function getTableAsText(table) {
      const headers = table.columns.filter(column => !column.name.startsWith('_')).map(({name}) => name);
      const json = contentAsJSON(table);
      let text = `"${json.headers.join('","')}"\n`;
      for (const row of json.rows) {
        const values = [];
        for (const [key, value] of Object.entries(row)) {
          values.push(value.data);
        }
        text += `"${values.join('","')}"\n`;
      }
      return text;
    }

    function getTableAsYAML(table) {
      const json = contentAsJSON(table);
      return YamlParser.dump(json)
        .then(yaml => {
          return Promise.resolve(yaml);
        })
    }

  //public:
    return {
      contentAsJSON: function (table) {
        return contentAsJSON(table);
      },
      getTableAsText: function (table) {
        return getTableAsText(table);
      },
      getTableAsYAML: function (table) {
        return getTableAsYAML(table);
      },
      getContextMenuOptions: function (i18n) {
        return  {
          onMenuAction: '[[onContextMenuAction]]',
          onBeforeOpen: '[[onContextMenuBeforeOpen]]',
          menuItems: [
            {
              id: i18n.contextMenus.copyCellData.id,
              iconFile: i18n.contextMenus.copyCellData.iconFile,
              label: i18n.contextMenus.copyCellData.label
            },
            {
              id: i18n.contextMenus.copyRowData.id,
              iconFile: i18n.contextMenus.copyRowData.iconFile,
              label: i18n.contextMenus.copyRowData.label
            },
            {
              id: i18n.contextMenus.copyTableAsText.id,
              iconFile: i18n.contextMenus.copyTableAsText.iconFile,
              label: i18n.contextMenus.copyTableAsText.label
            },
            {
              id: i18n.contextMenus.copyTableAsJSON.id,
              iconFile: i18n.contextMenus.copyTableAsJSON.iconFile,
              label: i18n.contextMenus.copyTableAsJSON.label
            },
            {
              id: i18n.contextMenus.copyTableAsYAML.id,
              iconFile: i18n.contextMenus.copyTableAsYAML.iconFile,
              label: i18n.contextMenus.copyTableAsYAML.label
            }
          ]
        }
      },
      onContextMenuAction: function (event) {
        const getClipboardData = (ele, menuItemId) => {
          let clipboardData = '';
          switch (menuItemId) {
            case 'copyCellData':
              clipboardData = ele.getAttribute('data-clipboard-copycelldata');
              break;
            case 'copyRowData':
              clipboardData = ele.getAttribute('data-clipboard-copyrowdata');
              break;
          }
          return clipboardData;
        };
  
        const getConfirmationMessageSummary = (clipboardData, menuItemId) => {
          let messageSummary = oj.Translations.getTranslatedString('wrc-common.messages.dataCopiedToClipboard.summary');
          switch (menuItemId) {
            case 'copyCellData':
              if (clipboardData === '') messageSummary = oj.Translations.getTranslatedString('wrc-common.messages.emptyCellData.detail');
              break;
            case 'copyRowData':
              if (clipboardData === '') messageSummary = oj.Translations.getTranslatedString('wrc-common.messages.emptyRowData.detail');
              break;
          }
          return messageSummary;
        };
  
        const showConfirmationMessage = (message, clipboardData) => {
          if (clipboardData !== '') {
            ViewModelUtils.blurActiveElement();
            ViewModelUtils.copyToClipboard(clipboardData)
              .then(() => {
                MessageDisplaying.displayMessage({
                  severity: message.severity,
                  summary: message.message
                }, 2500);
              })
              .catch(failure => {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              });
          }
          else {
            MessageDisplaying.displayMessage({
              severity: message.severity,
              summary: message.message
            }, 2500);
          }
        };
  
        const ele = document.getElementById('table');
  
        if (ele !== null) {
          const menuItemId = event.detail.selectedValue;
          const clipboardData = getClipboardData(ele, menuItemId);
          const messageSummary = getConfirmationMessageSummary(clipboardData, menuItemId);
    
          showConfirmationMessage({
              severity: 'confirmation',
              message: messageSummary
            },
            clipboardData
          );
        }
      },
  
      onContextMenuBeforeOpen: function (event) {
        const target = event.detail.originalEvent.target;
        if (CoreUtils.isNotUndefinedNorNull(target)) {
          if (target.innerText === '' && target.parentElement.innerText === '') {
            event.preventDefault();
            return false;
          }
          else {
            const ele = document.getElementById('table');
            if (ele !== null) {
              ele.setAttribute('data-clipboard-copycelldata', target.innerText);
              ele.setAttribute('data-clipboard-copyrowdata', target.parentElement.innerText.replace(/^\t/, ''));
            }
          }
        }
      }
    };

  }
);