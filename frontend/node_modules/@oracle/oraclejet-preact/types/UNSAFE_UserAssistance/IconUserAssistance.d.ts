type Props = {
    /**
     * Text to provide guidance to help the user understand what data to enter.
     */
    assistiveText?: string;
    /**
     * Help source URL associated with the component.
     */
    helpSourceLink?: string;
    /**
     * Custom text to be rendered for the `helpSourceLink`. "Learn more" will be used if no custom text is provided.
     */
    helpSourceText?: string;
    /**
     * Whether the trigger element is in tab sequence
     */
    isTabbable?: boolean;
    /**
     * ID of the pop up content that can be used for aria-describedby
     */
    id?: string;
};
/**
 * Created to match icon user assistance spec for use with radio option, pending design review
 * of inline UA assistance.
 */
declare const IconUserAssistance: ({ assistiveText, helpSourceLink, helpSourceText, isTabbable, id }: Props) => import("preact").JSX.Element | null;
export { IconUserAssistance };
