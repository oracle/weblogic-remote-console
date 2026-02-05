/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const path = require('path');
const util = require('../util');
const optimizeComponent = require('./optimizeComponent');
const CONSTANTS = require('../constants');

class ComponentMinifier {
/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 */
  constructor({ context, componentJson }) {
    this.context = context;
    this.componentJson = componentJson;
  }
  generateMinificationFunction() {
    const config = this.generateOptimizationConfig();
    return () => (config.reduce(
      (prev, next) => prev.then(() => optimizeComponent(next)),
      Promise.resolve(this.context)
    )
    );
  }
  getExtraEmpties() {
    const extraEmpties = new Set();
    const { componentJson } = this;
    ComponentMinifier.addComponentDependenciesToExtraEmpties({ extraEmpties, componentJson });
    return Array.from(extraEmpties);
  }
  static addComponentDependenciesToExtraEmpties({
    extraEmpties,
    componentJson,
    componentToBundleMap
  }) {
    const DEPENDENCIES = 'dependencies';
    if (util.hasProperty(componentJson, DEPENDENCIES)) {
      const componentsCache = util.getComponentsCache();
      Object.keys(componentJson[DEPENDENCIES])
        .forEach((dependency) => {
          const dependencyComponentCache = componentsCache[dependency];
          if (dependencyComponentCache) {
            if (dependencyComponentCache.componentJson.type === 'pack' ||
                  dependencyComponentCache.componentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
              util.log.error(`Cannot have a dependency on a pack (${dependency}).`);
            }
            if (
              !componentToBundleMap ||
              !ComponentMinifier.componentsAreInSameJetPackBundle({
                componentToBundleMap,
                componentJson1: dependencyComponentCache.componentJson,
                componentJson2: componentJson
              })
            ) {
              // here, we are determing what not to bundle into the input file via
              // an exclusion list. do not bundle a dependency (i.e add it to the exclusion list)
              // if we are not creating a bundle or if we are creating a bundle and the
              // dependency is not explicitly listed as a member of the bundle. For example,
              // if a bunde consists of comp-a, comp-b & comp-c and comp-a depends on comp-c,
              // comp-c will be in the list of comp-a's dependencies. since both comp-a and comp-c
              // are listed as bundle members, comp-c should not be excluded
              extraEmpties.add(dependencyComponentCache.importName);
              extraEmpties.add(`${CONSTANTS.PATH_MAPPING_PREFIX_TOKEN}${dependencyComponentCache.importName}`);
            }
          } else {
            // eslint-disable-next-line prefer-template
            const output = `${dependency} is an invalid dependency in component ${componentJson.name}. Please make sure that it is available in your application.\ndependencies: ` + JSON.stringify(componentJson.dependencies);
            util.log.warning(output);
          }
        });
    }
  }
  static componentsAreInSameJetPackBundle({
    componentToBundleMap,
    componentJson1,
    componentJson2
  }) {
    const component1FullName = `${componentJson1.pack}-${componentJson1.name}`;
    const component2FullName = `${componentJson2.pack}-${componentJson2.name}`;
    return (componentToBundleMap[component1FullName] !== undefined) &&
      (componentToBundleMap[component1FullName] === componentToBundleMap[component2FullName]);
  }
  static getFullComponentNameFromBundlePath(bundlePath) {
    // Bundle paths are of the form <pack>/<component>/file. Use that
    // to construct the full component name for look up in the cache
    const [pack, component] = path.normalize(bundlePath).split(path.sep);
    return `${pack}-${component}`;
  }
}

class SingletonComponentMinifier extends ComponentMinifier {
  /**
   *
   * @param {object} options
   * @param {object} options.context
   * @param {object} options.componentJson
   */
  constructor({ context, componentJson }) {
    super({ context, componentJson });

    this.baseUrl = util.getComponentPath({ context,
      component: componentJson.name,
      built: true });
    this.destPath = util.getComponentPath({ context,
      component: componentJson.name,
      built: true,
      release: true });
  }
  generateRjsOptions() {
    const { baseUrl, componentJson, destPath } = this;
    return {
      baseUrl,
      name: `${componentJson.name}/loader`,
      out: path.join(destPath, 'loader.js')
    };
  }
}

