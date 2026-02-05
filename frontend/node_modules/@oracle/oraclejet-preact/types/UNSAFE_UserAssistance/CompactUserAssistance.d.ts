import { RefObject } from 'preact/compat';
import { ComponentMessageItem } from '../UNSAFE_ComponentMessage';
import { Coords } from '../UNSAFE_Floating';
type Props = {
    anchorRef: RefObject<HTMLElement | Coords>;
    assistiveText?: string;
    fieldLabel?: string;
    id?: string;
    messages?: ComponentMessageItem[];
};
export declare function CompactUserAssistance({ anchorRef, assistiveText, fieldLabel, id, messages }: Props): import("preact/compat").JSX.Element | null;
export {};
