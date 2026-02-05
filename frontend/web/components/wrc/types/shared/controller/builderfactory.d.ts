import { Builder } from "./builder";
import { ResourceContext } from "wrc/integration/resource-context";
export declare let seed: number;
export declare class BuilderFactory {
    rdj: string;
    pdj: string | undefined;
    resourceContext: ResourceContext | undefined;
    context: string | undefined;
    constructor(rdj: string, pdj: string | undefined, resourceContext: ResourceContext | undefined, context: string | undefined);
    build(): Promise<Builder | undefined>;
}
