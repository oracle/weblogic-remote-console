import { CalendarMonthRequired } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import { InputMonthMaskWebElementBase } from './InputMonthMaskWebElementBase';
/**
 * The component WebElement for [oj-c-input-month-mask](../../jsdocs/oj-c.InputMonthMask.html).
 * Do not instantiate this class directly, instead, use
 * [findInputMonthMask](../modules.html#findInputMonthMask).
 */
export declare class InputMonthMaskWebElement extends InputMonthMaskWebElementBase {
    /**
     * Sets the value of <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     *
     */
    changeDate(value: CalendarMonthRequired): Promise<void>;
}
