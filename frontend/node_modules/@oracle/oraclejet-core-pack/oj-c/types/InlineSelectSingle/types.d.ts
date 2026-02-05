import type { ItemContext } from 'ojs/ojcommontypes';
import type { Item } from 'ojs/ojdataprovider';
import type { InlineSelectSingle } from '@oracle/oraclejet-preact/UNSAFE_InlineSelectSingle';
import { ComponentProps } from 'preact';
export type Key = string | number;
export type Data = Record<string, unknown>;
type InlineSelectSingleProps<V extends Key, D extends Data> = ComponentProps<typeof InlineSelectSingle<V, D>>;
export type InlineSelectHandle = {
    focus: () => void;
    blur: () => void;
};
/**
 * Payload for the valueAction event
 */
export type ValueActionPayload<V extends Key, D extends Data> = {
    itemContext: ItemContext<V, D> | null;
    previousValue: V | null;
    value: V | null;
    reason: Parameters<InlineSelectSingleProps<V, D>['onCommit']>[0]['reason'];
};
export type ItemRendererContext<V, D> = {
    searchText?: string;
    item: Item<V, D>;
};
export type ItemText<V, D> = keyof D | ((item: ItemContext<V, D>) => string);
export {};
