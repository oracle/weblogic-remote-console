/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { ValueUpdateDetail } from '@oracle/oraclejet-preact/utils/UNSAFE_valueUpdateDetail';
import type { ItemContext } from 'ojs/ojcommontypes';
import type { SelectSingleProps } from './select-single';
/**
 * This hook manages state and other related props for the Select Single component.
 */
export declare function useSelectSinglePreact<V extends string | number, D extends Record<string, any>>({ advancedSearch, collectionTemplate, data, disabled, displayOptions, itemTemplate, itemText, labelEdge, labelHint, labelStartWidth, matchBy: propMatchBy, messagesCustom, placeholder, readonly, readonlyUserAssistanceShown, requiredMessageDetail: propRequiredMessageDetail, required, textAlign, userAssistanceDensity, value: propValue, valueItem: propValueItem, virtualKeyboard, onMessagesCustomChanged, onOjAdvancedSearchAction, onOjValueAction, onValidChanged, onValueChanged, onValueItemChanged, ...otherProps }: SelectSingleProps<V, D>, addBusyState: (desc?: string) => () => void): {
    methods: {
        reset: () => void;
        showMessages: () => void;
        validate: () => Promise<"valid" | "invalid">;
    };
    selectSingleProps: {
        advancedSearch: "off" | "on" | undefined;
        'aria-describedby': string | undefined;
        collectionRenderer: ((collectionRendererProps: import("@oracle/oraclejet-preact/UNSAFE_SelectSingle/SelectSingle.types").CollectionRendererProps<V, D>) => import("preact").ComponentChildren) | undefined;
        data: import("@oracle/oraclejet-preact/UNSAFE_Collection").DataState<V, D> | null;
        isDisabled: boolean | undefined;
        isLoading: boolean;
        isReadonly: boolean | undefined;
        isRequired: boolean | undefined;
        isRequiredShown: boolean | undefined;
        itemRenderer: ((itemRendererProps: import("@oracle/oraclejet-preact/UNSAFE_SelectSingle/SelectSingle.types").ItemRendererProps<V, D>) => import("preact").ComponentChildren) | undefined;
        itemText: keyof D | ((itemContext: ItemContext<V, D>) => string);
        label: string;
        labelEdge: "none" | "start" | "top" | "inside" | undefined;
        labelStartWidth: import("@oracle/oraclejet-preact/utils/UNSAFE_size").Size | undefined;
        messages: import("@oracle/oraclejet-preact/UNSAFE_ComponentMessage").ComponentMessageItem[] | undefined;
        onAdvancedSearchAction: ({ searchText }: {
            searchText?: string;
        }) => void;
        onCommit: ({ previousValue, value }: ValueUpdateDetail<V>) => Promise<void>;
        onFilter: ({ searchText }: {
            searchText?: string;
        }) => void;
        onLoadRange: (range: import("@oracle/oraclejet-preact/UNSAFE_Collection").Range) => void;
        placeholder: string | undefined;
        textAlign: "end" | "start" | "right" | undefined;
        userAssistanceDensity: import("@oracle/oraclejet-preact/UNSAFE_UserAssistance").UserAssistanceDensityType | undefined;
        valueItem: ItemContext<V, D> | undefined;
        virtualKeyboard: "number" | "search" | "auto" | "url" | "text" | "email" | "tel" | undefined;
    };
    _doAdvancedSearchAction: (searchText: string) => void;
    _selectItemByValue: (value: V | null) => Promise<void>;
};
