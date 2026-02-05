/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

/**
 * # Dependencies
 */


/* 3rd party */
const fs = require('fs-extra');

/* Node.js native */
// Temporarily replace parser with fixed one to handle ':' attributes
const DOMParser = require('./parser/dom-parser').DOMParser;
const path = require('path');

/* Oracle */
const injectorUtil = require('./injectorUtil');
const util = require('./util');
const endOfLine = require('os').EOL;
const config = require('./config');
const constants = require('./constants');

/**
 * # Injector API
 *
 * @public
 */

/**
 * ## _scriptSrcExists
 *
 * @private
 * @param {object} documentDom
 * @param {string} scriptSrc
 * @returns {boolean}
 */

function _scriptSrcExists(documentDom, scriptSrc) {
  const scripts = documentDom.getElementsByTagName('script');
  return Array.from(scripts).some(script => script.getAttribute('src') === scriptSrc);
}

/**
 * ## _createScriptElement
 *
 * @private
 * @param {object} documentDom
 * @param {string} scriptSrc
 * @returns {object || null} scriptElement
 */

function _createScriptElement(documentDom, scriptSrc) {
  if (_scriptSrcExists(documentDom, scriptSrc)) {
    return null;
  }

  const scriptElement = documentDom.createElement('script');
  scriptElement.setAttribute('type', 'text/javascript');
  scriptElement.setAttribute('src', scriptSrc);
  return scriptElement;
}

function _getStyleLinkBase(css, theme, buildType) {
  const masterJson = _isUseCdn(theme.name);
  const linkExt = util.getThemeCssExtention(buildType, masterJson !== null);

  if (masterJson !== null) {
    // CDN
    // Add -platform if non web and non redwood
    const platform = (theme.platform === constants.SUPPORTED_WEB_PLATFORM || theme.name === 'redwood') ? '' : `-${theme.platform}`;
    const cdnObj = {
      created: `${masterJson.cdns.jet.css}/${theme.name}${platform}/oj-${theme.name}${linkExt}`
    };
    if (theme.name === 'redwood' || theme.name === 'stable') {
      cdnObj.preact = `${masterJson.cdns.jet.csspreact}/Theme-${theme.name}/theme.css`;
    }
    return cdnObj;
  }

  const platform = (theme.name === 'redwood' || theme.name === 'stable') ? constants.SUPPORTED_WEB_PLATFORM : theme.platform;
  if (theme.version) {
    if (theme.cssGeneratedType === 'add-on') {
      if (theme.basetheme === constants.DEFAULT_STABLE_THEME) {
        return {
          default: `${css}/${constants.DEFAULT_STABLE_THEME}/${util.getJETVersion()}/${platform}/${constants.DEFAULT_STABLE_THEME}${linkExt}`,
          created: `${css}/${theme.name}/${theme.version}/${platform}/${theme.name}${linkExt}`,
          preact: `${css}/theme-stable/${util.getJETVersion()}/web/theme.css`
        };
      }
      return {
        default: `${css}/${constants.DEFAULT_PCSS_THEME}/${util.getJETVersion()}/${platform}/${constants.DEFAULT_PCSS_THEME}${linkExt}`,
        created: `${css}/${theme.name}/${theme.version}/${platform}/${theme.name}${linkExt}`,
        preact: `${css}/theme-redwood/${util.getJETVersion()}/web/theme.css`
      };
    }
    if (theme.cssGeneratedType === 'combined' || theme.cssGeneratedType === '') {
      const linkObj = {
        created: `${css}/${theme.name}/${theme.version}/${platform}/${theme.name}${linkExt}`
      };
      if (theme.name === 'redwood' || theme.name === 'stable') {
        linkObj.preact = `${css}/theme-${theme.name}/${util.getJETVersion()}/web/theme.css`;
      } else if (theme.basetheme === 'redwood' || theme.basetheme === 'stable') {
        linkObj.preact = `${css}/theme-${theme.basetheme}/${util.getJETVersion()}/web/theme.css`;
      } else {
        // use the default theme:
        linkObj.preact = `${css}/theme-${config('defaultTheme')}/${util.getJETVersion()}/web/theme.css`;
      }
      return linkObj;
    }
  }
  const linkObj = {
    created: `${css}/${theme.name}/${platform}/${theme.name}${linkExt}`
  };
  if (theme.name === 'redwood' || theme.name === 'stable') {
    linkObj.preact = `${css}/theme-${theme.name}/${util.getJETVersion()}/web/theme.css`;
  } else if (theme.basetheme === 'redwood' || theme.basetheme === 'stable') {
    linkObj.preact = `${css}/theme-${theme.basetheme}/${util.getJETVersion()}/web/theme.css`;
  } else {
    // use the default theme:
    linkObj.preact = `${css}/theme-${config('defaultTheme')}/${util.getJETVersion()}/web/theme.css`;
  }
  return linkObj;
}

