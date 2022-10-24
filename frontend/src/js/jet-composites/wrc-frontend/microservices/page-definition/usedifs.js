/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['./common', 'wrc-frontend/core/utils'],
  function (PageDefinitionCommon, CoreUtils) {

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
        function isModelToken(newValue) {
          return (
            CoreUtils.isNotUndefinedNorNull(newValue) &&
            (typeof newValue === 'string') &&
            newValue.startsWith('@@PROP:') &&
            newValue.endsWith('@@'));
        }

        // Extract properties that have a usedIf JS property
        const usedIfProperties = properties.filter(property => CoreUtils.isNotUndefinedNorNull(property.usedIf));

        for (const property of usedIfProperties) {
          const name = property.name;
          const usedIf = property.usedIf;

          let propertyName;

          if (form.createForm) {
            const replacer = form.createForm.getBackingDataAttributeReplacer(usedIf.property);
            // If replacer is not undefined, we're in a create form that
            // is the "Data Source" wizard. If that's the case, assign
            // replacer to propertyName. Otherwise, assign usedIf.property
            // to propertyName.
            propertyName = (CoreUtils.isNotUndefinedNorNull(replacer) ? replacer : usedIf.property);
          }
          else {
            propertyName = usedIf.property;
          }

          const toggleDisableFunc = (newValue) => {
            if (!isWdtForm) {
              // We're in an adminserver provider
              if (form[`${PageDefinitionCommon.FIELD_UNSET}${name}`]() ||
                  form[`${PageDefinitionCommon.FIELD_UNSET}${propertyName}`]()) {
                // Prevent a property from becoming enabled/disabled
                // when value has been unset
                return;
              }
            }

            // We're not in an adminserver provider
            if (isModelToken()) {
              // Value assigned to newValue is a model token, so
              // enable the field (i.e. set the FIELD_DISABLED
              // knockout observable to false).
              form[`${PageDefinitionCommon.FIELD_DISABLED}${name}`](false);
            }
            else {
              // Use arrow function syntax of find function on
              // the usedIf.values array, to enable or disable
              // the field (i.e. set the FIELD_DISABLED
              // knockout observable to false or true).
              usedIf.values.find((value) => {
                if ((typeof value === 'boolean') && (typeof newValue === 'boolean')) {
                  // This means that usedIf.values is an array containing
                  // a single boolean, and the data type of newValue is
                  // also a boolean. If value is true, then equate it to
                  // newValue. Otherwise, use value assigned to newValue.
                  const enabled = (value ? value === newValue : newValue);
                  // Negate enabled variable to come up with value to use
                  // with knockout variable.
                  form[`${PageDefinitionCommon.FIELD_DISABLED}${name}`](!enabled);
                }
                else if (CoreUtils.isUndefinedOrNull(newValue) || (newValue === '')) {
                  // It's possible for newValue to be undefined or an empty.
                  // string (''). The latter happens if the user chooses the
                  // "Reset to default" context menu item. In both cases, we
                  // need to enable the field (i.e. set the FIELD_DISABLED
                  // knockout observable to false).
                  form[`${PageDefinitionCommon.FIELD_DISABLED}${name}`](false);
                }
                else {
                  // This means usedIf.values is an array containing one or
                  // more strings. Use includes function to determine if the
                  // newValue is in that array or not.
                  const enabled = usedIf.values.includes(newValue);
                  // Negate enabled variable to come up with value to use
                  // with knockout variable.
                  form[`${PageDefinitionCommon.FIELD_DISABLED}${name}`](!enabled);
                }
              });
            }

          };

          // Need to invoke callback programmatically, because
          // the field with the usedIf JS property has a value
          // BEFORE the knockout change subscription is created.
          // This invocation is what allows the usedIf field to
          // have the correct state, when the slice/tabstrip is
          // initially displayed.
          toggleDisableFunc(form[`${PageDefinitionCommon.FIELD_VALUES}${propertyName}`]());

          // Look for knockout change subscription in the
          // cache, with a name equal to name.
          const subscribed = form.subscriptions.find(subscription => subscription.name === name);
          if (CoreUtils.isUndefinedOrNull(subscribed)) {
            // Didn't find one, so create one using the propertyName
            // variable.
            const subscription = form[`${PageDefinitionCommon.FIELD_VALUES}${propertyName}`].subscribe(toggleDisableFunc);
            // Now, cache it using the name variable for the name.
            form.subscriptions.push({name: name, subscription: subscription});
          }

        } // end of for-of
      }

    };

  }
);
