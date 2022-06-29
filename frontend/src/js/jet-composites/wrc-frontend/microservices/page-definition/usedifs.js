/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (CoreUtils, Logger) {

    const FIELD_DISABLED = Object.freeze('fieldDisabled_');
    const FIELD_UNSET = Object.freeze('fieldUnset_');
    const FIELD_MESSAGES = Object.freeze('fieldMessages_');
    const FIELD_SELECTDATA = Object.freeze('fieldSelectData_');
    const FIELD_VALUES = Object.freeze('fieldValues_');

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
        if (typeof createForm.sections !== 'undefined') {
          // Find "sections" array items under pdjData.createForm.sections
          // that DO NOT have a nested "sections" array.
          sections = createForm.sections.filter(section => (typeof section.sections === 'undefined'));

          if (sections.length === 0) {
            // All the "sections" arrays under pdjData.createForm.sections
            // have a nested "sections" array, so return all of them.
            sections = createForm.sections.filter(section => (typeof section.sections !== 'undefined'));
          }
          else if (typeof sections[0].properties !== 'undefined') {
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
        if (typeof sections !== 'undefined') {
          if (typeof value !== 'undefined' && value !== null && !Array.isArray(value)) {
            if (typeof value === 'number') value = value.toString();
            matchedSections = sections.filter(section => typeof section.usedIf !== 'undefined' && section.usedIf.property === propertyName && section.usedIf.values.includes(value));
            if (matchedSections.length === 0) {
              if (typeof parentValue !== 'undefined') {
                // Sometimes the usedIf.values array we're trying to match
                // has value in it. Other times it has parentValue + "_" value
                // in it. Try to match again, using the latter.
                if (typeof value === 'string' && value.indexOf(`${parentValue}'_'`) !== -1) value = value.replace(parentValue + '_', '');
                matchedSections = sections.filter(section => typeof section.usedIf !== 'undefined' && section.usedIf.property === propertyName && section.usedIf.values.includes(value));
              }
            }
          } else {
            matchedSections = sections.filter(section => typeof section.usedIf !== 'undefined' && section.usedIf.property === propertyName);
          }
        }

        return matchedSections;
      },

      getAttributesUsedIfSections: function (sections) {
        let matchedSections = [];
        if (typeof sections !== 'undefined') {
          matchedSections = sections.filter(section => (typeof section.usedIf !== 'undefined'));
        }
        return matchedSections;
      },

      getUsedIfSectionsProperties: function (usedIf) {
        const parentValue = (typeof usedIf.parent !== 'undefined' ? usedIf.parent.value : undefined);
        const sections = this.getUsedIfSections(usedIf.sections, usedIf.fieldName, usedIf.fieldValue, parentValue);
        let properties = [];
        if (sections.length === 1) {
          if (typeof sections[0].properties !== 'undefined') {
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
        if (typeof sections !== 'undefined') {
          sections.forEach((section) => {
            if (typeof section.properties !== 'undefined') {
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
        const filteredProperties = sections.filter(section => typeof section.usedIf === 'undefined');
        if (filteredProperties.length === 1) {
          properties = filteredProperties[0].properties;
        }
        return properties;
      },

      setupUsedIfListeners: function (properties, isWdtForm, form) {
        const usedIfProperties = properties.filter(property => CoreUtils.isNotUndefinedNorNull(property.usedIf));

        usedIfProperties.forEach((property) => {
          let propertyName, name = property.name, usedIf = property.usedIf;

          if (form.createForm) {
            const replacer = form.createForm.getBackingDataAttributeReplacer(usedIf.property);
            // replacer is only used with the property names used
            // in the JDBC System Resource wizard. Only assign it
            // to propertyName, if it's not undefined.
            propertyName = (CoreUtils.isNotUndefinedNorNull(replacer) ? replacer : usedIf.property);
          }
          else {
            propertyName = usedIf.property;
          }

          let toggleDisableFunc = (newValue, pType) => {
            // Prevent a property from becoming enabled/disabled
            // when value has been unset
            if (!isWdtForm) {
              if (form[`${FIELD_UNSET}${name}`]() || form[`${FIELD_UNSET}${propertyName}`]()) {
                Logger.log(`[FORM] Prevent usedIf handling for unset field: ${name}`);
                return;
              }
            }

            // If the new value is a Model Token, always enable the field.
            if (CoreUtils.isNotUndefinedNorNull(newValue) &&
                (typeof newValue === 'string') &&
                newValue.startsWith('@@PROP:') &&
                newValue.endsWith('@@')) {
              form[`${FIELD_DISABLED}${name}`](false);
            }
            else {
              // See if the new value enables the field or not
              let enabled = usedIf.values.find((item) => {
                // if we are comparing to true/false (ie boolean), and the value is undefined
                // of newValue === "" which is the case when user restore to default
                // we want to enable the dependant field.
                // we can only test for true/false here because in this call back, we don't have access
                // to the pdjTypes of this field
                if (isWdtForm &&
                    (item === true || item === false) &&
                    (CoreUtils.isUndefinedOrNull(newValue) || newValue === '')) {
                  return true;
                }
                return item === newValue;
              }
            );
            form[`${FIELD_DISABLED}${name}`](!enabled);
          }
        };

        // Call event callback to initialize, then set up
        // subscription.
        const oneProp = properties.find(element => element.name === propertyName);
        let pType = '';
        if (CoreUtils.isNotUndefinedNorNull(oneProp)) {
          pType = oneProp.type;
        }
        toggleDisableFunc(form[`${FIELD_VALUES}${propertyName}`](), pType);
        const subscription = form[`${FIELD_VALUES}${propertyName}`].subscribe(toggleDisableFunc);
        form.subscriptions.push(subscription);
      });
    }

  };
  }
);
