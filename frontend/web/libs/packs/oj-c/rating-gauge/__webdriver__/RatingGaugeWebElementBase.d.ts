import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-rating-gauge WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, RatingGaugeWebElement.ts.
 */
export declare class RatingGaugeWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>max</code> property.
     * The maximum value of the gauge.
     * @return The value of <code>max</code> property.
     *
     */
    getMax(): Promise<number>;
    /**
     * Gets the value of <code>readonly</code> property.
     *
     * @return The value of <code>readonly</code> property.
     *
     */
    getReadonly(): Promise<boolean>;
    /**
     * Gets the value of <code>disabled</code> property.
     *
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled(): Promise<boolean>;
    /**
     * Sets the value of <code>changed</code> property.
     * Whether there has been a value entered by the user even if it is the same as the initial value.
     * @param changed The value to set for <code>changed</code>
     *
     */
    changeChanged(changed: boolean): Promise<void>;
    /**
     * Gets the value of <code>changed</code> property.
     * Whether there has been a value entered by the user even if it is the same as the initial value.
     * @return The value of <code>changed</code> property.
     *
     */
    getChanged(): Promise<boolean>;
    /**
     * Sets the value of <code>value</code> property.
     * The value of the Rating Gauge.
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value: number | null): Promise<void>;
    /**
     * Gets the value of <code>value</code> property.
     * The value of the Rating Gauge.
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<number | null>;
    /**
     * Gets the value of <code>step</code> property.
     *
     * @return The value of <code>step</code> property.
     *
     */
    getStep(): Promise<number>;
    /**
     * Gets the value of <code>describedBy</code> property.
     *
     * @return The value of <code>describedBy</code> property.
     *
     */
    getDescribedBy(): Promise<string | null>;
    /**
     * Gets the value of <code>labelledBy</code> property.
     *
     * @return The value of <code>labelledBy</code> property.
     *
     */
    getLabelledBy(): Promise<string | null>;
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the rating gauge items.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
    /**
     * Gets the value of <code>color</code> property.
     * Specifies the color of the rating gauge items.
     * @return The value of <code>color</code> property.
     *
     */
    getColor(): Promise<string>;
    /**
     * Gets the value of <code>thresholds</code> property.
     *
     * @return The value of <code>thresholds</code> property.
     *
     */
    getThresholds(): Promise<Array<Thresholds>>;
    /**
     * Gets the value of <code>datatip</code> property.
     *
     * @return The value of <code>datatip</code> property.
     *
     */
    getDatatip(): Promise<null>;
    /**
     * Gets the value of <code>tooltip</code> property.
     *
     * @return The value of <code>tooltip</code> property.
     *
     */
    getTooltip(): Promise<string>;
    /**
     * Gets the value of <code>transientValue</code> property.
     *
     * @return The value of <code>transientValue</code> property.
     *
     */
    getTransientValue(): Promise<number>;
}
export interface Thresholds {
    /**
     *
     */
    accessibleLabel: string;
    /**
     *
     */
    color: string;
    /**
     *
     */
    max: number;
}