class PackComponentMinifier extends ComponentMinifier {
  /**
   *
   * @param {object} options
   * @param {object} options.context
   * @param {object} options.componentJson
   * @param {object} options.packComponentJson
   */
  constructor({ context, componentJson, packComponentJson }) {
    super({ context, componentJson });
    this.baseUrl = util.getComponentPath({ context,
      component: packComponentJson.name,
      built: true });
    this.destPath = util.getComponentPath({ context,
      pack: componentJson.pack || packComponentJson.name,
      component: componentJson.name,
      built: true,
      release: true });
  }
  generateRjsOptions() {
    const { baseUrl, componentJson, destPath } = this;
    let outputPath;
    let namePath;
    // With loaderless components, the minimized component js and map files should be under the
    // root of the min folder: destpath is of the format web/../<packName>/../min/<comonentName>.
    // However, users can decide to select the output file to which the minified version will be
    // emitted to. This could be done by adding the path segments in the ojmetadata main property,
    // ending up in the component.json' main attribute. Possible main attribute values are
    // main: <packName>/<componentName>;
    //       <packName>/<componentName>/loader;
    //       <packName>/<componentName>/<anyFile>;
    if (componentJson.main) {
      if (componentJson.main === `${componentJson.pack}/${componentJson.name}`) {
        outputPath = `${destPath}.js`;
        namePath = `${componentJson.pack}/${componentJson.name}`;
      } else if (componentJson.main === `${componentJson.pack}/${componentJson.name}/loader`) {
        outputPath = path.join(destPath, 'loader.js');
        namePath = `${componentJson.pack}/${componentJson.name}/loader`;
      } else {
        // code not hit in tests

        const pathSegments = componentJson.main.split('/');
        outputPath = path.join(destPath, `${pathSegments[2]}.js`);
        namePath = `${componentJson.pack}/${componentJson.name}/${pathSegments[2]}`;
      }
    } else {
      outputPath = path.join(destPath, 'loader.js');
      namePath = `${componentJson.pack}/${componentJson.name}/loader`;
    }
    return {
      baseUrl,
      name: namePath,
      out: outputPath
    };
  }
}

class SingletonCompositeComponentMinifier extends SingletonComponentMinifier {
/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 */
  constructor({ context, componentJson }) {
    super({ context, componentJson });
  }
  generateOptimizationConfig() {
    const config = [];
    const { context, componentJson } = this;
    config.push({
      context,
      rjsOptions: this.generateRjsOptions(),
      root: componentJson.name,
      extraEmpties: this.getExtraEmpties()
    });
    return config;
  }
}

class PackCompositeComponentMinifier extends PackComponentMinifier {
/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 * @param {object} options.packComponentJson
 */
  constructor({ context, componentJson, packComponentJson }) {
    super({ context, componentJson, packComponentJson });
  }
  generateOptimizationConfig() {
    const config = [];
    const { context, componentJson } = this;
    config.push({
      context,
      rjsOptions: this.generateRjsOptions(),
      root: componentJson.pack,
      extraEmpties: this.getExtraEmpties()
    });
    return config;
  }
}

class ResourceComponentMinifier extends PackComponentMinifier {
/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 * @param {object} options.packComponentJson
 */
  constructor({ context, componentJson, packComponentJson }) {
    super({ context, componentJson, packComponentJson });
  }
  generateOptimizationConfig() {
    const config = [];
    const { context, componentJson } = this;
    if (util.hasProperty(componentJson, 'publicModules')) {
      const { pack: packName, publicModules } = componentJson;
      publicModules.forEach((publicModule) => {
        config.push({
          context,
          rjsOptions: this.generateRjsOptions({ publicModule }),
          root: packName,
          extraExcludes: this.getExtraExcludes({ publicModule }),
          extraEmpties: this.getExtraEmpties()
        });
      });
    }
    return config;
  }

