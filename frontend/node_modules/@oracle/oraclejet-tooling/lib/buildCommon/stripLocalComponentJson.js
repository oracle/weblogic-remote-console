/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const fs = require('fs-extra');
const path = require('path');
const util = require('../util');
const CONSTANTS = require('../constants');

/**
 *
 * Stripping implementation exported to buildCommon.js:
 */
function stripLocalComponentJson(context) {
  const componentsCache = util.getComponentsCache();
  util.getLocalCompositeComponents().forEach((_component) => {
    let pathToComponentJSON;
    let modifiedComponentJSON;
    let jsonFileContent;
    const { builtPath, componentJson } = componentsCache[_component];
    // Modify the component.json in staging by stripping the unwanted attributes and
    // sub-properties during run-time. This stripped json file is then included in
    // the web/../min/loader.js file. The original contents of the json file are restored in
    // restoreLocalCcaComponentJson after minification. Also, if the passed component is a
    // pack, we will need to iterate through its component dependencies. Failure to do so
    // will result in having non-stripped metadata in the component's min/loader.js file:
    if (util.isJETPack({ pack: _component, componentJson })) {
      const dependenciesFromCache = [
        ...Object.getOwnPropertyNames(componentJson.dependencies || {}),
        ...util.getMonoPackMemberNameList(componentJson)
      ];
      dependenciesFromCache.forEach((component) => {
        const componentData = componentsCache[component];
        if (componentData && componentData.builtPath) {
          pathToComponentJSON = path.join(componentData.builtPath, CONSTANTS.JET_COMPONENT_JSON);
          if (fs.readdirSync(componentData.builtPath).includes('loader.js')) {
            jsonFileContent = fs.readJSONSync(pathToComponentJSON);
            modifiedComponentJSON = getStrippedComponentJson(jsonFileContent);
            fs.writeJsonSync(pathToComponentJSON, modifiedComponentJSON);
          }
        }
      });
    } else {
      pathToComponentJSON = path.join(builtPath, CONSTANTS.JET_COMPONENT_JSON);
      jsonFileContent = fs.readJSONSync(pathToComponentJSON);
      modifiedComponentJSON = getStrippedComponentJson(jsonFileContent);
      fs.writeJsonSync(pathToComponentJSON, modifiedComponentJSON);
    }
  });
  return Promise.resolve(context);
}

/**
 *
 * @param {object} componentJSON
 * @returns {Object} modified componentJSON
 *
 * Strips off the attributes and their sub-properties that are not
 * needed during run time. The componentJSON object comes from staging
 * location but it is later on restored in restoreLocalCcaComponentJson:
 */
function getStrippedComponentJson(componentJSON) {
  // Top level attributes required at run-time (RT). Name and pack are not needed at RT,
  // but they are needed during the optimization of the pack's components:
  const requiredTopLevelAttributes = new Set([
    'properties',
    'methods',
    'events',
    'slots',
    'dynamicSlots',
    'pack',
    'name',
    'version',
    'dependencies',
    'jetVersion',
    'main'
  ]);
  // Go through the required attributes and remove the sub-properties not needed at RT:
  stripTopLevelAttributes(componentJSON, requiredTopLevelAttributes);
  return componentJSON;
}

/**
 *
 * @param {object} json
 * @param {Array} requiredAttributes
 *
 * Strips off the top level attributes that are not needed during run time.
 */
function deleteUnrequiredTopLevelAttributes(json, requiredAttributes) {
  const attributes = getAttributes(json);
  if (attributes) {
    attributes.forEach((attribute) => {
      if (!requiredAttributes.has(attribute)) {
        if (attribute === 'extension') {
          stripExtensionSubAttribute(json[attribute], json, attribute);
        } else {
          // eslint-disable-next-line no-param-reassign
          delete json[attribute];
        }
      }
    });
  }
}

/**
 *
 * @param {object} json
 * @returns {Array | undefined}
 *
 * Returns the names of the attributes of the passed object.
 */
function getAttributes(json) {
  if (isObject(json)) {
    return Object.getOwnPropertyNames(json);
  }
  return undefined;
}

