import { ComponentChildren } from 'preact';
import { UserAssistanceDensityType } from './InlineUserAssistance';
import { TestIdProps } from "../hooks/UNSAFE_useTestId";
type Props = {
    id?: string;
    children?: ComponentChildren;
    variant?: UserAssistanceDensityType;
} & TestIdProps;
export declare function InlineUserAssistanceContainer({ variant, children, id, testId }: Props): import("preact").JSX.Element | null;
export {};