  /**
    *
    * @param {object} options
    * @param {string} options.publicModule
    */
  generateRjsOptions({ publicModule }) {
    const { baseUrl, componentJson, destPath } = this;
    return {
      baseUrl,
      name: `${componentJson.pack}/${componentJson.name}/${publicModule}`,
      out: path.join(destPath, `${publicModule}.js`)
    };
  }
  /**
   *
   * @param {object} options
   * @param {string} options.publicModule
   */
  getExtraExcludes({ publicModule }) {
    const { componentJson } = this;
    const { publicModules, pack: packName, name: componentName } = componentJson;
    const extraExcludes = new Set();
    publicModules.forEach((otherPublicModule) => {
      if (otherPublicModule !== publicModule) {
        extraExcludes.add(`${packName}/${componentName}/${otherPublicModule}`);
      }
    });
    return Array.from(extraExcludes);
  }
}


//
// Example of bundles definition in component.json
//
//  "name": "demo-bundles",
//  "type": "pack",
//  "dependencies": {
//    "demo-bundles-comp-1": "1.0.0",
//    "demo-bundles-comp-2": "1.0.0",
//    "demo-bundles-comp-3": "1.0.0",
//    "demo-bundles-comp-4": "1.0.0"
//  },
// "bundles":{
//    "demo-bundles/bundle-a":[
//        "demo-bundles/comp-1/loader",
//        "demo-bundles/comp-2/loader"
//    ],
//    "demo-bundles/bundle-b":[
//      "demo-bundles/comp-3/loader",
//      "demo-bundles/comp-4/loader"
//    ]
//  }
//
// Note: tempBundleFile is added to the config in order
// to delete this file (once the rjs optimizer has completed).
//
class PackBundlesMinifier extends ComponentMinifier {
/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.packComponentJson
 */
  constructor({ context, packComponentJson }) {
    super({ context });
    this.packComponentJson = packComponentJson;
    this.baseUrl = util.getComponentPath({ context,
      component: packComponentJson.name,
      built: true });
    this.destPath = util.getComponentPath({ context,
      component: packComponentJson.name,
      built: true,
      release: true });
  }
  generateOptimizationConfig() {
    const config = [];
    const { context, packComponentJson, baseUrl, destPath } = this;
    const { name: packName } = packComponentJson;
    const componentToBundleMap = this.createComponentToBundleMap();
    Object.keys(packComponentJson.bundles).forEach((bundleKey) => {
      const bundleName = bundleKey.substring(packName.length + 1);
      // Create an empty file, which later on gets populated with
      // the minified bundle contents. See JET-63868.
      const bundleContents = '';
      const tempBundleFile = path.join(baseUrl, `${bundleName}.js`);
      util.writeFileSync(tempBundleFile, bundleContents);
      config.push({
        context,
        rjsOptions: {
          baseUrl,
          name: bundleName,
          out: path.join(destPath, `${bundleName}.js`),
          include: packComponentJson.bundles[bundleKey]
        },
        tempBundleFile,
        root: packName,
        extraEmpties: this.getExtraEmpties(bundleKey, componentToBundleMap)
      });
    });
    return config;
  }
  getExtraEmpties(bundleKey, componentToBundleMap) {
    const extraEmpties = new Set();
    const componentsCache = util.getComponentsCache();
    const { packComponentJson } = this;
    // Loop through the list of bundle contents
    packComponentJson.bundles[bundleKey]
      .forEach((bundlePath) => {
        const fullComponentName = ComponentMinifier.getFullComponentNameFromBundlePath(bundlePath);
        if (componentsCache[fullComponentName]) {
          // Check if the component being bundled has dependencies. If it does,
          // add them to the empty / exclusion list for the bundle. This makes
          // sure that r.js recognizes the dependencies when creating the bundle
          // and does not add their contents to the it.
          const { componentJson } = componentsCache[fullComponentName];
          ComponentMinifier.addComponentDependenciesToExtraEmpties({
            extraEmpties,
            componentJson,
            componentToBundleMap
          });
        }
      });
    return Array.from(extraEmpties);
  }
  createComponentToBundleMap() {
    // if we have { bundles: { bundleOne: [comp1, comp2], bundleTwo: [comp3], ... } }
    // componentToBundleMap will be { comp1: bundleOne, comp2: bundleOne, comp3: bundleTwo, ...}
    const { packComponentJson } = this;
    const componentToBundleMap = {};
    Object
      .keys(packComponentJson.bundles)
      .forEach((bundleName) => {
        packComponentJson.bundles[bundleName]
          .forEach((bundlePath) => {
            const fullComponentName = PackBundlesMinifier.getFullComponentNameFromBundlePath(bundlePath); // eslint-disable-line max-len
            componentToBundleMap[fullComponentName] = bundleName;
          });
      });
    return componentToBundleMap;
  }
}

