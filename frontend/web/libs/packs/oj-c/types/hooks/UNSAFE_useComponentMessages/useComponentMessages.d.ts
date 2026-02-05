import { ComponentProps } from 'preact';
import type { InputText } from 'oj-c/input-text';
type InputTextProps = ComponentProps<typeof InputText>;
type UseComponentMessagesProps = {
    /**
     * Messages produced by the useEditableValue hook, including
     * converter and validator messages.
     */
    evMessages: InputTextProps['messagesCustom'];
    /**
     * The messagesCustom passed to the component.
     */
    messagesCustom: InputTextProps['messagesCustom'];
    /**
     * Whether the component is readonly.
     */
    readonly: InputTextProps['readonly'];
    /**
     * Specifies which user assistance types should be shown when the component is readonly
     */
    readonlyUserAssistanceShown: InputTextProps['readonlyUserAssistanceShown'];
};
/**
 * A custom hook that returns the correct messages to show based on
 * certain properties of the component.
 *
 * @param param0 The props for the useComponentMessages hook
 * @returns An array of messages to display
 */
export declare function useComponentMessages({ evMessages, messagesCustom, readonly, readonlyUserAssistanceShown }: UseComponentMessagesProps): import("@oracle/oraclejet-preact/UNSAFE_ComponentMessage").ComponentMessageItem[] | undefined;
export {};
