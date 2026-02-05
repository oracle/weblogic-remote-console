import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-file-picker WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, FilePickerWebElement.ts.
 */
export declare class FilePickerWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>accept</code> property.
     * An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
     * @return The value of <code>accept</code> property.
     *
     */
    getAccept(): Promise<Array<string> | null>;
    /**
     * Gets the value of <code>capture</code> property.
     * Specifies the preferred facing mode for the device's media capture mechanism.
     * @return The value of <code>capture</code> property.
     *
     */
    getCapture(): Promise<string | null>;
    /**
     * Gets the value of <code>disabled</code> property.
     * Disables the filepicker if set to true
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled(): Promise<boolean>;
    /**
     * Gets the value of <code>primaryText</code> property.
     * The primary text for the default file picker.
     * @return The value of <code>primaryText</code> property.
     *
     */
    getPrimaryText(): Promise<string | null>;
    /**
     * Gets the value of <code>secondaryText</code> property.
     * The secondary text for the default file picker.
     * @return The value of <code>secondaryText</code> property.
     *
     */
    getSecondaryText(): Promise<string | null>;
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Whether to allow single or multiple file selection.
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode(): Promise<string>;
}
