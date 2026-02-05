/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const util = require('../util');
const fs = require('fs-extra');
const CONSTANTS = require('../constants');
const path = require('path');

/**
 * Restores the stripped of component.json from staging
 * location after calling stripLocalComponentJson in buildWeb:
 */
function restoreLocalComponentJson(context) {
  const componentsCache = util.getComponentsCache();
  util.getLocalCompositeComponents().forEach((_component) => {
    let pathToComponentJson;
    const { componentJson, builtPath } = componentsCache[_component];
    // Retrieve the component.json contents from cache and write them in web:
    if (util.isJETPack({ pack: _component, componentJson })) {
      const dependenciesFromCache = [
        ...Object.getOwnPropertyNames(componentJson.dependencies || {}),
        ...util.getMonoPackMemberNameList(componentJson)
      ];
      dependenciesFromCache.forEach((component) => {
        const componentData = componentsCache[component];
        if (componentData && componentData.builtPath) {
          pathToComponentJson = path.join(componentData.builtPath, CONSTANTS.JET_COMPONENT_JSON);
          fs.writeJsonSync(pathToComponentJson, componentData.componentJson);
        }
      });
    } else {
      pathToComponentJson = path.join(builtPath, CONSTANTS.JET_COMPONENT_JSON);
      fs.writeJsonSync(pathToComponentJson, componentJson);
    }
  });
  return Promise.resolve(context);
}

module.exports = restoreLocalComponentJson;
