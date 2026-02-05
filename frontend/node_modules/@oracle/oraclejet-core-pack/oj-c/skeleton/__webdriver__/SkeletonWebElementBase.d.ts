import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-skeleton WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SkeletonWebElement.ts.
 */
export declare class SkeletonWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>height</code> property.
     * Specifies the height of the skeleton
     * @return The value of <code>height</code> property.
     *
     */
    getHeight(): Promise<number | string>;
    /**
     * Gets the value of <code>width</code> property.
     * Specifies the width of the skeleton
     * @return The value of <code>width</code> property.
     *
     */
    getWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>borderRadius</code> property.
     * Specifies the border radius of the skeleton
     * @return The value of <code>borderRadius</code> property.
     *
     */
    getBorderRadius(): Promise<number | string>;
}
