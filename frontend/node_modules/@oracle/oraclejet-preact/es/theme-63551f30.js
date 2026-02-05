/* @oracle/oraclejet-preact: undefined */
import { L as LIGHT_CLASS, C as COLORSCHEME_DEPENDENT_CLASS, S as SCALE_SM_CLASS, a as SCALE_MD_CLASS, b as SCALE_LG_CLASS, c as SCALE_DEPENDENT_CLASS, d as DENSITY_COMPACT_CLASS, e as DENSITY_STANDARD_CLASS, f as DENSITY_DEPENDENT_CLASS, D as DARK_CLASS, I as INVERT_CLASS } from './Theme-e6dec6db.js';

const DARK_CLASSES = `${DARK_CLASS} ${INVERT_CLASS}`;
const themeInterpolations = {
    colorScheme: ({ colorScheme }) => colorScheme === undefined
        ? {}
        : {
            class: `${colorScheme === 'dark' ? DARK_CLASSES : LIGHT_CLASS} ${COLORSCHEME_DEPENDENT_CLASS}`
        },
    scale: ({ scale }) => scale === undefined
        ? {}
        : {
            class: `${scale === 'sm' ? SCALE_SM_CLASS : scale === 'md' ? SCALE_MD_CLASS : SCALE_LG_CLASS} ${SCALE_DEPENDENT_CLASS}`
        },
    density: ({ density }) => density === undefined
        ? {}
        : {
            class: `${density === 'compact' ? DENSITY_COMPACT_CLASS : DENSITY_STANDARD_CLASS} ${DENSITY_DEPENDENT_CLASS}`
        }
};

export { themeInterpolations as t };
//# sourceMappingURL=theme-63551f30.js.map
