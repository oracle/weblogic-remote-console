/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class representing the metadata for the Menu associated with a MenuLauncher
 * @module
 * @class
 * @classdesc Class representing the metadata for A
 */
define(
  function(){
    /**
     * Create metadata for a app-profile
     * @constructor
     * @param {string} id
     * @param [isDefault=false]
     * @param [isPrivate=false]
     */
    function AppProfile(id, isDefault = false, isPrivate = false) {
      this.id = id;
      this.isDefault = isDefault;
      this.isPrivate = isPrivate;
      this.tabs = [];
    }
  
    /**
     *
     * @param {string} tabId
     * @returns {object}
     * #private
     */
    const getTab = (tabId) => {
      let tab;
      if (tabId) {
        tab = this.tabs.find(item => item.name === tabId);
      }
      return tab;
    };

    const addTab = (profile, tabId, sections, schema) => {
      if (Array.isArray(sections)) {
        const index = schema.tabs.map(item => item.id).indexOf(tabId);
        if (index !== -1) {
          const tab = schema.tabs[index];
          profile.tabs.push({
            name: tab.id,
            label: tab.label,
            visible: tab.visible,
            disabled: tab.disabled,
            sections: []
          });
          for (const entry of tab.sections) {
            const section = {
              name: entry.id,
              label: entry.label,
              visible: entry.visible,
              disabled: entry.disabled,
              fields: []
            };
            const entry1 = sections.find(item => item.id === entry.id);
            if (typeof entry1 !== 'undefined') {
              profile.tabs.at(-1).sections.push(section);
            }
          }
        }
      }
    };

    const addFields = (profile, tabId, sectionId, fields, schema) => {
      if (Array.isArray(fields)) {
        const index = schema.tabs.map(item => item.id).indexOf(tabId);
        if (index !== -1) {
          const tab = schema.tabs[index];
          profile.tabs.push({
            name: tab.id,
            label: tab.label,
            visible: tab.visible,
            disabled: tab.disabled
          });
          const section = tab.sections.find(item => item.name === sectionId);
          if (section) {
            profile.tabs.at(-1)['sections'] = [];
            profile.tabs.at(-1).sections.push({
              name: section.id,
              label: section.label,
              visible: section.visible,
              disabled: section.disabled,
              fields: []
            });
            for (const entry of section.fields) {
              const field = {
                name: entry.id,
                label: entry.label,
                type: entry.type,
                optional: !entry.required,
                default: entry.default,
                visible: entry.visible,
                disabled: entry.disabled
              };
              const entry1 = fields.find(item => item.id === entry.id);
              if (typeof entry1 !== 'undefined') field['value'] = entry1.value;
              profile.tabs.at(-1).sections.at(-1).fields.push(field);
            }
          }
        }
      }
    };

    const getTabSections = (profile, tabId) => {
      let tab = {sections: []};
      if (tabId) {
        tab = profile.tabs.find(item => item.name === tabId);
      }
      return tab.sections;
    };

    const getSectionFields = (profile, tabId, sectionId) => {
      let section = {fields: []};
      if (tabId) {
        const tab = profile.tabs.find(item => item.name === tabId);
        if (tab) {
          section = tab.sections.find(item => item.name === sectionId);
        }
      }
      return section.fields;
    };

  //public:
    AppProfile.prototype = {
      id: () => { return this.id;},
      /**
       *
       * @param {boolean|undefined} value
       * @returns {boolean}
       */
      isDefault: (value) => {
        if (typeof value === 'boolean') { this.isDefault = value; } return this.isDefault || false;
      },
      getTabs: () => { return this.tabs},
      getTab: getTab,
      addTab: addTab,
      addFields: addFields,
      getTabSections: getTabSections,
      getSectionFields: getSectionFields
    };
    
    return AppProfile;
  }
);