export type Size = 0 | `calc(${string})` | `var(${string})` | `--${string}` | `${number}x` | `${number}%` | `${number}${CssUnits}`;
type CssUnits = (typeof cssUnits)[number];
declare const cssUnits: readonly ["ch", "cm", "mm", "in", "pc", "pt", "px", "em", "ex", "rem", "vh", "vw", "vmin", "vmax"];
/**
 * Given a value that is of type Size, transform the value into
 * something that is usable in a css style property.
 * @param {string | 0 } v - a value to transform
 * @returns {string | 0}
 */
export declare const sizeToCSS: (v: Size) => string | 0;
export {};
