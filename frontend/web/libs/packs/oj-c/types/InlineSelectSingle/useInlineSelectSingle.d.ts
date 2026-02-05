import type { ComponentProps, Ref } from 'preact';
import type { ItemContext } from 'ojs/ojcommontypes';
import type { InlineSelectSingle } from './InlineSelectSingle';
import type { Data, InlineSelectHandle, Key } from './types';
/**
 * A custom hook for determining prop values for the preact InlineSelectSingle
 * component from its own props.
 * @param props core-pack InlineSelectSingle props
 * @param ref core-pack ref handle
 */
export declare function useInlineSelectSingle<V extends Key, D extends Data>(props: ComponentProps<typeof InlineSelectSingle<V, D>>, ref: Ref<InlineSelectHandle>): {
    preactInlineSelectSingleProps: {
        'aria-describedby': string | undefined;
        assistiveText: string | undefined;
        data: import("@oracle/oraclejet-preact/UNSAFE_Collection").DataState<V, D> | null;
        hasBackIcon: "always" | "never" | undefined;
        hasClearIcon: "never" | "conditionally" | undefined;
        helpSourceLink: string | undefined;
        helpSourceText: string | undefined;
        isLoading: boolean;
        itemRenderer: ((itemRendererProps: {
            index: number;
            data: D;
        } & {
            metadata: {
                key: V;
                suggestion?: Record<string, any> | undefined;
            };
            searchText?: string;
            selectedKeys?: Set<V> | undefined;
            onSelectionChange: (detail: {
                value: Set<V>;
                target: EventTarget | null;
            }) => void;
        }) => import("preact").ComponentChildren) | undefined;
        itemText: import("./types").ItemText<V, D>;
        label: string;
        onBackIconAction: (() => void) | undefined;
        onCommit: (detail: import("@oracle/oraclejet-preact/utils/UNSAFE_valueUpdateDetail").ValueUpdateDetail<V> & {
            reason: import("@oracle/oraclejet-preact/UNSAFE_InlineSelectSingle/types").CommitMetadata["reason"];
        }) => void;
        onFilter: ({ searchText }: {
            searchText?: string;
        }) => void;
        onLoadRange: (range: import("@oracle/oraclejet-preact/UNSAFE_Collection").Range) => void;
        placeholder: string | undefined;
        ref: import("preact").RefObject<import("@oracle/oraclejet-preact/UNSAFE_InlineSelectSingle/types").InlineSelectHandle>;
        testId: undefined;
        textAlign: "end" | "start" | "right" | undefined;
        userAssistancePosition: "aboveList" | "belowList" | undefined;
        valueItem: ItemContext<V, D> | undefined;
        virtualKeyboard: "number" | "search" | "auto" | "url" | "text" | "email" | "tel" | undefined;
    };
};
