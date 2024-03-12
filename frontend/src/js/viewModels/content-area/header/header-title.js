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
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils'
],
function (
  oj,
  ko,
  ViewModelUtils,
  CoreUtils
) {
    function HeaderTitle() {
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

      this.headerTitle = {
        visible: ko.observable(false),
        label: ko.observable(''),
        description: ko.observable(''),
        classList: ko.observable('cfe-provider-icon'),
        provider: ko.observable({
          type: 'adminserver',
          id: 'cahid',
          state: 'connected',
          settings: {
            local: false
          }
        })
      };
    }

    function setTitle(title) {
      if (CoreUtils.isUndefinedOrNull(title)) {
        title = createEmptyTitle();
      }
      this.headerTitle.label(title.label);
      this.headerTitle.description(title.description);
      this.headerTitle.classList(title.classList);
      this.headerTitle.provider(title.provider);
/*
//MLW
      These individual checks for undefined and null are not
      needed, because the createEmptyTitle() function always
      returns a title with defined and not null values.

      if (CoreUtils.isNotUndefinedNorNull(title.label)) this.headerTitle.label(title.label);
      if (CoreUtils.isNotUndefinedNorNull(title.description)) this.headerTitle.description(title.description);
      if (CoreUtils.isNotUndefinedNorNull(title.classList)) this.headerTitle.classList(title.classList);
      if (CoreUtils.isNotUndefinedNorNull(title.provider)) this.headerTitle.provider(title.provider);
 */
    }

    function createEmptyTitle() {
      return {
        label: '',
        description: '',
        classList: 'cfe-provider-icon',
        provider: {
          type: 'adminserver',
          id: 'cahid',
          state: 'connected',
          settings: {
            local: false,
          }
        }
      };
    }

    function createTitle(beanTree) {
      let title = createEmptyTitle();

      if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
        title.label = (['ancillary','home'].includes(beanTree.type) ? oj.Translations.getTranslatedString('wrc-content-area-header.title.home') : oj.Translations.getTranslatedString(`wrc-content-area-header.title.${beanTree.type}`));
        title.classList = 'cfe-provider-icon';
      }
 
      if (CoreUtils.isNotUndefinedNorNull(beanTree.provider)) {
        title.label = `${title.label} (`;
        title['provider'] = {
          type: beanTree.provider.type,
          id: beanTree.provider.id,
          name: beanTree.provider.name,
          state: title.provider.state,
          settings: {
            local: title.provider.settings.local
          }
        };
        title['description'] = `${title.provider.name} )`;
        const classList = ViewModelUtils.getCustomCssProperty(`data-provider-${beanTree.provider.type}-classList`);
        title.classList = `${classList} ${title.classList}`;
      }
      else {
        title['description'] = '';
        title['provider'] = {
          type: 'adminserver',
          id: 'cahid',
          state: 'connected',
          settings: {
            local: false
          }
        };
      }

      return title;
    }

  //public:
    HeaderTitle.prototype = {
      getI18N: function() {
        return Object.freeze(this.i18n);
      },
      getValue: function() {
        return Object.freeze(this.headerTitle);
      },
      change: function(beanTree) {
        const title = createTitle(beanTree);
        setTitle.call(this, title);
      },
      setEmpty: function() {
        const title = createEmptyTitle();
        setTitle.call(this, title);
      },
      visibility: function(state) {
        if (typeof state === 'boolean') {
          this.headerTitle.visible(state);
        }
      },
      setIconbarIconsState: function(changedState) {
        if (CoreUtils.isNotUndefinedNorNull(changedState)) {
          this.i18n.icons.edit.visible(!changedState.settings?.local);
          this.i18n.icons.deactivate.visible(!changedState.settings?.local && changedState.state === 'connected');
          this.i18n.icons.delete.visible(!changedState.settings?.local);
        }
      }
    };

    // Return the class constructor
    return HeaderTitle;
  }
);