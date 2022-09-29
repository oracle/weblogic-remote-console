/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojlogger', './utils' , 'wrc-frontend/core/utils'],
  function (Logger, PageDefinitionUtils, CoreUtils) {

    //This is also defined in fields.js
    const NULL_VALUE = Object.freeze('___NULL___');

    /**
     * PageDataTypes Constructor
     *
     * @parm pdjTypes containing an array of PDJ property type information
     * @parm perspectiveId containing the current perspective
     */
    function PageDataTypes(pdjTypes, perspectiveId) {
      this.isConfigData = true;

      // Index the types by the property name one time
      let types = {};
      for (let i in pdjTypes) {
        types[pdjTypes[i].name] = pdjTypes[i];
      }
      this.pdjTypes = types;
    }

    /**
     * Functions that operate using the PDJ type information.
     *
     * The caller is responsible for ensuring that the property
     * is contained in the type information from the constructor.
     */
    PageDataTypes.prototype = {

      /** Return the PDJ type information for the property */
      getPDJType: function(propertyName) {
        return this.pdjTypes[propertyName];
      },

      /** Return the help summary for the property */
      getHelpInstruction: function(propertyName) {
        let retval = null;
        if (this.pdjTypes[propertyName].helpSummaryHTML !== undefined)
          retval = this.pdjTypes[propertyName].helpSummaryHTML;
        return retval;
      },

      /** Return the help details for the property */
      getHelpDetailed: function(propertyName) {
        let retval = null;
        if (this.pdjTypes[propertyName].detailedHelpHTML !== undefined)
          retval = this.pdjTypes[propertyName].detailedHelpHTML;
        return retval;
      },

      /** Return the externalHelp object for the property */
      getExternalHelp: function(propertyName) {
        let retval = null;
        if (this.pdjTypes[propertyName].externalHelp !== undefined)
          retval = this.pdjTypes[propertyName].externalHelp;
        return retval;
      },

      /** Return the combined help data for the property */
      getFullHelp: function(propertyName) {
        let helpDetailed = this.getHelpDetailed(propertyName);

        if (helpDetailed == null) {
          helpDetailed = '<p>No help description found.</p>';
        }

        let result = helpDetailed;
        let externalHelp = this.getExternalHelp(propertyName);
        if (externalHelp != null) {
          let label = externalHelp.label;
          let link = label;
          let javadocHref = externalHelp.href;
          if (javadocHref !== undefined) {
            link = '<a target=_blank rel=noopener href=' + javadocHref + '>' + label + '</a>';
          }
          result = helpDetailed + '<p> MBean Attribute:<br><code>' + link + '</code></p>'
        }
        return result;
      },

      /** Return the type value for the property */
      getType: function(propertyName) {
        let retval = 'string';
        if (this.pdjTypes[propertyName].type !== undefined)
          retval = this.pdjTypes[propertyName].type;
        return retval;
      },

      /** Check if the property is an array type */
      isArray: function(propertyName) {
        return (this.pdjTypes[propertyName].array === true);
      },

      /** Check if the property is read only */
      isReadOnly: function(propertyName) {
        return (this.pdjTypes[propertyName].readOnly === true);
      },

      /** Check if the property requires restart */
      isRestartNeeded: function(propertyName) {
        return (this.pdjTypes[propertyName].restartNeeded === true);
      },

      /** Check if the property supports Model Tokens */
      isSupportsModelTokens: function(propertyName) {
        const rtnval = this.pdjTypes[propertyName].supportsModelTokens;
        return CoreUtils.isNotUndefinedNorNull(rtnval) ? rtnval : false;
      },

      /** Check if the property supports unresolved references */
      isSupportsUnresolvedReferences: function(propertyName) {
        const rtnval = this.pdjTypes[propertyName].supportsUnresolvedReferences;
        return CoreUtils.isNotUndefinedNorNull(rtnval) ? rtnval : false;
      },

      /** Check where the value comes from **/
      valueFrom: function(propertyName, rdjDataObject, alternateDataObject) {
        let rdjObject = rdjDataObject;

        if (alternateDataObject !== undefined) {
          rdjObject = alternateDataObject.value;
        }
        // Get the configuration data value as the monitoring
        // perspective data does not have an rdjDataObject.value
        if ((rdjObject != null) && (this.isConfigData)) {
          let value = rdjObject.value;
          if (CoreUtils.isNotUndefinedNorNull(value)){
            if (typeof value === 'string'  || typeof value === 'number' || typeof value === 'boolean'
              || value.value !== undefined || value.resourceData != undefined) {
              return 'fromRegValue';
            }
            else if ( value.unresolvedReference !== undefined){
              return 'fromUnresolvedReference';
            }
          }else if (CoreUtils.isNotUndefinedNorNull(rdjObject.modelToken)){
            return 'fromModelToken';
          }
        }
      },


      /** Check if the property is required */
      isRequired: function(propertyName) {
        let rtnval = false;
        if (typeof this.pdjTypes[propertyName].required !== 'undefined') {
          rtnval = this.pdjTypes[propertyName].required;
        }
        return rtnval;
      },

      /** Return the label value for the property */
      getLabel: function(propertyName) {
        let retval = propertyName;
        if (this.pdjTypes[propertyName].label !== undefined)
          retval = this.pdjTypes[propertyName].label;
        return retval;
      },

      /** Return the default value for the property or undefined when not specified */
      getDefaultValue: function(propertyName) {
        return this.pdjTypes[propertyName].defaultValue;
      },

      /** Return the legal values for the property or null */
      getLegalValues: function(propertyName) {
        let retval = null;
        if (this.pdjTypes[propertyName].legalValues !== undefined) {
          if( this.isNumberType(propertyName)) {
            let convertedValues = this.pdjTypes[propertyName].legalValues;
            for (let i in convertedValues) {
              convertedValues[i].value = Number(convertedValues[i].value);
            }
            retval = convertedValues;
          }else {
            retval = this.pdjTypes[propertyName].legalValues;
          }
        }
        return retval;
      },

      /** Return the presentation value of the specified key for the property */
      getFieldPresentation: function(propertyName, key) {
        let retval = null;
        if (this.pdjTypes[propertyName].presentation !== undefined) {
          let presentation = this.pdjTypes[propertyName].presentation;
          if (presentation[key] !== undefined) {
            retval = presentation[key];
            if (typeof retval === 'boolean') {
              retval = (retval ? 'true' : null);
            }
          }
        }
        return retval;
      },

      getInLineHelpPresentation: function(propertyName) {
        let result = '';
        let inLineHelp = this.getFieldPresentation(propertyName, 'inlineFieldHelp');
        if (inLineHelp !== null) {
          result = inLineHelp;
        }
        return result;
      },

      isDisplayAsHexPresentation: function(propertyName) {
        return (this.getFieldPresentation(propertyName, 'displayAsHex') !== null);
      },

      decConvertToHexString: function(decValue) {
        return '0x' + (+decValue).toString(16);
      },

      /** Check if the property has legal values */
      hasLegalValues: function(propertyName) {
        return (this.pdjTypes[propertyName].legalValues !== undefined);
      },

      /** Return the legal value label for the property or the property value when no legal values */
      getLegalValueLabel: function(propertyName, propertyValue) {
        let retval = propertyValue;
        if (this.hasLegalValues(propertyName)) {
          if (propertyValue === null){
            propertyValue = NULL_VALUE;
          }
          let values = this.getLegalValues(propertyName);
          for (let i in values) {
            let legalValue = values[i];
            if (legalValue.value === null){
              legalValue.value = NULL_VALUE;
            }
            if (legalValue.value === propertyValue) {
              retval = legalValue.label;
              break;
            }
          }
        }
        return retval;
      },

      /** Check if the property is a properties object */
      isPropertiesType: function(propertyName) {
        return (this.getType(propertyName) === 'properties');
      },

      /** Check if the property is a secret */
      isSecretType: function(propertyName) {
        return (this.getType(propertyName) === 'secret');
      },

      /** Check if the property is a boolean */
      isBooleanType: function(propertyName) {
        return (this.getType(propertyName) === 'boolean');
      },

      /** Check if the property is a string */
      isStringType: function(propertyName) {
        return (this.getType(propertyName) === 'string');
      },

      /** Check if the property is one of the number types */
      isNumberType: function(propertyName) {
        let result = false;
        switch(this.getType(propertyName)) {
          case 'int':
          case 'long':
          case 'double':
            result = true;
            break;
          default:
            result = false;
            break;
        }
        return result;
      },

      /** Check if the property is one of the reference types */
      isReferenceType: function(propertyName) {
        let result = false;
        switch(this.getType(propertyName)) {
          case 'reference':
          case 'reference-dynamic-enum':
            result = true;
            break;
          default:
            result = false;
            break;
        }
        return result;
      },

      /** Check if the property is a dynamic enum */
      isDynamicEnumType: function(propertyName) {
        return (this.getType(propertyName) === 'reference-dynamic-enum');
      },

      /** Check if the property is a uploadedFile */
      isUploadedFileType: function(propertyName) {
        return (this.getType(propertyName) === 'fileContents');
      },

      /** Check if the property is a multi-field */
      isMultiSelectType: function(propertyName) {
        return (this.isArray(propertyName) && this.isDynamicEnumType(propertyName));
      },

      /** Return the converted value for the property that was read from the observable */
      getConvertedObservableValue: function(propertyName, readValue) {
        let result = null;

        // Ensure a value was obtained in order to convert
        if ((readValue === undefined) || (readValue === null))
          return result;

        // Check for array type that is a string
        // Note: reference types are identity values
        if (this.isArray(propertyName) && this.isStringType(propertyName)) {
          return PageDefinitionUtils.getArrayOfStringConvertedValue(readValue, '\n');
        }

        // Address the remaining types where needed...
        switch(this.getType(propertyName)) {
          case 'int':
          case 'long':
          case 'double':
            if (isNaN(readValue)) {
              // Provides better error message
              result = readValue;
            }
            else {
              // Convert to a number
              result = Number(readValue);
            }
            break;

          case 'boolean':
            // Field returns a true or false
            result = readValue;
            break;

          case 'properties':
            if (readValue !== '') {
              // Convert to the JSON object of key = value
              result = PageDefinitionUtils.getPropertiesConvertedValue(readValue, '\n');
            }
            break;

          default:
            if (readValue === NULL_VALUE){
              result = null;
            }
            else
            // Remaining types are correct when not an empty string
            // and the empty string represents no value...
            if (readValue !== '') result = readValue;
            break;
        }
        return result;
      },

      getConvertedObservableValue_WDT_Multi: function(readValue, from) {
        if ( CoreUtils.isEmpty(readValue))
          return [];
        if (from === 'fromModelToken'){
          return {modelToken: readValue};
        }
      },

      getConvertedObservableValue_WDT: function(propertyName, readValue, from) {
        let result = null;

        // Ensure a value was obtained in order to convert
        if ((readValue === undefined) || (readValue === null))
          return result;

        // This is multiselect, such as Targets field.
        if (this.isArray(propertyName) &&  this.isReferenceType(propertyName)){
          return readValue;
        }

        if (from === 'fromModelToken'){
          return {modelToken: readValue};
        }
        if (from === 'fromUnresolvedReference'){
          return {
            label: readValue,
            unresolvedReference: readValue
          };
        }

        // Check for array type that is a string, eg. JNDI Names
        // Note: reference types are identity values
        if (this.isArray(propertyName) && this.isStringType(propertyName)) {
          return PageDefinitionUtils.getArrayOfStringConvertedValue(readValue, '\n');
        }

        // Address the remaining types where needed...
        switch(this.getType(propertyName)) {
          case 'int':
          case 'long':
          case 'double':
            if (isNaN(readValue)) {
              // Provides better error message
              result = readValue;
            }
            else {
              // Convert to a number
              result = Number(readValue);
            }
            break;

          case 'boolean':
            // Field returns a true or false
            result = readValue;
            break;

          case 'properties':
            if (readValue !== '') {
              // Convert to the JSON object of key = value
              result = PageDefinitionUtils.getPropertiesConvertedValue(readValue, '\n');
            }
            break;

          default:
            if (readValue === NULL_VALUE){
              result = null;
            }
            else
            // Remaining types are correct when not an empty string
            // and the empty string represents no value...
            if (readValue !== '') result = readValue;
            break;
        }
        return result;
      },

      /** Return the value to be used with the observable for the property */
      getObservableValue: function(propertyName, rdjDataObject, displayValue, alternateDataObject) {
        let result;
        let value = rdjDataObject;

        if (alternateDataObject !== undefined) {
          value = alternateDataObject.value;
        }
        else {
          // Get the configuration data value as the monitoring
          // perspective data does not have an rdjDataObject.value
          if ((value != null) && (this.isConfigData)) {
            value = rdjDataObject.value;
          }
        }

        // No data value, simply return the display value
        if (value === null) {
          return displayValue;
        }

        switch(this.getType(propertyName)) {
          case 'reference':
            if (displayValue === null) {
              // When there is no display value then return the actual value
              result = value;
            }
            else {
              Logger.log('INFO: Observable using display value of property: ' + propertyName);
              result = displayValue;
            }
            break;
          case 'properties':
            if (displayValue === null) {
              // When there is no display value then return the actual value
              result = value;
            }
            else {
              // For properties type, get a display value for a text area
              result = PageDefinitionUtils.getPropertiesDisplayValue(value, '\n');
            }
            break;
          case 'string':
            result = value;
            if ((displayValue !== null) && this.isArray(propertyName)) {
              // For a string array, get a display value for a text area
              result = PageDefinitionUtils.getArrayOfStringDisplayValue(value, '\n');
            }
            break;
          case 'int':
            result = value;
            if ((displayValue !== null) && this.isDisplayAsHexPresentation(propertyName)) {
              // For integer type with displayAsHex, get a display value for a text area
              result = displayValue;
            }
            break;
          default:
            result = value;
            break;
        }
        return result;
      },

      getObservableValue_WDT : function(propertyName, rdjDataObject, displayValue, alternateDataObject) {
        let result, value;
        let rdjObject = rdjDataObject;

        if (alternateDataObject !== undefined) {
          rdjObject = alternateDataObject;
        }
        if (CoreUtils.isNotUndefinedNorNull(rdjObject)) {
          if (CoreUtils.isNotUndefinedNorNull(rdjObject.modelToken)){
            return rdjObject.modelToken;
          }
          const valObject = rdjObject.value;
          if (typeof valObject !== 'undefined') {
            // valObject can be null, so guard against that
            if (valObject !== null && CoreUtils.isNotUndefinedNorNull(valObject.unresolvedReference)) {
              return valObject.unresolvedReference;
            }
            if (valObject !== null && CoreUtils.isNotUndefinedNorNull(valObject.value)) {
              value = valObject.value;
            }
            else {
              value = valObject;
            }
          }
        }

        // No data value, simply return the display value
        if (value === null) {
          return displayValue;
        }

        switch(this.getType(propertyName)) {
          case 'reference':
            if (displayValue === null) {
              // When there is no display value then return the actual value
              result = value;
            }
            else {
              Logger.log('INFO: Observable using display value of property: ' + propertyName);
              result = displayValue;
            }
            break;
          case 'properties':
            if (displayValue === null) {
              // When there is no display value then return the actual value
              result = value;
            }
            else {
              // For properties type, get a display value for a text area
              result = PageDefinitionUtils.getPropertiesDisplayValue(value, '\n');
            }
            break;
          case 'string':
            result = value;
            if ((displayValue !== null) && this.isArray(propertyName)) {
              // For a string array, get a display value for a text area
              result = PageDefinitionUtils.getArrayOfStringDisplayValue(value, '\n');
            }
            break;
          case 'int':
            result = value;
            if ((displayValue !== null) && this.isDisplayAsHexPresentation(propertyName)) {
              // For integer type with displayAsHex, get a display value for a text area
              result = displayValue;
            }
            break;
          default:
            result = value;
            break;
        }
        return result;
      },

      getObservableValueFrom : function(rdjDataObject) {
        if (CoreUtils.isNotUndefinedNorNull(rdjDataObject)) {
          if (CoreUtils.isNotUndefinedNorNull(rdjDataObject.modelToken)){
            return 'fromModelToken';
          }
          const valObject = rdjDataObject.value;
          if (typeof valObject !== 'undefined') {
            // valObject can still be null, so guard against it
            if (valObject !== null && CoreUtils.isNotUndefinedNorNull(valObject.unresolvedReference)) {
              return 'fromUnresolvedReference';
            }
          }
        }
        return 'fromRegValue';
      },

      /** Determine if the data value for the property indicates the value is actually set vs. defaulted */
      isValueSet: function (propertyName, rdjDataObject) {
        let result = false;

        // Only config data indicates when data value is set
        if (this.isConfigData && (rdjDataObject != null) && (rdjDataObject.set != null)) {
          result = (rdjDataObject.set === true);
        }

        return result;
      },

      /** Determine if the data value for the property contains the options sources */
      hasOptionsSources: function (propertyName, rdjDataObject) {
        let result = false;

        // Only config data provides the options sources
        if (this.isConfigData && (rdjDataObject != null) && (rdjDataObject.optionsSources != null)) {
          result = (rdjDataObject.optionsSources.length > 0);
        }
        return result;
      },

      /** Return the default value for the property to be used with the observable */
      getDefaultObservableValue: function(propertyName) {
        // Get the default from the page definition and use
        // an empty value when no default value is specified
        let result = this.getDefaultValue(propertyName);
        if (result === undefined) result = '';

        // Apply updates as needed for the type...
        switch(this.getType(propertyName)) {
          case 'properties':
            if (result === null) result = '';
            if (result !== '') {
              result = PageDefinitionUtils.getPropertiesDisplayValue(result, '\n');
            }
            break;
          case 'string':
            if (result === null) result = '';
            if (this.isArray(propertyName) && (result !== '')) {
              result = PageDefinitionUtils.getArrayOfStringDisplayValue(result, '\n');
            }
            break;
        }

        // Done.
        return result;
      },

      /** Return the displayed value for the property.  We probably should clear a
       * getDisplayValue_WDT like what we did for getObserveredValue.
       */
      getDisplayValue: function(propertyName, rdjDataObject, alternateDataObject) {
        let displayValue = null, value = null;
        let rdjObject = rdjDataObject;
        if (alternateDataObject !== undefined) {
          value = rdjObject = alternateDataObject;
        } else {
          // Get the configuration data value as the monitoring
          // perspective data does not have an rdjDataObject.value
          if ((rdjObject != null) && (this.isConfigData)) {
            value = rdjObject;
          }
        }
        if (CoreUtils.isUndefinedOrNull(rdjObject)){
          return '';
        }
        if (CoreUtils.isNotUndefinedNorNull(rdjObject.modelToken)) {
          return rdjObject.modelToken;
        }
        else
        if (CoreUtils.isNotUndefinedNorNull(rdjObject.value) && (CoreUtils.isNotUndefinedNorNull(rdjObject.value.unresolvedReference))){
          return rdjObject.value.unresolvedReference;
        }
        value = rdjObject.value;
        // Determine the display value based on the property type
        if (value != null) {
          if (this.isArray(propertyName)) {
            // The value is an array of data
            if (this.isReferenceType(propertyName)) {
              value = PageDefinitionUtils.getArrayOfNamesFromCollectionChild(value);
            }
            // All other array types display using the string conversion for that type
            displayValue = PageDefinitionUtils.getArrayOfStringDisplayValue(value, ', ');
          } else {
            // The value is NOT an array
            if (this.isReferenceType(propertyName)) {
              displayValue = PageDefinitionUtils.getNameFromCollectionChild(value);
            }
            else
            if (this.isPropertiesType(propertyName)) {
              displayValue = PageDefinitionUtils.getPropertiesDisplayValue(value, ', ');
            } else if (this.isDisplayAsHexPresentation(propertyName)) {
              displayValue = this.decConvertToHexString(value);
            }
            else if ((this.isNumberType(propertyName)) && (this.hasLegalValues(propertyName))) {
              displayValue = value;
            }
            else {
              // All other types display with a string conversion for that type
              displayValue = '' + value;
            }

            // Covert the value to the legal value display name when available
            displayValue = this.getLegalValueLabel(propertyName, displayValue);
          }
        }
        else
        if (this.hasLegalValues(propertyName) && this.isValueSet(propertyName,rdjObject)){
          displayValue = this.getLegalValueLabel(propertyName, displayValue);
        }
        return displayValue;
      }
    };

    // Return the class constructor
    return PageDataTypes;
  }
);