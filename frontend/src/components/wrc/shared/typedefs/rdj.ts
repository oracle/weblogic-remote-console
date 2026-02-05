/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { PDJ } from "./pdj";

export interface RDJ {
    introductionHTML?: string;
    navigation:      string;
    self:            Reference;
    breadCrumbs: Reference[];
    dashboardCreateForm?: Reference;
    links:           Reference[];
    changeManager: ChangeManager;
    createForm: Reference;
    invoker?: Reference;
    data?: Record<string, PropertyValueHolder> | Datum[] | ListDatum[];
    deletable?:      boolean;
    pageDescription: string;
    inlinePageDescription?: PDJ;
    actions?: ActionConfigurations;
    selected?: string[];
    fileSaver?: {
        mimeType: string;
        contents: any;
        filename?: string;
    };
}

export type Datum = Record<string, PropertyValueHolder>;

export interface ListDatum  {
    label: string;
    name: string;
    description: string;
    resourceData: Reference;
    type?: string;
}

export interface Reference extends Resource {
    label?: string;
}

export interface ChangeManager {
    locked:          boolean;
    mergeNeeded:     boolean;
    supportsChanges: boolean;
}

export type PropertyValue = boolean | number | string | PropertyValueArrayMember  | Reference | null;

export type PropertyValueArrayMember = { value: PropertyValue };

export interface PropertyValueHolder {
    set?:            boolean;
    value?:          PropertyValue[] | PropertyValue | Reference | File;
    modelToken?:     string;
    indirect?:       boolean;
    options?:        Option[];
    optionsSources?: Reference[];
}

export interface Option {
    label: string;
    value: Reference | null;
}

export type ActionConfigurations = Record<string, ActionConfiguration>;

export interface ActionConfiguration {
    inputForm?: Resource
    invoker?: Resource;
}

export interface Resource {
    resourceData?: string;
    externalLink?: string;
    unresolvedReference?: string;
}


export interface ResponseWithStatusData {
    statusData: StatusData;
}

export interface StatusData {
    shoppingcart: Shoppingcart;
    providers: Providers;
    contexts?: Record<string, Context>
}

export interface Providers {
    current:   Current;
    providers: Provider[];
}

export interface Message {
    link: Reference;
    messageSummary: string;
    severity: string;
}

export interface Current {
    lastRootUsed: string;
    state:        string;
    roots: Root[];
    messages?: Message[];
    insecure?: boolean;
}

export interface Root {
    name:           string;
    label:          string;
    description:    string;
    navtree:        string;
    simpleSearch:   string;
    changeManager?: string;
    actionsEnabled: boolean;
    readOnly?:      boolean;
}

export interface Provider {
    resourceData: string;
    label:        string;
}

export interface Shoppingcart {
    state:        string;
    resourceData: string;
}


export interface Context {
    currentProvider?: Current;
    shoppingcart?: Shoppingcart;
    isBookmarked?: boolean;
    "back-resource-data"?: string;
    "forward-resource-data"?: string;
    navigation?: string;
}

export interface EntitleNetExpression {
    resourceId:          string;
    supportedPredicates: SupportedPredicate[];
    stringExpression:    string;
    parsedExpression:    ParsedExpression;
}

export interface ParsedExpression {
    type:       ParsedExpressionType;
    children?:  ParsedExpression[];
    name?:      string;
    arguments?: string[];
}

export enum ParsedExpressionType {
    Or = "or",
    And = "and",
    Group = "group",
    Predicate = "predicate",
}

export interface SupportedPredicate {
    className:       string;
    displayName:     string;
    descriptionHTML: string;
    arguments:       SupportedPredicateArgument[];
}

export interface SupportedPredicateArgument {
    displayName:     string;
    descriptionHTML: string;
    array:           boolean;
    optional:        boolean;
}
