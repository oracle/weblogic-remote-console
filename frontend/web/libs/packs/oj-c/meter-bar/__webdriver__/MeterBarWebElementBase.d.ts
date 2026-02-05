import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-meter-bar WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, MeterBarWebElement.ts.
 */
export declare class MeterBarWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>max</code> property.
     * The maximum value of the meter bar.
     * @return The value of <code>max</code> property.
     *
     */
    getMax(): Promise<number>;
    /**
     * Gets the value of <code>min</code> property.
     * The minimum value of the meter bar.
     * @return The value of <code>min</code> property.
     *
     */
    getMin(): Promise<number>;
    /**
     * Gets the value of <code>readonly</code> property.
     *
     * @return The value of <code>readonly</code> property.
     *
     */
    getReadonly(): Promise<boolean>;
    /**
     * Sets the value of <code>value</code> property.
     * The value of the meter bar.
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value: number | null): Promise<void>;
    /**
     * Gets the value of <code>value</code> property.
     * The value of the meter bar.
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<number | null>;
    /**
     * Gets the value of <code>baseline</code> property.
     * Define the baseline value of the bar. If undefined, defaults to minimum value of the meter bar.
     * @return The value of <code>baseline</code> property.
     *
     */
    getBaseline(): Promise<number>;
    /**
     * Gets the value of <code>step</code> property.
     *
     * @return The value of <code>step</code> property.
     *
     */
    getStep(): Promise<number>;
    /**
     * Gets the value of <code>color</code> property.
     *
     * @return The value of <code>color</code> property.
     *
     */
    getColor(): Promise<string>;
    /**
     * Gets the value of <code>indicatorSize</code> property.
     *
     * @return The value of <code>indicatorSize</code> property.
     *
     */
    getIndicatorSize(): Promise<number>;
    /**
     * Gets the value of <code>plotArea</code> property.
     *
     * @return The value of <code>plotArea</code> property.
     *
     */
    getPlotArea(): Promise<PlotArea>;
    /**
     * Gets the value of <code>orientation</code> property.
     *
     * @return The value of <code>orientation</code> property.
     *
     */
    getOrientation(): Promise<string>;
    /**
     * Gets the value of <code>referenceLines</code> property.
     *
     * @return The value of <code>referenceLines</code> property.
     *
     */
    getReferenceLines(): Promise<Array<ReferenceLines>>;
    /**
     * Gets the value of <code>thresholdDisplay</code> property.
     *
     * @return The value of <code>thresholdDisplay</code> property.
     *
     */
    getThresholdDisplay(): Promise<string>;
    /**
     * Gets the value of <code>thresholds</code> property.
     *
     * @return The value of <code>thresholds</code> property.
     *
     */
    getThresholds(): Promise<Array<Thresholds>>;
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
     * Specifies the size of the meter bar.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
    /**
     * Gets the value of <code>datatip</code> property.
     *
     * @return The value of <code>datatip</code> property.
     *
     */
    getDatatip(): Promise<null>;
    /**
     * Gets the value of <code>transientValue</code> property.
     *
     * @return The value of <code>transientValue</code> property.
     *
     */
    getTransientValue(): Promise<number>;
}
export interface PlotArea {
    /**
     *
     */
    color: string;
    /**
     *
     */
    rendered: string;
}
export interface ReferenceLines {
    /**
     *
     */
    color: string;
    /**
     *
     */
    position: string;
    /**
     *
     */
    value: number;
    /**
     *
     */
    label: string;
    /**
     *
     */
    style: ReferenceLinesStyle;
}
export interface ReferenceLinesStyle {
    /**
     *
     */
    color: string;
    /**
     *
     */
    fontSize: string;
    /**
     *
     */
    fontStyle: string;
    /**
     *
     */
    fontWeight: string;
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
