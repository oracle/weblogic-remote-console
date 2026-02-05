/* @oracle/oraclejet-preact: undefined */
'use strict';

var Theme = require('./Theme-f06687af.js');

const DARK_CLASSES = `${Theme.DARK_CLASS} ${Theme.INVERT_CLASS}`;
const themeInterpolations = {
    colorScheme: ({ colorScheme }) => colorScheme === undefined
        ? {}
        : {
            class: `${colorScheme === 'dark' ? DARK_CLASSES : Theme.LIGHT_CLASS} ${Theme.COLORSCHEME_DEPENDENT_CLASS}`
        },
    scale: ({ scale }) => scale === undefined
        ? {}
        : {
            class: `${scale === 'sm' ? Theme.SCALE_SM_CLASS : scale === 'md' ? Theme.SCALE_MD_CLASS : Theme.SCALE_LG_CLASS} ${Theme.SCALE_DEPENDENT_CLASS}`
        },
    density: ({ density }) => density === undefined
        ? {}
        : {
            class: `${density === 'compact' ? Theme.DENSITY_COMPACT_CLASS : Theme.DENSITY_STANDARD_CLASS} ${Theme.DENSITY_DEPENDENT_CLASS}`
        }
};

exports.themeInterpolations = themeInterpolations;
//# sourceMappingURL=theme-dfd6a9fe.js.map
