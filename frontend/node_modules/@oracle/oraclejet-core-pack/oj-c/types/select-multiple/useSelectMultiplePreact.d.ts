/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { DataState } from '@oracle/oraclejet-preact/UNSAFE_Collection';
import type { ValueUpdateDetail } from '@oracle/oraclejet-preact/utils/UNSAFE_valueUpdateDetail';
import type { ItemContext } from 'ojs/ojcommontypes';
import type { SelectMultipleProps } from './select-multiple';
/**
 * This hook manages state and other related props for the Select Multiple component.
 */
export declare function useSelectMultiplePreact<K extends string | number, D extends Record<string, any>>({ collectionTemplate, data, disabled, displayOptions, itemTemplate, itemText, labelEdge, labelHint, labelStartWidth, matchBy: propMatchBy, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, required, requiredMessageDetail: propRequiredMessageDetail, textAlign, userAssistanceDensity, value: propValue, valueItems: propValueItems, virtualKeyboard, onMessagesCustomChanged, onValidChanged, onValueChanged, onValueItemsChanged, ...otherProps }: SelectMultipleProps<K, D>, addBusyState: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    selectMultipleProps: {
        'aria-describedby': string | undefined;
        collectionRenderer: ((collectionRendererProps: import("@oracle/oraclejet-preact/UNSAFE_SelectMultiple/SelectMultiple.types").CollectionRendererProps<K, D>) => import("preact").ComponentChildren) | undefined;
        data: DataState<K, D> | null;
        isDisabled: boolean | undefined;
        isLoading: boolean;
        isReadonly: boolean | undefined;
        isRequired: boolean | undefined;
        isRequiredShown: boolean | undefined;
        itemRenderer: ((itemRendererProps: import("@oracle/oraclejet-preact/UNSAFE_SelectMultiple/SelectMultiple.types").ItemRendererProps<K, D>) => import("preact").ComponentChildren) | undefined;
        itemText: keyof D | ((itemContext: ItemContext<K, D>) => string);
        label: string;
        labelEdge: "none" | "start" | "top" | "inside" | undefined;
        labelStartWidth: import("@oracle/oraclejet-preact/utils/UNSAFE_size").Size | undefined;
        messages: import("@oracle/oraclejet-preact/UNSAFE_ComponentMessage").ComponentMessageItem[] | undefined;
        onCommit: ({ value }: ValueUpdateDetail<Set<K>>) => Promise<void>;
        onFilter: ({ searchText }: {
            searchText?: string;
        }) => void;
        onLoadRange: (range: import("@oracle/oraclejet-preact/UNSAFE_Collection").Range) => void;
        placeholder: string | undefined;
        textAlign: "end" | "start" | "right" | undefined;
        userAssistanceDensity: import("@oracle/oraclejet-preact/UNSAFE_UserAssistance").UserAssistanceDensityType | undefined;
        valueItems: ItemContext<K, D>[] | undefined;
        virtualKeyboard: "number" | "search" | "auto" | "url" | "text" | "email" | "tel" | undefined;
    };
    _selectItemsByValue: (value: Set<K> | null) => Promise<void>;
};
