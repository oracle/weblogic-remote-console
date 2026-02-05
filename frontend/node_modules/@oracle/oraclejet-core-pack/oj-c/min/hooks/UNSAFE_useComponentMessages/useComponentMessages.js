define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useComponentMessages = useComponentMessages;
    /**
     * A custom hook that returns the correct messages to show based on
     * certain properties of the component.
     *
     * @param param0 The props for the useComponentMessages hook
     * @returns An array of messages to display
     */
    function useComponentMessages({ evMessages, messagesCustom, readonly, readonlyUserAssistanceShown }) {
        // If the component is readonly:
        //   a) readonlyUserAssistanceShown === 'confirmationAndInfoMessages'
        //      filter messagesCustom and only return info/confirmation messages
        //   b) readonlyUserAssistanceShown === 'none', return an empty array
        //
        // If the component is not readonly, return the useEditableValue messages
        // which contain the messagesCustom messages in addition to converter and
        // validator messages.
        const componentMessages = (0, hooks_1.useMemo)(() => {
            return readonly
                ? readonlyUserAssistanceShown === 'confirmationAndInfoMessages'
                    ? messagesCustom?.filter((message) => message.severity === 'confirmation' || message.severity === 'info')
                    : []
                : evMessages;
        }, [messagesCustom, readonly, readonlyUserAssistanceShown, evMessages]);
        return componentMessages;
    }
});
