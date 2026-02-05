/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { FilePicker as PreactFilePicker } from '@oracle/oraclejet-preact/UNSAFE_FilePicker';
import { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import { ComponentProps, Ref, ComponentType } from 'preact';
import { Action, CancelableAction, ObservedGlobalProps, Slot, ExtendGlobalProps } from 'ojs/ojvcomponent';
import 'css!oj-c/file-picker/file-picker-styles.css';
type PreactFilePickerProps = ComponentProps<typeof PreactFilePicker>;
type Props = ObservedGlobalProps<'aria-label'> & {
    /**
     * @description
     * An array of strings of allowed MIME types or file extensions that can be uploaded; this is unlike the accept attribute of the html &lt;input> element that accepts a simple comma-delimited string. If not specified, accept all file types.
     * <p>Note: If accept is specified, files with empty string type will be rejected if no match found in the "accept" value. Due to browser/OS differences, you may have to specify multiple values for the same value type. For example, for a CSV file, you might need to specify 'text/csv', '.csv', 'application/vnd.ms-excel', 'text/comma-separated-values' and others depending on your target browser/OS. </p>
     *
     * @ojmetadata description "An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types"
     * @ojmetadata displayName "Accept"
     * @ojmetadata help "#accept"
     */
    accept?: string[] | null;
    /**
     * @description
     * Specifies the preferred facing mode for the device's
     * <a href="https://www.w3.org/TR/html-media-capture/#dom-htmlinputelement-capture">media capture</a> mechanism;
     * This is most often used to provide direct camera access on mobile devices.  Note that the accept attribute must
     * be specified and have an associated capture control type (e.g.["image/*"]) for the capture attribute to take effect.  Support may vary by browser.
     *
     * @ojmetadata description "Specifies the preferred facing mode for the device's media capture mechanism."
     * @ojmetadata displayName "Capture"
     * @ojmetadata help "#capture"
     * @ojmetadata propertyEditorValues {
     *     "user": {
     *       "description": "Specifies user-facing as the preferred mode",
     *       "displayName": "User"
     *     },
     *      "environment": {
     *       "description": "Specifies environment-facing as the preferred mode",
     *       "displayName": "Environment"
     *     },
     *     "implementation": {
     *       "description": "Specifies an implementation-specific default as the preferred facing mode",
     *       "displayName": "Implementation"
     *     },
     *    "none": {
     *       "description": "No capture mechanism is used",
     *       "displayName": "None"
     *     }
     *   }
     */
    capture?: PreactFilePickerProps['capture'] | null;
    /**
     * @description
     * Disables the filepicker if set to <code class="prettyprint">true</code>.
     *
     * @ojmetadata description "Disables the filepicker if set to true"
     * @ojmetadata displayName "Disabled"
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @description
     * The primary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     * @ojmetadata description "The primary text for the default file picker."
     * @ojmetadata displayName "Primary Text"
     * @ojmetadata help "#primaryText"
     */
    primaryText?: string | (() => string);
    /**
     * @description
     * The secondary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     * The formatting function takes in a property object that contains the selection mode of the filepicker.
     * @ojmetadata description "The secondary text for the default file picker."
     * @ojmetadata displayName "Secondary Text"
     * @ojmetadata help "#secondaryText"
     */
    secondaryText?: string | ((fileOptions: {
        selectionMode: 'multiple' | 'single';
    }) => string);
    /**
     * @ojmetadata description "Whether to allow single or multiple file selection."
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     * @ojmetadata propertyEditorValues {
     *     "multiple": {
     *       "description": "multiple file selection",
     *       "displayName": "Multiple"
     *     },
     *     "single": {
     *       "description": "single file selection",
     *       "displayName": "Single"
     *     }
     *   }
     */
    selectionMode?: PreactFilePickerProps['selectionMode'];
    /**
     * @description
     * <p>The <code class="prettyprint">trigger</code> slot is used to replace the default content of the file picker.
     * File picker will add click and drag and drop listeners to the slot content.
     * The application is responsible for setting the tabindex attribute for keyboard accessibility.</p>
     *
     * @ojmetadata description "The trigger slot is used to replace the default content of the file picker."
     * @ojmetadata help "#trigger"
     */
    trigger?: Slot;
    /**
     * @description
     * Triggered before files are selected to allow for custom validation.  To reject the selected files, the application can either call event.preventDefault() or pass a rejected Promise to the accept detail property. The latter approach is recommended because this allows the application to send a message stating why the files were rejected.
     *
     * @ojmetadata description "Triggered before files are selected to allow for custom validation"
     * @ojmetadata help "#event:beforeSelect"
     */
    onOjBeforeSelect?: CancelableAction<BeforeDetail>;
    /**
     * @description
     * Triggered when invalid files are selected.  This event provides the application with a list of messages that should be displayed to give the user feedback about the
     * problems with their selection.  This feedback can be safely cleared when a subsequent ojBeforeSelect, ojInvalidSelect, or ojSelect event is received.  Additionally the
     * event.detail.until property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon resolution
     * of this Promise.
     *
     * @ojmetadata description "Triggered when invalid files are selected"
     * @ojmetadata help "#event:invalidSelect"
     *
     */
    onOjInvalidSelect?: Action<InvalidDetail>;
    /**
     * @ojmetadata description "Triggered after the files are selected"
     * @ojmetadata help "#event:select"
     */
    onOjSelect?: Action<SelectDetail>;
};
type BeforeDetail = {
    /**
     * @ojmetadata description "The selected files"
     */
    files: FileList;
};
type InvalidDetail = {
    /**
     * @ojmetadata description "Messages that should be displayed to the user describing invalid files."
     */
    messages: ComponentMessageItem[];
    /**
     * @ojmetadata description "This property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon the resolution of this Promise."
     */
    until: Promise<void> | null;
};
type SelectDetail = {
    /**
     * @ojmetadata description "The files that were just selected."
     */
    files: FileList;
};
type FilePickerHandle = {
    /**
     * @ojmetadata description "Sets focus on the file picker or the first tabbable element for a file picker with custom content."
     */
    focus: () => void;
    /**
     * @ojmetadata description "Blurs the file picker."
     */
    blur: () => void;
};
/**
 * This export corresponds to the FilePicker Preact component. For the oj-c-file-picker custom element, import CFilePickerElement instead.
 */
export declare const FilePicker: ComponentType<ExtendGlobalProps<Props> & {
    ref?: Ref<FilePickerHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-file-picker custom element. For the FilePicker Preact component, import FilePicker instead.
 */
export interface CFilePickerElement extends JetElement<CFilePickerElementSettableProperties>, CFilePickerElementSettableProperties {
    addEventListener<T extends keyof CFilePickerElementEventMap>(type: T, listener: (this: HTMLElement, ev: CFilePickerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CFilePickerElementSettableProperties>(property: T): CFilePickerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CFilePickerElementSettableProperties>(property: T, value: CFilePickerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CFilePickerElementSettableProperties>): void;
    setProperties(properties: CFilePickerElementSettablePropertiesLenient): void;
    blur: () => void;
    focus: () => void;
}
export namespace CFilePickerElement {
    interface ojBeforeSelect extends CustomEvent<BeforeDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojInvalidSelect extends CustomEvent<InvalidDetail & {}> {
    }
    interface ojSelect extends CustomEvent<SelectDetail & {}> {
    }
    type acceptChanged = JetElementCustomEventStrict<CFilePickerElement['accept']>;
    type captureChanged = JetElementCustomEventStrict<CFilePickerElement['capture']>;
    type disabledChanged = JetElementCustomEventStrict<CFilePickerElement['disabled']>;
    type primaryTextChanged = JetElementCustomEventStrict<CFilePickerElement['primaryText']>;
    type secondaryTextChanged = JetElementCustomEventStrict<CFilePickerElement['secondaryText']>;
    type selectionModeChanged = JetElementCustomEventStrict<CFilePickerElement['selectionMode']>;
}
export interface CFilePickerElementEventMap extends HTMLElementEventMap {
    'ojBeforeSelect': CFilePickerElement.ojBeforeSelect;
    'ojInvalidSelect': CFilePickerElement.ojInvalidSelect;
    'ojSelect': CFilePickerElement.ojSelect;
    'acceptChanged': JetElementCustomEventStrict<CFilePickerElement['accept']>;
    'captureChanged': JetElementCustomEventStrict<CFilePickerElement['capture']>;
    'disabledChanged': JetElementCustomEventStrict<CFilePickerElement['disabled']>;
    'primaryTextChanged': JetElementCustomEventStrict<CFilePickerElement['primaryText']>;
    'secondaryTextChanged': JetElementCustomEventStrict<CFilePickerElement['secondaryText']>;
    'selectionModeChanged': JetElementCustomEventStrict<CFilePickerElement['selectionMode']>;
}
export interface CFilePickerElementSettableProperties extends JetSettableProperties {
    /**
     * An array of strings of allowed MIME types or file extensions that can be uploaded; this is unlike the accept attribute of the html &lt;input> element that accepts a simple comma-delimited string. If not specified, accept all file types.
     * <p>Note: If accept is specified, files with empty string type will be rejected if no match found in the "accept" value. Due to browser/OS differences, you may have to specify multiple values for the same value type. For example, for a CSV file, you might need to specify 'text/csv', '.csv', 'application/vnd.ms-excel', 'text/comma-separated-values' and others depending on your target browser/OS. </p>
     */
    accept?: Props['accept'];
    /**
     * Specifies the preferred facing mode for the device's
     * <a href="https://www.w3.org/TR/html-media-capture/#dom-htmlinputelement-capture">media capture</a> mechanism;
     * This is most often used to provide direct camera access on mobile devices.  Note that the accept attribute must
     * be specified and have an associated capture control type (e.g.["image/*"]) for the capture attribute to take effect.  Support may vary by browser.
     */
    capture?: Props['capture'];
    /**
     * Disables the filepicker if set to <code class="prettyprint">true</code>.
     */
    disabled?: Props['disabled'];
    /**
     * The primary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     */
    primaryText?: Props['primaryText'];
    /**
     * The secondary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     * The formatting function takes in a property object that contains the selection mode of the filepicker.
     */
    secondaryText?: Props['secondaryText'];
    selectionMode?: Props['selectionMode'];
}
export interface CFilePickerElementSettablePropertiesLenient extends Partial<CFilePickerElementSettableProperties> {
    [key: string]: any;
}
export interface FilePickerIntrinsicProps extends Partial<Readonly<CFilePickerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered before files are selected to allow for custom validation.  To reject the selected files, the application can either call event.preventDefault() or pass a rejected Promise to the accept detail property. The latter approach is recommended because this allows the application to send a message stating why the files were rejected.
     */
    onojBeforeSelect?: (value: CFilePickerElementEventMap['ojBeforeSelect']) => void;
    /**
     * Triggered when invalid files are selected.  This event provides the application with a list of messages that should be displayed to give the user feedback about the
     * problems with their selection.  This feedback can be safely cleared when a subsequent ojBeforeSelect, ojInvalidSelect, or ojSelect event is received.  Additionally the
     * event.detail.until property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon resolution
     * of this Promise.
     */
    onojInvalidSelect?: (value: CFilePickerElementEventMap['ojInvalidSelect']) => void;
    onojSelect?: (value: CFilePickerElementEventMap['ojSelect']) => void;
    onacceptChanged?: (value: CFilePickerElementEventMap['acceptChanged']) => void;
    oncaptureChanged?: (value: CFilePickerElementEventMap['captureChanged']) => void;
    ondisabledChanged?: (value: CFilePickerElementEventMap['disabledChanged']) => void;
    onprimaryTextChanged?: (value: CFilePickerElementEventMap['primaryTextChanged']) => void;
    onsecondaryTextChanged?: (value: CFilePickerElementEventMap['secondaryTextChanged']) => void;
    onselectionModeChanged?: (value: CFilePickerElementEventMap['selectionModeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-file-picker': FilePickerIntrinsicProps;
        }
    }
}