function _isUseCdn(name) {
  const masterJson = util.readPathMappingJson();
  if (masterJson.use === 'local' || !masterJson.cdns || !masterJson.cdns.jet || !masterJson.cdns.jet.config) {
    return null;
  }
  // Check for built in themes--cdn not supported otherwise
  if (name === undefined || name === 'redwood' || name === 'alta') {
    return masterJson;
  }
  return null;
}

function _getFontStyleLinkString() {
  return `<link rel="stylesheet" id="uxiconFont" href="${config.data.fontUrl}" />`;
}

function _getThemeStyleLink(theme, buildType) {
  let themeStyleLink;
  let linkToCreatedTheme;
  const css = config('paths').src.styles;
  const linkBase = _getStyleLinkBase(css, theme, buildType);
  const linkToPreact = `<link rel="stylesheet" href="${linkBase.preact}" id="themestyle" />`;
  if (linkBase.default) {
    const linkToDefaultTheme = `<link rel="stylesheet" href="${linkBase.default}" id="basestyles" />`;
    linkToCreatedTheme = `<link rel="stylesheet" href="${linkBase.created}" id="overridestyles" />`;
    themeStyleLink = `${linkToDefaultTheme}\n${linkToCreatedTheme}\n${linkToPreact}`;
    return themeStyleLink;
  }
  linkToCreatedTheme = `<link rel="stylesheet" href="${linkBase.created}" id="basestyles" />`;
  themeStyleLink = `${linkToCreatedTheme}\n${linkToPreact}`;
  return themeStyleLink;
}

function _getIndexHtml(indexHtml) {
  return util.readFileSync(indexHtml);
}

function _getCspMetaTag(documentDom) {
  const metas = documentDom.getElementsByTagName('meta');
  return Array.from(metas).find((meta) => {
    const contentAttr = meta.getAttribute('http-equiv');
    return (contentAttr === 'Content-Security-Policy');
  });
}

function _getRequireJavaScriptElement(documentDom) {
  const scripts = documentDom.getElementsByTagName('script');
  return Array.from(scripts).find((script) => {
    const typeAttr = script.getAttribute('type');
    const srcAttr = script.getAttribute('src');
    return ((!typeAttr || (typeAttr === 'text/javascript')) && /require/.test(srcAttr));
  });
}

function _createRequireScriptElementString(masterJson) {
  const configPaths = util.getConfiguredPaths();
  let scriptSrc;
  if (masterJson) {
    scriptSrc = `${masterJson.cdns['3rdparty']}/require/require.js`;
  } else {
    scriptSrc = `${configPaths.src.javascript}/libs/require/require.js`;
  }
  return injectorUtil.createScriptElementString(scriptSrc, null);
}

function _createCDNBundleScriptElementString(masterJson) {
  if (masterJson) {
    if (masterJson.cdns.jet.config && masterJson.cdns.jet.config.indexOf('bundles-config-esm') > -1) {
      return injectorUtil.createScriptElementString(`${masterJson.cdns.jet.prefix}/${masterJson.cdns.jet.config}`, 'module');
    }
    return injectorUtil.createScriptElementString(`${masterJson.cdns.jet.prefix}/${masterJson.cdns.jet.config}`, null);
  }
  return null;
}

function _createBundleScriptElementString() {
  const configPaths = util.getConfiguredPaths();
  const bundleName = util.getBundleName().full;
  return injectorUtil.createScriptElementString(`${configPaths.src.javascript}/${bundleName}`, null);
}

function _createMainSscriptElementString() {
  const configPaths = util.getConfiguredPaths();
  return injectorUtil.createScriptElementString(`${configPaths.src.javascript}/main.js`, null);
}

