// Karma configuration
// Generated on Wed Oct 09 2019 08:43:05 GMT-0600 (MDT)

module.exports = function (config) {

  const process = require('process');
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  var sourcePreprocessors = 'coverage';
  function isDebug(argument) {
    return argument === '--debug';
  }
  if (process.argv.some(isDebug)) {
    sourcePreprocessors = [];
  }

  config.set({

    // base path that will be used to resolve all patterns (eg. files,
    // exclude). We're in 'frontend/unit-tests', so '../'
    // means the 'frontend' directory.
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // NOTE: the order of these libraries is important. "requirejs" must be
    // loaded first so that other UMD modules will know it's an AMD environment
    frameworks: [
      'requirejs',
      'mocha',
      'chai',
      'sinon',
      'fixture',
      'karma-typescript'
    ],

    // list of files / patterns to load in the browser.
    // baseUrl is the 'frontend' directory, so the paths
    // used in the patterns are relative to that.
    files: [
      'unit-tests/karma-fixture.conf.js',

      // RequireJS bootstrap
      'unit-tests/test-main.js',

      // .yaml files
      {
        pattern: 'web/js/jet-composites/wrc-frontend/1.0.0/config/**',
        included: false,
        served: true
      },

      // Test files
      { pattern: 'unit-tests/specs/**', included: false },
//      { pattern: 'unit-tests/specs/core/**', included: false },

      // .json files for fixtures
      { pattern: 'unit-tests/fixtures/**'},

      // project files
      { pattern: 'web/js/**', included: false },

      // 3rd party testing libs
      {
        pattern: 'node_modules/sinon/**',
        included: false,
        watched: false
      }
    ],

    // list of files / patterns to exclude
    exclude: [
      'web/js/appController.js'
    ],

    proxies: {
      '/config/': '/base/web/js/jet-composites/wrc-frontend/1.0.0/config/',
      '/base/core/': '/base/web/js/jet-composites/wrc-frontend/1.0.0/core/',
      '/base/apis/': '/base/web/js/jet-composites/wrc-frontend/1.0.0/apis/',
      '/base/microservices/': '/base/web/js/jet-composites/wrc-frontend/1.0.0/microservices/',
      '/base/integration/': '/base/web/js/jet-composites/wrc-frontend/1.0.0/integration/',
      '/base/core/baseUrl': '/base/web/js/baseUrl'
    },
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

    // for serving JSON fixtures, see
    // https://www.npmjs.com/package/karma-fixture
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },

    preprocessors: {
      'unit-tests/fixtures/**/*.json': ['json_fixtures'],
      'web/js/jet-composites/wrc-frontend/1.0.0/core/**/*.js': sourcePreprocessors,
      'web/js/jet-composites/wrc-frontend/1.0.0/apis/**/*.js': sourcePreprocessors,
      'web/js/jet-composites/wrc-frontend/1.0.0/microservices/**/*.js': sourcePreprocessors,
      'web/js/jet-composites/wrc-frontend/1.0.0/integration/**/*.js': sourcePreprocessors
    },

    //karmaTypescriptConfig: {
    //  tsconfig: 'test/tsconfig.json'
    //},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      includeAllSources: true,
      type: 'html',
      dir: 'coverage/',
      file: 'index.html'
    },

    client: {
      captureConsole: true,
      mocha: {
        timeout: 30000
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
