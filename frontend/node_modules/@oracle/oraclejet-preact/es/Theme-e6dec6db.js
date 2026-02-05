/* @oracle/oraclejet-preact: undefined */
/**
 * The global theme's structure is defined here, where the theme associates the list of components
 * with their respective theme types. The theme is passed via the Environment context
 * and utilized by components using the `useComponentTheme` hook.
 */
const colorThemes = ['light', 'dark'];
const ROOT_SELECTOR = ':root';
// Constants for colorscheme classnames
// These are needed to support applications using legacy code
const DARK_CLASS = 'oj-c-colorscheme-dark';
const LIGHT_CLASS = 'oj-c-colorscheme-light';
const INVERT_CLASS = 'oj-color-invert'; // legacy class name for compatibility
const COLORSCHEME_DEPENDENT_CLASS = 'oj-c-colorscheme-dependent'; // The dependent class name is used to force re-evaluation
// of CSS variables that reference colorScheme token vars
const SCALE_DEPENDENT_CLASS = 'oj-scale-dependent';
const SCALE_DEPENDENT_SELECTOR = `.${SCALE_DEPENDENT_CLASS}`;
// Constants for scale classnames
const SCALE_SM_CLASS = 'oj-scale-sm'; // legacy class name for compatibility
// We need to specify :root.oj-scale-sm in the selector due to how legacy switches scale
const SCALE_SM_SELECTORS = `.${SCALE_SM_CLASS}, ${ROOT_SELECTOR}.${SCALE_SM_CLASS}`;
const SCALE_MD_CLASS = 'oj-scale-md'; // legacy class name for compatibility
// We need to specify :root.oj-scale-md in the selector due to how legacy switches scale
const SCALE_MD_SELECTORS = `.${SCALE_MD_CLASS}, ${ROOT_SELECTOR}.${SCALE_MD_CLASS}`;
const SCALE_LG_CLASS = 'oj-scale-lg'; // legacy class name for compatibility
const SCALE_LG_SELECTORS = `.${SCALE_LG_CLASS}`; // 'lg' scale only has a single selector.
const SCALE_DEFAULT_SELECTORS = ROOT_SELECTOR;
// For legacy compatibility, we need to add :root.oj-scale-sm and :root.oj-scale-md so that the
// :root vars that refer to scale vars will re-evaluate in legacy
const SCALE_DEPENDENT_SELECTORS = `${SCALE_DEPENDENT_SELECTOR}, ${ROOT_SELECTOR}.${SCALE_SM_CLASS}, ${ROOT_SELECTOR}.${SCALE_MD_CLASS}`;
// Constants for density classnames
const DENSITY_STANDARD_CLASS = 'oj-density-standard';
const DENSITY_STANDARD_SELECTORS = `.${DENSITY_STANDARD_CLASS}`;
const DENSITY_COMPACT_CLASS = 'oj-density-compact';
const DENSITY_COMPACT_SELECTORS = `.${DENSITY_COMPACT_CLASS}`;
// This selector is used when reevaluating CSS var values as they change density contexts in the DOM.
const DENSITY_SELECTORS = `${DENSITY_COMPACT_SELECTORS}, ${DENSITY_STANDARD_SELECTORS}`;
const DENSITY_DEPENDENT_CLASS = 'oj-density-dependent';
const DENSITY_DEPENDENT_SELECTOR = `.${DENSITY_DEPENDENT_CLASS}`;

export { COLORSCHEME_DEPENDENT_CLASS as C, DARK_CLASS as D, INVERT_CLASS as I, LIGHT_CLASS as L, ROOT_SELECTOR as R, SCALE_SM_CLASS as S, SCALE_MD_CLASS as a, SCALE_LG_CLASS as b, SCALE_DEPENDENT_CLASS as c, DENSITY_COMPACT_CLASS as d, DENSITY_STANDARD_CLASS as e, DENSITY_DEPENDENT_CLASS as f, colorThemes as g, SCALE_SM_SELECTORS as h, SCALE_MD_SELECTORS as i, SCALE_LG_SELECTORS as j, SCALE_DEPENDENT_SELECTORS as k, SCALE_DEFAULT_SELECTORS as l, DENSITY_COMPACT_SELECTORS as m, DENSITY_STANDARD_SELECTORS as n, SCALE_DEPENDENT_SELECTOR as o, DENSITY_DEPENDENT_SELECTOR as p, DENSITY_SELECTORS as q };
//# sourceMappingURL=Theme-e6dec6db.js.map
