import { ExternalHelp } from "./pdj";
import { Resource } from "./rdj";
export interface Response {
    messages?: Message[];
    resourceData?: Resource;
    reinit?: boolean;
}
export interface Message {
    severity: string;
    message?: string;
    detail?: string;
    property: string;
}
export interface HelpData {
    detailedHelpHTML?: string;
    externalHelp?: ExternalHelp;
    helpLabel?: string;
    helpSummaryHTML?: string;
}
