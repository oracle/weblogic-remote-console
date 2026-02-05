/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { TemplateSlot } from 'ojs/ojvcomponent';
/**
 * @param datum The datum from data provider.
 * @param template The template slot.
 * @param getContext The function that returns template context.
 * @param templateName The name of the template element.
 * @returns
 */
export declare const processNodeTemplate: (datum: any, template: TemplateSlot<any>, context: any, templateName: string) => Record<string, any>;
/**
 * @param data The array of data from data provider.
 * @param template The template slot.
 * @param getContext The function that returns template context.
 * @param templateName The name of the template element.
 * @returns
 */
export declare const processTemplate: (data: any[], template: TemplateSlot<any>, getContext: (context: any, index: number) => any, templateName: string) => Record<string, any>[];
