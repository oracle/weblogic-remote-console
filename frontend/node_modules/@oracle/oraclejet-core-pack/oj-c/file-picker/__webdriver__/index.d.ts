import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { FilePickerWebElement } from './FilePickerWebElement';
export { FilePickerWebElement };
/**
 * Retrieve an instance of [FilePickerWebElement](../classes/FilePickerWebElement.html).
 * @example
 * ```javascript
 * import { findFilePicker } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findFilePicker(driver, By.id('my-oj-c-file-picker'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findFilePicker(driver: DriverLike, by: By): Promise<FilePickerWebElement>;