/**
 *
 * @param {object} json
 * @returns {Boolean}
 *
 * Strips off the top level attributes that are not needed during run time.
 */
function isObject(json) {
  // Do not allow array objects:
  return json instanceof Object && !Array.isArray(json);
}

/**
 *
 * @param {object} componentJSON
 * @param {Array} requiredTopLevelAttributes
 *
 * Strips off sub-attributes of the needed top level attributes that are not needed during run time.
 */
function stripTopLevelAttributes(componentJSON, requiredTopLevelAttributes) {
  // Remove non-object top-level attributes not needed at RT:
  deleteUnrequiredTopLevelAttributes(componentJSON, requiredTopLevelAttributes);
  requiredTopLevelAttributes.forEach((topLevelAttribute) => {
    if (isObject(componentJSON[topLevelAttribute]) && topLevelAttribute !== 'dependencies') {
      const subAttributes = getAttributes(componentJSON[topLevelAttribute]);
      if (subAttributes) {
        subAttributes.forEach((subAttribute) => {
          stripSubAttributes(componentJSON[topLevelAttribute][subAttribute]);
        });
        // Delete the resulting object if empty:
        if (isEmpty(componentJSON[topLevelAttribute])) {
          // eslint-disable-next-line no-param-reassign
          delete componentJSON[topLevelAttribute];
        }
      }
    }
  });
}

/**
 *
 * @param {object} attributeObject
 *
 * Strip the sub-attributes from the top level componentJson
 * properties. Go through the passed object recursively and
 * remove the unrequired sub-attributes.
 */
function stripSubAttributes(attributeObject) {
  const attributes = getAttributes(attributeObject);
  attributes.forEach((attribute) => {
    stripSubAttribute(attributeObject[attribute], attributeObject, attribute);
  });
}

/**
 *
 * @param {string} attributeName
 * @param {object} attributeObject
 * @param {object} subAttributeObject -- attributeObject[attributeName]
 *
 * Strip the sub-attributes. Go through the passed object recursively and
 * remove the unrequired sub-attributes.
 */
function stripSubAttribute(subAttributeObject, attributeObject, attributeName) {
  if (isAttributeProtectedFromStripping(attributeName)) {
    return;
  }

  if (!isNeededSubAttribute(attributeName) && !isObject(subAttributeObject)) {
    // eslint-disable-next-line no-param-reassign
    delete attributeObject[attributeName];
    return;
  }

  if (attributeName === 'extension') {
    stripExtensionSubAttribute(subAttributeObject, attributeObject, attributeName);
    if (isEmpty(subAttributeObject)) {
      // eslint-disable-next-line no-param-reassign
      delete attributeObject[attributeName];
    }
    return;
  }

  const attributes = getAttributes(subAttributeObject);
  if (!attributes) {
    return;
  }

  attributes.forEach((attribute) => {
    stripSubAttribute(subAttributeObject[attribute], subAttributeObject, attribute);
  });
  deleteAttribute(subAttributeObject, attributeObject, attributeName);
}

/**
 *
 * @param {string} subAttribute
 * @returns {Boolean}
 *
 * Checks if the passed attribute is a needed sub-attribute.
 */
function isNeededSubAttribute(subAttribute) {
  const requiredSubAttributes = new Set([
    'enumValues',
    'properties',
    'readOnly',
    'type',
    'value',
    'binding',
    'writeback',
    'internalName',
    'consume',
    'provide',
    'name',
    'default',
    'transform',
    'extension',
    'implicitBusyContext'
  ]);
  if (requiredSubAttributes.has(subAttribute)) {
    return true;
  }
  return false;
}

/**
 *
 * @param {string} subAttribute
 * @returns {Boolean}
 *
 * Checks if the passed attribute is a needed non-required sub-attribute.
 */
