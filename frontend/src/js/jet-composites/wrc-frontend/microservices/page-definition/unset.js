/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'ojs/ojlogger'],
  function(oj, Logger) {

    const CONTEXT_MENU_PREFIX = Object.freeze('contextMenu_');
    const FIELD_HIGHLIGHT_CLASS = Object.freeze('cfe-field-highlight');

    const i18n = {
      menu: {
        label: oj.Translations.getTranslatedString('wrc-pdj-unset.menu.label')
      },
      placeholder: {
        value: oj.Translations.getTranslatedString('wrc-pdj-unset.placeholder.value')
      }
    };

    /** Get the property name from the context menu event */
    function getPropertyName(event) {
      return event.currentTarget.id.substring(CONTEXT_MENU_PREFIX.length);
    }

    /** Get the field for the specified property name from the document */
    function getField(propertyName) {
      return document.getElementById(propertyName);
    }

  //public:
    return {
      /** Add the highlighting class to the field */
      addHighlightClass: function (field) {
        field.classList.add(FIELD_HIGHLIGHT_CLASS);
      },

      /** Add the highlighting class to the property */
      addPropertyHighlight: function (propertyName) {
        const field = getField(propertyName);
        if (field != null) {
          this.addHighlightClass(field);
        }
      },

      /** Add the context menu with the unset action for the specified property name to the field */
      addContextMenu: function (propertyName, field) {
        let contextMenu = document.createElement('oj-menu');
        contextMenu.setAttribute('id', `${CONTEXT_MENU_PREFIX}${propertyName}`);
        contextMenu.setAttribute('slot', 'contextMenu');
        contextMenu.setAttribute('on-oj-action', '[[contextMenuClickListener]]');
        let menuItem = document.createElement('oj-option');
        menuItem.setAttribute('id', 'unset');
        let span = document.createElement('span');
        span.innerText = i18n.menu.label;
        menuItem.append(span);
        contextMenu.append(menuItem);
        field.append(contextMenu);
      },

      /** Handle the context menu unset event and return the action information */
      getAction: function (event) {
        // Setup context for the unset action
        const propertyName = getPropertyName(event);
        Logger.info('Handling contextMenu event unset action for: ' + propertyName);

        // Handle the event and return the action information
        return this.getPropertyAction(propertyName);
      },

      /** Perform handling for the property and return the action information */
      getPropertyAction: function (propertyName) {
        // Get the field used for the unset action
        const field = getField(propertyName);
        if (field == null) {
          return null;
        }

        // Setup a placehodler and remove the higlighting
        field.setAttribute('placeholder', i18n.placeholder.value);
        field.classList.remove(FIELD_HIGHLIGHT_CLASS);

        // Return the action information for the property
        return { field: propertyName, disabled: true, unset: true };
      }

    };
  }
);