function _replaceTokenWithScripts({
  content,
  contentDest,
  pattern,
  startTag,
  endTag,
  masterJson,
  context
}) {
  let scriptStrings = '';
  const lineEnding = injectorUtil.getLineEnding(content);
  const bundleJsScriptElementString = _createBundleScriptElementString();
  if (context.opts.bundler === 'webpack') {
    // bundler is webpack, add bundle.js script
    scriptStrings += bundleJsScriptElementString;
  } else {
    // bundler is r.js, add require.js and main.js / bundle.js scripts
    const requireJsScriptElementString = _createRequireScriptElementString(masterJson);
    scriptStrings += `${requireJsScriptElementString}${lineEnding}`;
    // add bundle-config.js script if using CDN
    const cdnBundleScriptElemeentString = _createCDNBundleScriptElementString(masterJson);
    if (cdnBundleScriptElemeentString) {
      scriptStrings += `${cdnBundleScriptElemeentString}${lineEnding}`;
    }
    // add main.js script if debug build, bundle.js script if release
    const mainScriptElementString = _createMainSscriptElementString();
    scriptStrings += context.buildType === 'release' ? bundleJsScriptElementString : mainScriptElementString;
  }
  const injectResult = injectorUtil.replaceInjectorTokens({
    content,
    pattern,
    replace: scriptStrings,
    eol: lineEnding,
    startTag,
    endTag
  });
  util.writeFileSync(contentDest, injectResult);
}

function _injectCdnBundleScript({
  content,
  contentDest,
  masterJson
}) {
  const documentDom = new DOMParser().parseFromString(content, 'text/html');
  const scriptSrc = `${masterJson.cdns.jet.prefix}/${masterJson.cdns.jet.config}`;
  const cdnBundleElement = _createScriptElement(documentDom, scriptSrc);
  const requirejsElement = _getRequireJavaScriptElement(documentDom);
  if (cdnBundleElement && requirejsElement) {
    // append to an requirejs script tag...
    documentDom.insertBefore(cdnBundleElement, requirejsElement.nextSibling);
    const paddingElem = documentDom.createTextNode(`${endOfLine}    `);
    documentDom.insertBefore(paddingElem, requirejsElement.nextSibling);
    util.writeFileSync(contentDest, documentDom.toString());
  }
}

