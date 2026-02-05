/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const ORACLET_ROOT_PATH = 'node_modules/@oracle';
const ORACLEJET_PATH = `${ORACLET_ROOT_PATH}/oraclejet`;
const PACKAGE_VERSION = {
  TYPESCRIPT: '5.8.3',
  JSDOC: '3.5.5',
  WEBPACK: '5.76.0',
  YARGS_PARSER: '13.1.2',
  TS_LOADER: '8.4.0',
  TYPES_NODE: '18.16.3',
  SASS: '1.80.5'
};
const ORACLEJET_ICU_L10N_NAME = '@oracle/oraclejet-icu-l10n';

module.exports = {
  WEB_DIRECTORY: 'web',
  APP_SRC_DIRECTORY: 'src',
  APP_SRC_WEB_DIRECTORY: 'src-web',
  PACKAGE_OUTPUT_DIRECTORY: 'dist',
  APP_THEMES_DIRECTORY: 'themes',
  APP_STAGED_THEMES_DIRECTORY: 'staged-themes',
  DEFAULT_THEME: 'alta',
  DEFAULT_PCSS_THEME: 'redwood',
  REDWOOD_NOTAG_THEME: 'redwood-notag',
  DEFAULT_STABLE_THEME: 'stable',
  DEFAULT_BROWSER: 'chrome',
  DEFAULT_INSTALLER: 'npm',
  COMMON_THEME_DIRECTORY: 'common',
  COMPONENTS_DIRECTORY: 'components',
  JET_COMPOSITE_DIRECTORY: 'jet-composites',
  JET_COMPONENTS_DIRECTORY: 'jet_components',
  COMPONENT_TEMP_ARCHIVE: 'component.zip',
  PUBLISH_TEMP_DIRECTORY: 'temp-publish',
  NODE_MODULES_DIRECTORY: 'node_modules',
  JET_COMPONENT_JSON: 'component.json',
  SUPPORTED_PLATFORMS: ['android', 'ios', 'web', 'windows'],
  SUPPORTED_THEME_PLATFORMS: ['android', 'ios', 'web', 'windows', 'common'],
  SUPPORTED_BROWSERS: ['chrome', 'firefox', 'edge', 'ie', 'safari'],
  SUPPORTED_WEB_PLATFORM: 'web',

  APP_TYPE:
  {
    WEB: 'web'
  },

  DEBUG_FLAG: '--debug',
  RELEASE_FLAG: '--release',
  SUPPORTED_BUILD_DESTINATIONS: ['emulator', 'device'],
  SUPPORTED_SERVE_WEB_DESTINATIONS: ['server-only'],
  DEFAULT_BUILD_DESTINATION: 'emulator',
  RESERVED_Key_ALL_THEME: 'all',
  ORACLE_JET_CONFIG_JSON: 'oraclejetconfig.json',
  PATH_TO_ORACLEJET: `${ORACLEJET_PATH}/dist`,
  PATH_MAPPING_JSON: 'path_mapping.json',
  PATH_MAPPING_VERSION_TOKEN: '#{version}',
  PATH_TO_HOOKS_CONFIG: 'scripts/hooks/hooks.json',
  TSCONFIG: 'tsconfig.json',
  OJET_CONFIG: 'ojet.config.js',
  APIDOC_TEMPLATES: 'apidoc_templates',
  TOOLING_PATH: `${ORACLET_ROOT_PATH}/oraclejet-tooling`,
  ORACLEJET_TOOLING_NAME: '@oracle/oraclejet-tooling',
  ICU_L10N_PATH: `${ORACLET_ROOT_PATH}/oraclejet-icu-l10n`,
  ORACLEJET_ICU_L10N_NAME,
  L10N_BUNDLE_BUILDER: 'l10nBundleBuilder.js',
  ORACLEJET_PATH,
  OJET_CLI_PATH: `${ORACLET_ROOT_PATH}/ojet-cli`,
  ORACLEJET_NAME: '@oracle/oraclejet',
  PATH_TO_PWA_TEMPLATES: 'lib/templates/serviceWorkers',
  PATH_TO_TSCONFIG_TEMPLATE: 'lib/templates/typescript/tsconfig.json',
  PATH_TO_OJET_CONFIG_TEMPLATE: 'lib/templates/webpack/ojet.config.js',
  API_TASKS: {
    ADD: 'add',
    ADDSASS: 'addsass',
    CONFIGURE: 'configure',
    CREATE: 'create',
    LIST: 'list',
    ADDPCSS: 'addpcss',
    PUBLISH: 'publish',
    REMOVE: 'remove',
    SEARCH: 'search',
    ADDTYPESCRIPT: 'addtypescript',
    ADDJSDOC: 'addjsdoc',
    ADDPWA: 'addpwa',
    PACKAGE: 'package',
    ADDWEBPACK: 'addwebpack',
    ADDTESTING: 'addtesting',
    MIGRATE: 'migrate',
    ADDTRANSLATION: 'addtranslationicu',
    LABEL: 'label'
  },
  API_SCOPES: {
    EXCHANGE: 'exchange',
    COMPONENT: 'component',
    PACK: 'pack'
  },
  EXCHANGE_URL_PARAM: 'exchange-url',
  EXCHANGE_LOCAL_COMPONENTS_SUPPORT: 'localComponentsSupport',
  OJET_LOCAL_STORAGE_DIR: '.ojet',
  EXCHANGE_TOKEN_STORE_FILE: 'exchange-access.json',
  EXCHANGE_URL_FILE: 'exchange-url.json',
  EXCHANGE_GLOBAL_URL_KEY: 'global',
  EXCHANGE_HEADER_NEXT_TOKEN: 'x-compcatalog-auth-next-token',
  EXCHANGE_HEADER_NEXT_TOKEN_EXPIRATION: 'x-compcatalog-auth-next-token-expiration',
  EXCHANGE_AUTH_ACCESS_TOKEN: 'access_token',
  EXCHANGE_AUTH_TOKEN_TYPE: 'token_type',
  EXCHANGE_AUTH_EXPIRATION: 'expiration',
  EXCHANGE_AUTH_EXPIRATION_CLIENT: 'expiration_client',
  EXCHANGE_AUTH_EXPIRES_IN: 'expires_in',
  COMPONENTS_DT: 'components_dt',
  PATH_TO_CUSTOM_TSC: 'dist/custom-tsc',
  PATH_TO_CUSTOM_TSC_TEMPLATES: 'dist/custom-tsc/templates',
  PATH_TO_JSDOC: 'dist/jsdoc',
  JSDOC_CONFIG_JSON: 'confapidoc.json',
  JSDOC_LIBRARIES: `jsdoc@${PACKAGE_VERSION.JSDOC}`,
  TYPESCRIPT_LIBARIES: `typescript@${PACKAGE_VERSION.TYPESCRIPT} yargs-parser@~${PACKAGE_VERSION.YARGS_PARSER}`,
  TRANSLATION_ICU_LIBRARIES: ORACLEJET_ICU_L10N_NAME,
  JEST_TEST_FILE_AND_LIBS_GLOBS: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)', 'libs/**'],
  OMIT_COMPONENT_VERSION_FLAG: 'omit-component-version',
  WEBPACK_TOOLS_PATH: 'dist/webpack-tools',
  VDOM_ARCHITECTURE: 'vdom',
  DEFAULT_BUNDLE_NAME: 'bundle.js',
  PATH_MAPPING_PREFIX_TOKEN: '#',
  COMPONENT_JSON_DEPENDENCIES_TOKEN: '@dependencies@',
  MONO_PACK_CONTENTS_TOKEN: '@contents@',
  PATH_TO_OJET_CONFIG: './ojet.config.js',
  FONT_URL: 'https://static.oracle.com/cdn/fnd/gallery/2404.0.0/images/iconfont/ojuxIconFont.min.css',
  WEBPACK_LIBRARIES: `webpack@${PACKAGE_VERSION.WEBPACK} @types/node@${PACKAGE_VERSION.TYPES_NODE} webpack-dev-server style-loader css-loader sass-loader sass ts-loader@${PACKAGE_VERSION.TS_LOADER} raw-loader noop-loader html-webpack-plugin html-replace-webpack-plugin copy-webpack-plugin @prefresh/webpack @prefresh/babel-plugin webpack-merge compression-webpack-plugin mini-css-extract-plugin clean-webpack-plugin css-fix-url-loader zlib`,
  ANSI_CSI_START: '\u001b[',
  ANSI_CS_FGCOLOR_LEN: 5,
  BUILD_ICU_TRANSLATION_PLUGIN: 'buildICUTranslationBundlePlugin',
  RESOURCES: 'resources',
  NLS: 'nls',
  TRANSLATION_TYPE: {
    ICU: 'icu'
  },

  TRANSLATION_OPTIONS: {
    SUPPORTED_LOCALES_KEY: 'supportedLocales',
  },

  COMPONENT_TYPE: {
    REFERENCE: 'reference',
    RESOURCE: 'resource',
    VBCS_PATTERN: 'vbcs-pattern'
  },

  PACK_TYPE: {
    MONO_PACK: 'mono-pack',
  },

  PACKAGE_VERSION
};
