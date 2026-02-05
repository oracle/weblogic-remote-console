/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Item } from 'ojs/ojdataprovider';
import { TemplateSlot } from 'ojs/ojvcomponent';
import { CellTemplateContext, FooterTemplateContext, HeaderTemplateContext, NoDataContext, RowContext, TableDefaultColumnKey } from '../table';
import { TableRendererContext as PreactRendererContext, TableRowContext as PreactRowContext, TableHeaderRendererContext as PreactHeaderRendererContext, TableFooterRendererContext as PreactFooterRendererContext, TableNoDataRendererContext as PreactNoDataRendererContext } from '@oracle/oraclejet-preact/UNSAFE_TableView';
export declare function getRowContext<K, D>(context: PreactRowContext<K, Item<K, D>>): RowContext<K, D>;
export declare function getPreactRowKey<K, D>(data: Item<K, D>): K;
export declare function getPreactCellRenderer<K, D, C>(cellTemplate?: TemplateSlot<CellTemplateContext<K, D, C>>, field?: keyof D): (context: PreactRendererContext<K, Item<K, D>, C | TableDefaultColumnKey>) => import("preact").ComponentChildren;
export declare function getPreactHeaderRenderer<C>(headerTemplate?: TemplateSlot<HeaderTemplateContext<C>>): ((context: PreactHeaderRendererContext<C | TableDefaultColumnKey>) => import("preact").ComponentChildren) | undefined;
export declare function getPreactFooterRenderer<C>(footerTemplate?: TemplateSlot<FooterTemplateContext<C>>): ((context: PreactFooterRendererContext<C | TableDefaultColumnKey>) => import("preact").ComponentChildren) | undefined;
export declare function getPreactNoDataRenderer(noData?: TemplateSlot<NoDataContext>): ((context: PreactNoDataRendererContext) => import("preact").ComponentChildren) | undefined;
export declare function tableCellSelectorRenderer<K, D, C>(context: PreactRendererContext<K, Item<K, D>, C | TableDefaultColumnKey>): import("preact").ComponentChildren;
export declare function tableHeaderSelectorRenderer<C>(context: PreactHeaderRendererContext<C | TableDefaultColumnKey>): import("preact").JSX.Element | undefined;
