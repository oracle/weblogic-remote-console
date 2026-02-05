/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { HelpData } from "./common";
import { PropertyValue, Reference } from "./rdj";

export interface PDJ {
    introductionHTML: string;
    helpPageTitle: string;
    helpTopics: HelpTopic[];
    sliceForm?: SliceForm;
    actionInputForm?: ActionInputForm;
    createForm?: CreateForm;
    form?: Form;
    table?: Table;
    sliceTable?: SliceTable;
    presentationHint?: string;
}

export interface HelpTopic {
    label: string;
    href: string;
}

export interface Presentation {
    singleColumn?: boolean;
    width?: string;
}

export interface CreateForm {
    presentation?: Presentation;
    properties: Property[];
    sections: Section[];
}

export interface Form {
    presentation?: Presentation;
    slices?: Slice[];
    properties?: Property[];
    advancedProperties?: Property[];
    readOnly?: boolean;
    sections?: Section[];
}

export interface Section {
    properties?:       Property[];
    usedIf?:           UsedIf;
    sections?:         Section[];
    title?:            string;
    introductionHTML?: string;
}

export interface SliceForm {
    presentation?: Presentation;
    slices?: Slice[];
    properties?: Property[];
    advancedProperties?: Property[];
    readOnly?: boolean;
    actions?: Action[];
}

export interface ActionInputForm {
    properties?: Property[];
}

export interface ExternalHelp {
    title: string;
    label: string;
    introLabel: string;
    href: string;
}

export interface Property {
    array: boolean;
    name: string;
    label: string;
    helpLabel: string;
    helpSummaryHTML: string;
    detailedHelpHTML: string;
    legalValues?: LegalValue[];
    externalHelp: ExternalHelp;
    defaultValue?: boolean | number | null | string | [boolean | number | null | string];
    restartNeeded?: boolean;
    usedIf?: UsedIf;
    type?: string;
    secureDefaultValue?: boolean;
    required?: boolean;
    readOnly?: boolean;
    width?: string;
    presentation?: Presentation;
    supportsModelTokens?: boolean;
}

export interface Presentation {
    inlineFieldHelp?: string;
    width?: string;
}

export interface LegalValue {
    value: string;
    label: string;
}

export interface UsedIf {
    property: string;
    values: PropertyValue[];
}

export interface Slice {
    name: string;
    label: string;
    slices?: Slice[];
}

export interface Table {
    displayedColumns:     Column[];
    hiddenColumns:        Column[];
    requiresRowSelection: boolean;
    rowSelectionProperty: string;
    navigationProperty:   string;
    defaultSortProperty:  string;
    ordered?:              boolean;
    actions?:             Action[];
}

export interface SliceTable {
    slices?: Slice[];
    displayedColumns:     Column[];
    requiresRowSelection: boolean;
    rowSelectionProperty: string;
    navigationProperty:   string;
    readOnly: boolean;
    actions?: Action[];
}

export interface Action {
    name:                      string;
    label:                     string;
    saveFirstLabel?:           string;
    rows?:                     string;
    helpLabel?:                string;
    helpSummaryHTML?:          string;
    detailedHelpHTML?:         string;
    externalHelp?:             ExternalHelp;
    polling?:                  Polling;
    actions?:                  Action[];
}

export interface Polling {
    reloadSeconds: number;
    maxAttempts:   number;
}

export interface Column extends HelpData {
    name:             string;
    label:            string;
    key?:             boolean;
    type?:            string;
}