module.exports = {
  injectThemePath: (context) => {
    const opts = context.opts;
    const buildType = context.buildType;
    const stagingPath = opts.stagingPath;
    // read from staging index.html, update value, and write back to staging index.html
    const indexHtmlDestPath = util.destPath(path.resolve(stagingPath, 'index.html'));
    const indexHtmlContent = _getIndexHtml(indexHtmlDestPath);

    const startTag = opts.injectTheme.startTag;
    const endTag = opts.injectTheme.endTag;

    // Redwood folder has redwood-notag that can also be loaded when building an app.
    // This theme file exists in the redwood folder; therefore, it might not be necessary
    // to create an redwood-notag folder to harbor the files. Thus, if the redwood-notag
    // is the selected theme, it can just run by referencing redwood as its parent folder.
    // Doing so, require us to change the theme name below to redwood since the variable
    // is used to create the path injected into the link string.
    if (opts.theme.name === constants.REDWOOD_NOTAG_THEME) {
      opts.theme.name = constants.DEFAULT_PCSS_THEME;
    }
    const theme = opts.theme;
    let themeStyleLinkString = _getThemeStyleLink(theme, buildType);
    // We need to change the file name to redwood-notag.css or redwwod-notag.min.css, since
    // that is what was initially chosen:
    if (config('defaultTheme') === constants.REDWOOD_NOTAG_THEME) {
      if (themeStyleLinkString.includes(`${constants.DEFAULT_PCSS_THEME}.min.css`)) {
        themeStyleLinkString = themeStyleLinkString.replace(`${constants.DEFAULT_PCSS_THEME}.min.css`, `${constants.REDWOOD_NOTAG_THEME}.min.css`);
      } else {
        themeStyleLinkString = themeStyleLinkString.replace(`${constants.DEFAULT_PCSS_THEME}.css`, `${constants.REDWOOD_NOTAG_THEME}.css`);
      }
    }

    const injectResult = injectorUtil.replaceInjectorTokens({
      content: indexHtmlContent,
      pattern: injectorUtil.getInjectorTagsRegExp(startTag, endTag),
      replace: themeStyleLinkString,
      eol: injectorUtil.getLineEnding(indexHtmlContent),
      startTag,
      endTag
    });

    fs.outputFileSync(indexHtmlDestPath, injectResult);
    return Promise.resolve(context);
  },

  injectFontPath: (context) => {
    const opts = context.opts;
    const stagingPath = opts.stagingPath;
    // read from staging index.html, update value, and write back to staging index.html
    const indexHtmlDestPath = util.destPath(path.resolve(stagingPath, 'index.html'));
    const indexHtmlContent = _getIndexHtml(indexHtmlDestPath);

    const startTag = opts.injectFont.startTag;
    const endTag = opts.injectFont.endTag;

    // Redwood folder has redwood-notag that can also be loaded when building an app.
    // This theme file exists in the redwood folder; therefore, it might not be necessary
    // to create an redwood-notag folder to harbor the files. Thus, if the redwood-notag
    // is the selected theme, it can just run by referencing redwood as its parent folder.
    // Doing so, require us to change the theme name below to redwood since the variable
    // is used to create the path injected into the link string.
    if (opts.theme.name === constants.REDWOOD_NOTAG_THEME) {
      opts.theme.name = constants.DEFAULT_PCSS_THEME;
    }
    const fontStyleLinkString = _getFontStyleLinkString();

    const injectResult = injectorUtil.replaceInjectorTokens({
      content: indexHtmlContent,
      pattern: injectorUtil.getInjectorTagsRegExp(startTag, endTag),
      replace: fontStyleLinkString,
      eol: injectorUtil.getLineEnding(indexHtmlContent),
      startTag,
      endTag
    });

    fs.outputFileSync(indexHtmlDestPath, injectResult);
    return Promise.resolve(context);
  },

  injectLocalhostCspRule: (context) => {
    const opts = context.opts;
    const stagingPath = opts.stagingPath;
    const indexHtmlDestPath = util.destPath(path.resolve(stagingPath, 'index.html'));
    const indexHtmlContent = _getIndexHtml(indexHtmlDestPath);
    const documentDom = new DOMParser().parseFromString(indexHtmlContent, 'text/html');

    const cspMetaTag = _getCspMetaTag(documentDom);

    if (cspMetaTag && cspMetaTag !== null) {
      let contentAttrValue = cspMetaTag.getAttribute('content');

      const pattern = new RegExp('script-src([^;]*)', 'gi');
      const result = pattern.exec(contentAttrValue);
      let scriptSrc;
      let newScriptSrc;
      const cspRule = 'localhost:* 127.0.0.1:*';

      if (result) {
        scriptSrc = result[0];
        newScriptSrc = `${scriptSrc} ${cspRule}`;
        contentAttrValue = contentAttrValue.replace(scriptSrc, newScriptSrc);
      } else {
        newScriptSrc = `; script-src ${cspRule}`;
        contentAttrValue += newScriptSrc;
      }
      cspMetaTag.setAttribute('content', contentAttrValue);
      util.writeFileSync(indexHtmlDestPath, documentDom.toString());
    }
    return Promise.resolve(context);
  },

  injectScripts: (context) => {
    const opts = context.opts;
    const stagingPath = opts.stagingPath;
    const indexHtmlDestPath = util.destPath(path.join(stagingPath, 'index.html'));
    const indexHtmlContent = _getIndexHtml(indexHtmlDestPath);
    const masterJson = _isUseCdn();
    const {
      startTag,
      endTag
    } = opts.injectScripts;
    const pattern = injectorUtil.getInjectorTagsRegExp(startTag, endTag);
    if (pattern.test(indexHtmlContent)) {
      // index.html has injector:scripts token
      _replaceTokenWithScripts({
        content: indexHtmlContent,
        contentDest: indexHtmlDestPath,
        pattern,
        startTag,
        endTag,
        masterJson,
        context
      });
    } else if (masterJson) {
      // index.html does not have injector:scripts token, inject cdn bundle
      // script right after requirejs script
      _injectCdnBundleScript({
        content: indexHtmlContent,
        contentDest: indexHtmlDestPath,
        masterJson
      });
    }
    return Promise.resolve(context);
  },

  getStyleLinkBase: (css, theme, buildType) => _getStyleLinkBase(css, theme, buildType)
};
