import { ImmutableKeySet } from 'ojs/ojkeyset';
import { PropertyChanged } from 'ojs/ojvcomponent';
type K = string | number;
export type SelectionInfo<K> = {
    selected?: ImmutableKeySet<K>;
    selectionMode?: 'single' | 'multiple' | 'none';
    onSelectedChange?: PropertyChanged<ImmutableKeySet<K>>;
};
export declare const SelectionContext: import("preact").Context<SelectionInfo<K> | undefined>;
export {};
