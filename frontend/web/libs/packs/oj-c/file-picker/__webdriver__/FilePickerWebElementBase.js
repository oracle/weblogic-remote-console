"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePickerWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-file-picker WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, FilePickerWebElement.ts.
 */
class FilePickerWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>accept</code> property.
     * An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
     * @return The value of <code>accept</code> property.
     *
     */
    getAccept() {
        return this.getProperty('accept');
    }
    /**
     * Gets the value of <code>capture</code> property.
     * Specifies the preferred facing mode for the device's media capture mechanism.
     * @return The value of <code>capture</code> property.
     *
     */
    getCapture() {
        return this.getProperty('capture');
    }
    /**
     * Gets the value of <code>disabled</code> property.
     * Disables the filepicker if set to true
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled() {
        return this.getProperty('disabled');
    }
    /**
     * Gets the value of <code>primaryText</code> property.
     * The primary text for the default file picker.
     * @return The value of <code>primaryText</code> property.
     *
     */
    getPrimaryText() {
        return this.getProperty('primaryText');
    }
    /**
     * Gets the value of <code>secondaryText</code> property.
     * The secondary text for the default file picker.
     * @return The value of <code>secondaryText</code> property.
     *
     */
    getSecondaryText() {
        return this.getProperty('secondaryText');
    }
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Whether to allow single or multiple file selection.
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode() {
        return this.getProperty('selectionMode');
    }
}
exports.FilePickerWebElementBase = FilePickerWebElementBase;
//# sourceMappingURL=FilePickerWebElementBase.js.map