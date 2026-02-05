/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import ArrayTreeDataProvider = require('ojs/ojarraytreedataprovider');
import { TemplateSlot } from 'ojs/ojvcomponent';
/**
 * @description
 * Context for legend item template.
 */
export type LegendItemTemplateContext<K, D> = {
    /**
     * @description
     * The data object of the current item.
     */
    data: D;
    /**
     * @description
     * The key of the current item.
     */
    key: K;
    /**
     * @description
     * The zero-based index of the current item relative to the parent.
     */
    index: number;
    /**
     * @description
     * An array of data objects of the outermost to innermost parents of the node
     */
    parentData?: Array<D>;
    /**
     * @description
     * The key of the parent node
     */
    parentKey?: K;
};
/**
 * @description
 * Context for legend section template.
 */
export type LegendSectionTemplateContext<K, D> = {
    /**
     * @description
     * The data object of the current section.
     */
    data: D;
    /**
     * @description
     * The key of the current section.
     */
    key: K;
    /**
     * @description
     * The zero-based index of the current section.
     */
    index: number;
};
/**
 * Hook that returns the processed sectional legend data.
 * TODO: JET-59089 replace with proper useTreeDataProvider
 * @returns
 */
export declare function useSectionData<K, D extends any>(dataProvider: ArrayTreeDataProvider<K, D>, addBusyState: (description: string) => () => void, sectionTemplate?: TemplateSlot<LegendSectionTemplateContext<K, D>>, itemTemplate?: TemplateSlot<LegendItemTemplateContext<K, D>>): {
    sections: any[];
    idToDPItemMap: Map<K, D>;
};
