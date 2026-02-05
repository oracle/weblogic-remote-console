"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePickerWebElement = void 0;
const FilePickerWebElementBase_1 = require("./FilePickerWebElementBase");
const file_picker_utils_1 = require("@oracle/oraclejet-webdriver/lib/file-picker-utils");
/**
 * The component WebElement for [oj-c-file-picker](../../jsdocs/oj-c.FilePicker.html).
 * Do not instantiate this class directly, instead, use
 * [findFilePicker](../functions/findFilePicker.html).
 */
class FilePickerWebElement extends FilePickerWebElementBase_1.FilePickerWebElementBase {
    /**
     * Takes an Array of objects containing file paths + types.
     * These files will be read from the local filesystem and then sent
     * to the oj-file-picker to simulate user file selection. Only the basename of
     * the file will be sent, not the entire path to make it consistent with how
     * the browser sets the value.
     * @param files An array of objects containing the path and type of selected files
     */
    async doSelect(files) {
        return (0, file_picker_utils_1.doSelect)(this, files);
    }
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
    static async setupPickFiles(driver, files) {
        return (0, file_picker_utils_1.setupPickFiles)(driver, files);
    }
}
exports.FilePickerWebElement = FilePickerWebElement;
//# sourceMappingURL=FilePickerWebElement.js.map