function isNeededExtensionSubAttribute(subAttribute) {
  const nonRequiredSubAttributes = new Set([
    'description',
    'displayName',
    'tags',
    'coverImage',
    'screenshots',
    'jet',
    'vbdt',
    'audits',
    'package',
    'docUrl',
    'itemProperties',
    'webelement',
    'readme',
    'unsupportedBrowsers',
    'businessApprovals',
    'uxSpecs',
    'unsupportedThemes',
    'defaultColumns',
    'minColumns',
    'itemProperties',
    'slotData',
    'exceptionStatus',
    'catalog',
    'oracle',
    'themes'
  ]);
  if (nonRequiredSubAttributes.has(subAttribute)) {
    return false;
  }
  return true;
}

/**
 *
 * @param {string} attributeName
 * @param {object} attributeObject
 * @param {object} subAttributeObject -- attributeObject[attributeName]
 *
 * Strip the extension sub-attributes. Go through the passed object recursively and
 * remove the unrequired sub-attributes.
 */
function stripExtensionSubAttribute(subAttributeObject, attributeObject, attributeName) {
  if (!isNeededExtensionSubAttribute(attributeName)) {
    // eslint-disable-next-line no-param-reassign
    delete attributeObject[attributeName];
    return;
  }
  const attributes = getAttributes(subAttributeObject);
  if (!attributes) {
    return;
  }

  attributes.forEach((attribute) => {
    stripExtensionSubAttribute(subAttributeObject[attribute], subAttributeObject, attribute);
  });
  deleteExtensionSubAttribute(subAttributeObject, attributeObject, attributeName);
}

/**
 *
 * @param {string} parentAttributeName
 * @param {object} parentAttributeObject
 * @param {object} childAttributeObject -- parentAttributeObject[parentAttributeName]
 * @returns {Boolean}
 *
 * Deletes the unrequired attribute at RT:
 */
function deleteAttribute(childAttributeObject, parentAttributeObject, parentAttributeName) {
  const attributes = getAttributes(childAttributeObject);
  if (attributes) {
    attributes.forEach((attribute) => {
      if (!isNeededSubAttribute(attribute) && !isObject(childAttributeObject[attribute])) {
        // eslint-disable-next-line no-param-reassign
        delete childAttributeObject[attribute];
      }
      if (isEmpty(childAttributeObject)) {
        // eslint-disable-next-line no-param-reassign
        delete parentAttributeObject[parentAttributeName];
      }
    });
    if (isEmpty(childAttributeObject)) {
      // eslint-disable-next-line no-param-reassign
      delete parentAttributeObject[parentAttributeName];
    }
  }
}

/**
 *
 * @param {string} parentAttributeName
 * @param {object} parentAttributeObject
 * @param {object} childAttributeObject -- parentAttributeObject[parentAttributeName]
 * @returns {Boolean}
 *
 * Deletes the unrequired attribute at RT:
 */
// eslint-disable-next-line max-len
function deleteExtensionSubAttribute(childAttributeObject, parentAttributeObject, parentAttributeName) {
  const attributes = getAttributes(childAttributeObject);
  if (attributes) {
    attributes.forEach((attribute) => {
      if (!isNeededExtensionSubAttribute(attribute) && !isObject(childAttributeObject[attribute])) {
        // eslint-disable-next-line no-param-reassign
        delete childAttributeObject[attribute];
      }
      if (isEmpty(childAttributeObject)) {
        // eslint-disable-next-line no-param-reassign
        delete parentAttributeObject[parentAttributeName];
      }
    });
    if (isEmpty(childAttributeObject)) {
      // eslint-disable-next-line no-param-reassign
      delete parentAttributeObject[parentAttributeName];
    }
  }
}

/**
 *
 * @param {object} json
 * @returns {Boolean}
 *
 * Checks if the passed object is empty.
 */
function isEmpty(json) {
  if (isObject(json) && JSON.stringify(json) === '{}') {
    return true;
  }
  return false;
}

/**
 *
 * @param {object} json
 * @returns {Boolean}
 *
 * Checks if the passed attribute is protected from the stripping process
 */
function isAttributeProtectedFromStripping(attribute) {
  const protectedValues = [
    'value'
  ];

  return protectedValues.includes(attribute);
}

module.exports = stripLocalComponentJson;
