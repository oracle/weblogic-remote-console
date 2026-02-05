import { WebDriver } from 'selenium-webdriver';
import { FilePickerWebElementBase } from './FilePickerWebElementBase';
/**
 * The component WebElement for [oj-c-file-picker](../../jsdocs/oj-c.FilePicker.html).
 * Do not instantiate this class directly, instead, use
 * [findFilePicker](../functions/findFilePicker.html).
 */
export declare class FilePickerWebElement extends FilePickerWebElementBase {
    /**
     * Takes an Array of objects containing file paths + types.
     * These files will be read from the local filesystem and then sent
     * to the oj-file-picker to simulate user file selection. Only the basename of
     * the file will be sent, not the entire path to make it consistent with how
     * the browser sets the value.
     * @param files An array of objects containing the path and type of selected files
     */
    doSelect(files: Array<{
        path: string;
        type: string;
    }>): Promise<boolean>;
    /**
     * This method should be called right before ojfilepickerutils.pickFiles
     * Takes the webdriver and an Array of objects containing file paths + types.
     * These files will be read from the local filesystem and then sent
     * to the pickFiles method to simulate user file selection. Only the basename of
     * the file will be sent, not the entire path to make it consistent with how
     * the browser sets the value.
     * @param driver the Webdriver of the test
     * @param files An array of objects containing the path and type of selected files
     */
    static setupPickFiles(driver: WebDriver, files: Array<{
        path: string;
        type: string;
    }>): Promise<void>;
}
