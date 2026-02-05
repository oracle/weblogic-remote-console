/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps, ContextType } from 'preact';
import { CardGridView as PreactCardGridView } from '@oracle/oraclejet-preact/UNSAFE_CardGridView';
import { CardViewProps } from './card-view';
import { BusyStateContext } from '@oracle/oraclejet-preact/hooks/UNSAFE_useBusyStateContext';
type PreactCardViewProps = ComponentProps<typeof PreactCardGridView>;
export declare const useCardViewPreact: <K extends string | number, D>({ "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, data: propData, gutterSize, focusBehavior, selected, onSelectedChanged, scrollPolicyOptions, selectionMode, initialAnimation, columns: corePackColumns, reorderable, onOjReorder, onCurrentItemChanged, skeletonTemplate }: Partial<CardViewProps<K, D>>, isClickthroughDisabled: (target: EventTarget | null) => boolean, busyStateContext: ContextType<typeof BusyStateContext>) => {
    status: "error" | "loading" | "success";
    cardViewProps: PreactCardViewProps;
};
export {};
