/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { JSXInternal } from 'preact/src/jsx';

export abstract class Builder {
    public type = "base";
    public identifier: number = -1;

    abstract getHTML(): JSXInternal.Element;

    // Optional page title accessor; specific builders can override
    getPageTitle(): string | undefined { return undefined; }

    id = (id: string) => `${id}:${this.identifier}`;

    propertyFromId = (elementId: string) => elementId.split(':')[0]; // Strip suffix from 1234:567 to get property name
}
