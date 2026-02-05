import { JSXInternal } from 'preact/src/jsx';
export declare abstract class Builder {
    type: string;
    identifier: number;
    abstract getHTML(): JSXInternal.Element;
    getPageTitle(): string | undefined;
    id: (id: string) => string;
    propertyFromId: (elementId: string) => string;
}
