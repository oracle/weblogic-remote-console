/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const path = require('path');
const util = require('./util');

module.exports = {
  build: {

    stagingPath: paths => paths.staging.stagingPath,

    injectPaths: paths => ({
      startTag: '// injector:mainReleasePaths',
      endTag: '// endinjector',
      mainJs: `${paths.staging.stagingPath}/${paths.src.javascript}/main.js`,
      destMainJs: `${paths.staging.stagingPath}/${paths.src.javascript}/${util.getBundleName().prefix}-temp.js`
    }),

    injectPreactImport: paths => ({
      startTag: '// injector:preactDebugImport',
      endTag: '// endinjector',
      indexTs: `${paths.staging.stagingPath}/index.ts`
    }),

    //
    // The first block directive copies all .js from src dir, (excluding main.js
    // and also excluding the jet-composites/ directory).
    // We exclude the jet-composites/ dir because the component
    // version naming is not identical under the src/ and web/ path.
    //
    terser: paths => ({
      fileList: [
        {
          cwd: `${paths.staging.stagingPath}/${paths.src.javascript}`,
          src: ['**/*.js', `!${paths.components}/**/*.js`, '!libs/**/*.js'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}`
        },
        {
          cwd: `${paths.src.common}/${paths.src.javascript}`,
          src: ['**/*.js', '!main.js', `!${paths.components}/**/*.js`],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}`
        },
        {
          cwd: `${paths.staging.stagingPath}/${paths.src.javascript}`,
          src: [`${util.getBundleName().prefix}-temp.js`],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}`
        },
        {
          // jquery ui npm package does not provide minified scripts
          buildType: 'release',
          cwd: `${paths.staging.stagingPath}/${paths.src.javascript}/libs`,
          src: ['jquery/jqueryui-amd*min/**/*.js'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}/libs`
        }
      ],
      options: {
        compress: {
          warnings: false
        },
        mangle: {
          // Disable mangling requirejs config to avoid optimization errors
          reserved: ['require']
        },
        output: {
          max_line_len: 32000,
          ascii_only: false,
          beautify: false,
          quote_style: 0,
          comments: 'some'
        },
        ie8: false
      }
    }),

    svgMin: paths => ({
      fileList: [
        {
          cwd: `${paths.staging.themes}`,
          src: ['**/*.svg'],
          dest: `${paths.staging.themes}`
        }
      ],
      options: {
        plugins: [
          { name: 'removeXMLNS',
            active: false },
          { name: 'removeViewBox',
            active: false },
          { name: 'removeUselessStrokeAndFill',
            active: false },
          { name: 'convertStyleToAttrs',
            active: false },
          { name: 'removeEmptyAttrs',
            active: true },
          {
            name: 'removeAttrs',
            params: {
              attrs: ['xmlnsX']
            }
          }
        ]
      }
    }),

    svgSprite: {
      options: {
        shape: {
          spacing: { // Add padding
            padding: 2, // 0 would sometimes have nearby sprites bleeding in (see "layout")
            box: 'content' // I was hoping this would exclude the padding but doesn't, so have to include the padding in the background-position
          }
        }
      }
    },

    copySrcToStaging: paths => ({
      fileList: [
        {
          buildType: 'release',
          cwd: paths.src.common,
          src: [
            '**',
            (paths.src.javascript === paths.src.typescript) ? `${paths.src.javascript}/**/*.js` : `!${paths.src.javascript}/**/*.js`,
            `${paths.src.javascript}/main.js`,
            `${paths.src.javascript}/libs/**`,
            `!${paths.src.javascript}/libs/**/*debug*`,
            `!${paths.src.javascript}/libs/**/*debug*/**`,
            `!${paths.src.javascript}/main-release-paths.json`,
            `!${paths.src.themes}/**`,
            `!${paths.staging.themes}/**`,
            `!${paths.src.javascript}/${paths.components}/**`,
            `!${paths.src.typescript}/${paths.components}/**`
          ],
          dest: paths.staging.stagingPath
        },
        {
          buildType: 'dev',
          cwd: paths.src.common,
          src: [
            '**',
            `!${paths.src.javascript}/${paths.components}/**`,
            `!${paths.src.typescript}/${paths.components}/**`,
            `!${paths.src.javascript}/main-release-paths.json`,
            `!${paths.staging.themes}/**`,
          ],
          dest: paths.staging.stagingPath
        },
        {
          cwd: paths.src.platformSpecific,
          src: ['**'],
          dest: paths.staging.stagingPath
        },
        {
          buildType: 'dev',
          cwd: `${paths.src.common}/${paths.src.themes}`,
          src: ['**', '!**/*.scss'],
          dest: paths.staging.themes
        },
        {
          buildType: 'release',
          cwd: `${paths.src.common}/${paths.src.themes}`,
          src: ['**', '!**/*.scss', '!**.map'],
          dest: paths.staging.themes
        },
        {
          cwd: `${paths.exchangeComponents}`,
          src: ['**'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}/${paths.components}`
        },
      ],
    }),

    copyCustomLibsToStaging: {
      fileList: []
    },

    requireJs: paths => ({
      baseUrl: `${paths.staging.stagingPath}/${paths.src.javascript}`,
      name: `${util.getBundleName().prefix}-temp`,
      optimize: 'none',
      out: `${paths.staging.stagingPath}/${paths.src.javascript}/${util.getBundleName().full}`
    }),
    requireJsComponent: {
      optimize: 'none',
      separateCSS: false,
      buildCSS: false
    },

    sass: paths => ({
      fileList: [
        {
          cwd(context) {
            return `${paths.src.common}/${paths.src.themes}/${context.theme.name}/${context.theme.platform}`;
          },
          src: ['**/*.scss', '!**/_*.scss'],
          dest(context) {
            return `${paths.staging.themes}/${context.theme.name}/${context.theme.platform}`;
          }
        },
        {
          cwd: `${paths.src.common}/${paths.src.javascript}/${paths.components}`,
          src: ['**/*.scss', '!**/_*.scss'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}/${paths.components}`
        },
        {
          cwd: `${paths.src.common}/${paths.src.typescript}/${paths.components}`,
          src: ['**/*.scss', '!**/_*.scss'],
          dest: `${paths.staging.stagingPath}/${paths.src.typescript}/${paths.components}`
        },
        {
          cwd: `${paths.exchangeComponents}`,
          src: ['**/*.scss', '!**/_*.scss'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}/${paths.components}`
        }
      ],
      options: {
        precision: 10
      }
    }),

    pcss: paths => ({
      fileList: [
        {
          cwd(context) {
            return `${paths.src.common}/${paths.src.themes}/${context.theme.name}/${context.theme.platform}`;
          },
          src: ['**/*.scss', '!**/_*.scss', '!**/*.css'],
          dest(context) {
            return `${paths.staging.themes}/${context.theme.name}/${context.theme.platform}`;
          }
        },
        {
          cwd: `${paths.src.common}/${paths.src.javascript}/${paths.components}`,
          src: ['**/*.scss', '!**/_*.scss'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}/${paths.components}`
        },
        {
          cwd: `${paths.src.common}/${paths.src.typescript}/${paths.components}`,
          src: ['**/*.scss', '!**/_*.scss'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}/${paths.components}`
        },
        {
          cwd: `${paths.exchangeComponents}`,
          src: ['**/*.scss', '!**/_*.scss'],
          dest: `${paths.staging.stagingPath}/${paths.src.javascript}/${paths.components}`
        }
      ],
      options: {
        sourceMap: false,
        includePaths: [
          `node_modules/@oracle/oraclejet/dist/pcss/oj/${util.getJETVersionV(util.getJETVersion())}/`,
          `${paths.src.common}/${paths.src.javascript}/${paths.components}`,
          `${paths.src.common}/${paths.src.typescript}/${paths.components}`,
          `${paths.exchangeComponents}`
        ],
        precision: 5
      }
    }),

    altasass: paths => ({
      fileList: [
        {
          cwd(context) {
            return `${context.theme.directory}`;
          },
          src: ['**/*.scss', '!**/_*.scss'],
          dest(context) {
            return `${paths.staging.themes}/${context.theme.name}/${context.theme.platform}`;
          },
          rename: (dest, file) => path.join(dest, file.replace('oj-', ''))
        }
      ],
      options: {
        precision: 10
      }
    }),

    injectTheme: {
      startTag: '<!-- injector:theme -->',
      endTag: '<!-- endinjector -->'
    },

    injectFont: {
      startTag: '<!-- injector:font -->',
      endTag: '<!-- endinjector:font -->'
    },

    injectScripts: {
      startTag: '<!-- injector:scripts -->',
      endTag: '<!-- endinjector -->'
    },

    injectBaseurl: {
      startTag: '// injector:baseUrl',
      endTag: '// endinjector'
    },

    injectRequireMap: {
      startTag: '// injector:requireMap',
      endTag: '// endinjector'
    }
  },

  /* Serve Config */
  serve: {
    // Serve API overall default options
    options: {
      watchFiles: true,
      livereload: true,
      build: true,
      port: 8000,
      livereloadPort: 35729,
    },

    // Sub task connect default options
    connect: paths => ({
      options: {
        hostname: '*',
        port: 8000,
        livereload: true,
        base: paths.staging.web,
        open: true
      }
    }),

    // Sub task watch default options
    watch: paths => ({
      sourceFiles:
      {
        files: [
          `${paths.src.common}/${paths.src.styles}/**/*.css`,
          `${paths.src.common}/${paths.src.javascript}/**/*.js`,
          `${paths.src.common}/${paths.src.javascript}/**/*.json`,
          `${paths.src.common}/${paths.src.javascript}/**/*.css`,
          `${paths.src.common}/${paths.src.javascript}/**/*.html`,
          `${paths.src.common}/${paths.src.typescript}/**/*.js`,
          `${paths.src.common}/${paths.src.typescript}/**/*.ts`,
          `${paths.src.common}/${paths.src.typescript}/**/*.tsx`,
          `${paths.src.common}/${paths.src.typescript}/**/*.json`,
          `${paths.src.common}/${paths.src.typescript}/**/*.css`,
          // Ensures chokidar watches html files under the ts/js
          // folders. chokidar seems to not capture them using
          // the pattern `${paths.src.common}/**/*.html`.
          `${paths.src.common}/${paths.src.typescript}/**/*.html`,
          `${paths.src.common}/**/*.html`,
        ],
        options:
        {
          livereload: true,
          spawn: false,
        }
      },

      sass: {
        files: [
          `${paths.src.common}/${paths.src.themes}/**/*`,
          `${paths.exchangeComponents}/**/*.scss`,
          `${paths.src.common}/${paths.src.javascript}/${paths.components}/**/*.scss`,
          `${paths.src.common}/${paths.src.typescript}/${paths.components}/**/*.scss`
        ],
        options: {
          livereload: true,
          spawn: false
        },
        commands: ['compileSass']
      },

      themes: {
        files: [
          `${paths.staging.themes}/**/*`
        ],
        options: {
          livereload: true,
          spawn: false
        },
        commands: ['copyThemes']
      }
    }),
  }
};
