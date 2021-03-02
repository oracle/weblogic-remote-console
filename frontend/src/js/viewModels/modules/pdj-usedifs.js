/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojlogger', '../../cfe/common/utils'],
  function (Logger, Utils) {

    //public:
    return {
      /**
       * Returns one of the following:
       * <ol>
       *   <li>The "sections" array items under pdjData.createForm.sections, which DO NOT have a nested "sections" array. This is typically a single "sections" array item. which has the properties that initially need to be displayed.</li>
       *   <li>All the "sections" array items under pdjData.createForm.sections, because they all have a nested "sections" array</li>
       * </ol>
       * @param createForm
       * @returns {[object]}
       */
      getSections: function (createForm) {
        let sections = [];
        if (typeof createForm.sections !== "undefined") {
          // Find "sections" array items under pdjData.createForm.sections
          // that DO NOT have a nested "sections" array.
          sections = createForm.sections.filter(section => (typeof section.sections === "undefined"));

          if (sections.length === 0) {
            // All the "sections" arrays under pdjData.createForm.sections
            // have a nested "sections" array, so return all of them.
            sections = createForm.sections.filter(section => (typeof section.sections !== "undefined"));
          }
          else if (typeof sections[0].properties !== "undefined") {
            const properties = this.filterSectionsUsedIfProperties(sections);
            if (properties.length > 0) {
              sections = [];
              sections.push({properties: properties});
            }
          }
        }

        return sections;
      },

      /**
       * Get all "sections" array items with a `usedIf.property` equal to a given `propertyName`. Optionally, use a given `value` to filter results based on the strings in the `usedIf.values` array field.
       * @param {object} sections The "sections" array items to search in
       * @param {string} propertyName The name to match with value assigned to `usedIf.property` field
       * @param {string} value The value to match with a string in the `usedIf.values` array field
       * @param {string} parentValue
       * @return {[object]} Array of marching "sections" array items. An empty array ([]) is returned if there is no match
       */
      getUsedIfSections: function (sections, propertyName, value, parentValue) {
        let matchedSections = [];
        if (typeof sections !== "undefined") {
          if (typeof value !== "undefined" && value !== null && !Array.isArray(value)) {
            if (typeof value === "number") value = value.toString();
            matchedSections = sections.filter(section => typeof section.usedIf !== "undefined" && section.usedIf.property === propertyName && section.usedIf.values.includes(value));
            if (matchedSections.length === 0) {
              if (typeof parentValue !== "undefined") {
                // Sometimes the usedIf.values array we're trying to match
                // has value in it. Other times it has parentValue + "_" value
                // in it. Try to match again, using the latter.
                value = value.replace(parentValue + "_", "");
                matchedSections = sections.filter(section => typeof section.usedIf !== "undefined" && section.usedIf.property === propertyName && section.usedIf.values.includes(value));
              }
            }
          } else {
            matchedSections = sections.filter(section => typeof section.usedIf !== "undefined" && section.usedIf.property === propertyName);
          }
        }

        return matchedSections;
      },

      getAttributesUsedIfSections: function (sections) {
        let matchedSections = [];
        if (typeof sections !== "undefined") {
          matchedSections = sections.filter(section => (typeof section.usedIf !== "undefined"));
        }
        return matchedSections;
      },

      getUsedIfSectionsProperties: function (usedIf) {
        const parentValue = (typeof usedIf.parent !== "undefined" ? usedIf.parent.value : undefined);
        const sections = this.getUsedIfSections(usedIf.sections, usedIf.fieldName, usedIf.fieldValue, parentValue);
        let properties = [];
        if (sections.length === 1) {
          if (typeof sections[0].properties !== "undefined") {
            properties = this.getSectionsProperties(sections);
          }
          else {
            properties = sections[0].sections[0].properties;
          }
        }
        else if (sections.length > 1) {
          properties = this.getSectionsProperties(sections);
        }
        return properties;
      },

      getUsedIfSectionsPropertyNames: function (sections) {
        let propertyNames = [], properties = this.getSectionsProperties(sections);
        if (properties.length > 0) {
          for (const value of properties.values()) {
            propertyNames.push(value.name);
          }
        }
        return propertyNames;
      },

      getSectionsProperties: function (sections) {
        let properties = [];
        if (typeof sections !== "undefined") {
          sections.forEach((section) => {
            if (typeof section.properties !== "undefined") {
              section.properties.forEach((property) => {
                properties.push(property);
              });
            }
          });
        }
        return properties;
      },

      filterSectionsUsedIfProperties: function (sections) {
        let properties = [];
        const filteredProperties = sections.filter(section => typeof section.usedIf === "undefined");
        if (filteredProperties.length === 1) {
          properties = filteredProperties[0].properties;
        }
        return properties;
      }
    };
  }
);
