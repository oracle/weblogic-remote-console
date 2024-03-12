/**
 * @license
 * Copyright (c) 2023, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'wrc-frontend/common/keyup-focuser',
  'wrc-frontend/core/utils'
],
  function (
    oj,
    ko,
    KeyUpFocuser,
    CoreUtils
  ) {
    function ProviderIconbar() {
      this.i18n = {
        'icons': {
          'info': {
            iconFile: 'data-providers-info-icon-brn_24x24', visible: ko.observable(true),
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.info.tooltip')
          },
          'edit': {
            iconFile: 'data-providers-manage-icon-brn_24x24', visible: ko.observable(true),
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.edit.tooltip')
          },
          'deactivate': {
            iconFile: 'data-providers-deactivate-icon-brn_24x24', visible: ko.observable(true),
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.deactivate.tooltip')
          },
          'delete': {
            iconFile: 'data-providers-delete-icon-brn_24x24', visible: ko.observable(true),
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.delete.tooltip')
          }
        }
      };
      this.providerDataItemActions = [];
    }

    function onMouseEnter(event) {
      const listItemId = event.currentTarget.getAttribute('id');
      $(`#${listItemId}-iconbar`).css({'visibility':'visible'});
    }
    
    function onMouseLeave(event) {
      const listItemId = event.currentTarget.getAttribute('id');
      $(`#${listItemId}-iconbar`).css({'visibility':'hidden'});
    }
    
    function setCurrentIconbar(dataItemId) {
      const node = $(`#${dataItemId.value}-iconbar`);
      node.css({'visibility': 'visible'});
    }

    function clearPreviousIconbar(dataIconbar) {
      if (dataIconbar && dataIconbar.value) {
        $(dataIconbar.value).css({'visibility': 'hidden'});
      }
    }

    function setFocusIconbarIcon(dataItemAction) {
      $(`a[data-item-action="${dataItemAction}"]`).focus();
    }

    function setTabIndexForCSSSelector(parentElement, cssSelector) {
      const nodeList = parentElement.querySelectorAll(cssSelector);
      if (nodeList !== null) {
        nodeList.forEach((node) => {
          node.setAttribute('tabindex', '0');
        });
      }
      return nodeList;
    }
    
    function setIconbarIconKeyUpHandler(dataItemId) {
      this.providerDataItemActions = [];
      const dataIconbar = document.getElementById(`${dataItemId.value}-iconbar`);
      if (dataIconbar !== null) {
        const nodeList = setTabIndexForCSSSelector(dataIconbar, '.cfe-project-provider-iconbar-link');
        if (nodeList !== null) {
          nodeList.forEach((node) => {
            this.providerDataItemActions.push(node.getAttribute('data-item-action'));
            node.onkeyup = (event) => {
              if (event.key === 'ArrowLeft' && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
                event.preventDefault();
                const dataItemId = event.currentTarget.attributes['data-item-id'];
                if (CoreUtils.isNotUndefinedNorNull(dataItemId)) {
                  const focusRule = KeyUpFocuser.getFocusRule('.cfe-project-provider-iconbar', 'ArrowRight');
                  if (CoreUtils.isNotUndefinedNorNull(focusRule)) {
                    clearPreviousIconbar(focusRule.dataIconbar);
                    $(`a[data-item-id="${dataItemId.value}"]`).focus();
                  }
                  this.providerDataItemActions = [];
                }
              }
              else if (event.key === 'ArrowRight' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
                event.preventDefault();
                setFocusDataItemAction.call(this, 'ArrowRight', event.currentTarget.attributes['data-item-action'].value);
              }
              else if (event.key === 'ArrowLeft' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
                event.preventDefault();
                setFocusDataItemAction.call(this, 'ArrowLeft', event.currentTarget.attributes['data-item-action'].value);
              }
            };
          });
        }
      }
    }

    function setFocusDataItemAction(key, dataItemAction) {
      let index;
      
      if (key === 'Tab') {
        setFocusIconbarIcon(0);
      }
      else if (key === 'ArrowRight') {
        index = this.providerDataItemActions.indexOf(dataItemAction);
        if (index !== -1) {
          index = (index + 1 < this.providerDataItemActions.length ? index + 1 : 0);
          setFocusIconbarIcon(this.providerDataItemActions[index]);
        }
      }
      else if (key === 'ArrowLeft') {
        index = this.providerDataItemActions.indexOf(dataItemAction);
        if (index !== -1) {
          index = (index - 1 >= 0 ? index - 1 : this.providerDataItemActions.length - 1);
          setFocusIconbarIcon(this.providerDataItemActions[index]);
        }
      }
    }
    
    function isFocusable(cssSelector) {
      return (document.querySelector(cssSelector) !== null);
    }
    
  //public:
    ProviderIconbar.prototype = {
      getI18N: function () { return this.i18n; },
      destroy: function(listItems) {
        if (CoreUtils.isNotUndefinedNorNull(listItems)) {
          for (const listItem of listItems) {
            $(`#${listItem.id}`)
              .off('mouseenter', this.onMouseEnter)
              .off('mouseleave', this.onMouseLeave);
          }
        }
        this.providerDataItemActions = [];
      },
      setIconbarIconsState: function(changedState) {
        if (CoreUtils.isNotUndefinedNorNull(changedState)) {
          this.i18n.icons.edit.visible(!changedState.settings?.local);
          this.i18n.icons.deactivate.visible(!changedState.settings?.local && changedState.state === 'connected');
          this.i18n.icons.delete.visible(!changedState.settings?.local);
        }
      },
      getDataItemActions: function() {
        return Object.freeze(this.providerDataItemActions);
      },
      deactivateListItem: function(listItemId) {
        this.providerDataItemActions = [];
        setTabIndexForCSSSelector(document, `li[id="${listItemId}"]`);
      },
      clearDataItemActions: function() {
        this.providerDataItemActions = [];
      },
      onKeyUpFocuserNavigateKeyEvent: function (event, focusRule) {
        const dataItemId = event.currentTarget.attributes['data-item-id'];
        event.preventDefault();
        if (CoreUtils.isNotUndefinedNorNull(dataItemId)) {
          if (focusRule.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            const cssSelector = `a[data-item-id="${dataItemId.value}"]`;
            if (isFocusable(cssSelector)) {
              $(cssSelector).focus();
            }
          }
          else if (focusRule.key === 'ArrowRight' && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            clearPreviousIconbar(focusRule.dataIconbar);
            setCurrentIconbar(dataItemId);
            focusRule['dataIconbar'] = {value: `#${dataItemId.value}-iconbar`};
            setIconbarIconKeyUpHandler.call(this, dataItemId);
            setFocusIconbarIcon('info');
          }
          else if (focusRule.key === 'ArrowLeft' && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            focusRule = KeyUpFocuser.getFocusRule('.cfe-project-provider-iconbar', 'ArrowRight');
            if (CoreUtils.isNotUndefinedNorNull(focusRule)) {
              clearPreviousIconbar(focusRule.dataIconbar);
              event.currentTarget.focus();
            }
            this.providerDataItemActions = [];
          }
        }
      },

      registerKeyUpFocuser: function(id) {
        let result = KeyUpFocuser.getKeyUpCallback(id);

        if (!result.alreadyRegistered) {
          result = KeyUpFocuser.register(
            id,
            {
              Tab: {key: 'Tab', action: 'navigate', callback: this.onKeyUpFocuserNavigateKeyEvent.bind(this)},
              ArrowRight: {key: 'ArrowRight', action: 'navigate', callback: this.onKeyUpFocuserNavigateKeyEvent.bind(this)},
              ArrowLeft: {key: 'ArrowLeft', action: 'navigate', callback: this.onKeyUpFocuserNavigateKeyEvent.bind(this)}
            },
            {}
          );
        }

        return result.keyUpCallback;
      },
      
      addProviderListItem: function(listItemId) {
        $(`#${listItemId}`)
          .on('mouseenter', onMouseEnter)
          .on('mouseleave', onMouseLeave);
      },
      
      addEventListeners: function(listItems) {
        if (CoreUtils.isNotUndefinedNorNull(listItems)) {
          for (const listItem of listItems) {
            $(`#${listItem.id}`)
              .on('mouseenter', onMouseEnter)
              .on('mouseleave', onMouseLeave);
          }
        }
      }

    };

    // Return the class constructor
    return ProviderIconbar;
  }
);