/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 * @param {string} options.componentName
 * @param {string} options.destBase
 * @returns {Promise<object>}
 */
function minifyComponent({ context, componentJson, componentName, destBase }) {
  return new Promise((resolve, reject) => {
    try {
      if (!util.hasProperty(componentJson, 'version')) {
        util.log.error(`Missing property "version" in '${componentName}' component.json.`);
      }
      const minificationFunctions = [];
      const componentHasType = util.hasProperty(componentJson, 'type');
      const componentType = componentJson.type;
      if (!componentHasType || (componentHasType && componentType === 'composite')) {
        minificationFunctions.push(new SingletonCompositeComponentMinifier({
          context,
          componentJson
        }).generateMinificationFunction());
      } else if (componentHasType && (componentType === 'pack' || componentType === CONSTANTS.PACK_TYPE.MONO_PACK)) {
        const packComponentJson = componentJson;
        const packVersion = util.useUnversionedStructure(context) ? '' : packComponentJson.version;
        const packName = util.hasProperty(packComponentJson, 'name') && packComponentJson.name;
        if (!packName) {
          util.log.error('Missing "name" property for pack.');
        }
        if (util.hasProperty(packComponentJson, 'dependencies') ||
          util.hasProperty(packComponentJson, 'contents')) {
          let packMemberNameList = [];
          // In mono-pack, we do not add entries in the dependencies for
          // components in the same pack. However, since the entries are
          // used below to retrieve the componentCache for the respective
          // component, then we need to generate the pack member list:
          if (packComponentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
            packMemberNameList = util.getMonoPackMemberNameList(packComponentJson);
          } else {
            packMemberNameList = Object.keys(packComponentJson.dependencies || {});
          }
          packMemberNameList.forEach((packMember) => {
            if (packMember.startsWith(packName)) {
              const packComponentName = packMember.substring(packName.length + 1);
              const packMemberComponentJson = util.readJsonAndReturnObject(path.join(
                destBase,
                packName,
                packVersion,
                packComponentName,
                CONSTANTS.JET_COMPONENT_JSON
              ));
              switch (packMemberComponentJson.type) {
                case undefined:
                case 'composite':
                  minificationFunctions.push(new PackCompositeComponentMinifier({
                    context,
                    componentJson: packMemberComponentJson,
                    packComponentJson
                  }).generateMinificationFunction());
                  break;
                case CONSTANTS.COMPONENT_TYPE.RESOURCE:
                  minificationFunctions.push(new ResourceComponentMinifier({
                    context,
                    componentJson: packMemberComponentJson,
                    packComponentJson
                  }).generateMinificationFunction());
                  break;
                case 'pack':
                  util.log.error(`Cannot have a pack (${packMember}) listed as a dependency of a pack (${packName}).`);
                  break;
                case CONSTANTS.PACK_TYPE.MONO_PACK:
                  util.log.error(`Cannot have a mono-pack (${packMember}) listed as a dependency of a mono-pack (${packName}).`);
                  break;
                default:
                  break;
              }
            } else {
              util.log.error(`Missing pack prefix for dependency ${packMember} in ${packName}.`);
            }
          });
        }
        if (util.hasProperty(componentJson, 'bundles')) {
          minificationFunctions.push(new PackBundlesMinifier({
            context,
            packComponentJson
          }).generateMinificationFunction());
        }
      }
      util.runPromisesInSeries(minificationFunctions, context)
        .then(resolve)
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = minifyComponent;
