import Converter = require('ojs/ojconverter');
import Validator = require('ojs/ojvalidator');
import AsyncValidator = require('ojs/ojvalidator-async');
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
export type DisplayOptions = {
    /**
     * Display options for auxiliary converter hint text.
     */
    converterHint?: 'display' | 'none';
    /**
     * Display options for auxiliary message text.
     */
    messages?: 'display' | 'none';
    /**
     * Display options for auxiliary validator hint text.
     */
    validatorHint?: 'display' | 'none';
};
/**
 * Form component help information.
 */
export type Help = {
    /**
     * A type of user assistance text. User assistance text is used to provide guidance to
     * help the user understand what data to enter or select.
     */
    instruction?: string;
};
/**
 * The helpHints object contains a definition property and a source property.
 */
export type HelpHints = {
    /**
     * A type of user assistance text. User assistance text is used to provide guidance to help
     * the user understand what data to enter or select. help-hints could come from a help system.
     */
    definition?: string;
    /**
     * Help source URL associated with the component.
     */
    source?: string;
    /**
     * Custom text to be used for the source link.
     */
    sourceText?: string;
};
/**
 * The props object for the useAssistiveText hook
 */
export type UseAssistiveTextProps = {
    /**
     * Function to add busyState
     */
    addBusyState?: (desc: string) => () => void;
    /**
     * The converter instance
     */
    converter?: Converter<unknown>;
    /**
     * Display options for auxiliary content that determines whether or not it should be displayed.
     */
    displayOptions?: DisplayOptions;
    /**
     * The help object
     */
    help?: Help;
    /**
     * The helpHints object
     */
    helpHints?: HelpHints;
    /**
     * User assistance density
     */
    userAssistanceDensity?: 'compact' | 'efficient' | 'reflow';
    /**
     * Component validators
     */
    validators?: (Validator<unknown> | AsyncValidator<unknown>)[];
};
/**
 * A custom hook to determine which assistive text should be shown.
 */
export declare function useAssistiveText({ addBusyState, converter, displayOptions, help, helpHints, userAssistanceDensity, validators }: UseAssistiveTextProps): {
    assistiveText: string | undefined;
    helpSourceLink: string | undefined;
    helpSourceText: string | undefined;
};
