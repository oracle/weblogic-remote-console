import { ComponentProps } from 'preact';
import { ComponentMessageItem } from '../UNSAFE_ComponentMessage';
import { InlineRequired } from './InlineRequired';
import { TestIdProps } from "../hooks/UNSAFE_useTestId";
export type UserAssistanceDensityType = 'reflow' | 'efficient';
type Props = {
    assistiveText?: string;
    fieldLabel?: string;
    helpSourceLink?: string;
    helpSourceText?: string;
    id?: string;
    isRequiredShown?: boolean;
    requiredAlignment?: ComponentProps<typeof InlineRequired>['align'];
    messages?: ComponentMessageItem[];
    userAssistanceDensity?: UserAssistanceDensityType;
} & TestIdProps;
export declare function InlineUserAssistance({ assistiveText, fieldLabel, helpSourceLink, helpSourceText, id, isRequiredShown, requiredAlignment, messages, userAssistanceDensity, testId }: Props): import("preact").JSX.Element | null;
export {};
